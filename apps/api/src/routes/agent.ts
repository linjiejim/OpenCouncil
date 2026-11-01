/**
 * Agent-facing surface — `/api/agent/*`.
 *
 * Authenticated (bearer key), rate-limited, and cached. This is the scaffolding
 * for "OpenCouncil for Agents". The first primitive is cited, cross-tradition
 * RETRIEVAL with no LLM cost: given a question, return the most relevant VERIFIED
 * passages with full provenance, plus an honest `grounding.coverage` signal so a
 * downstream agent can tell "strong support" from "thin" from "none" — and a
 * disclaimer that these are perspectives to widen consideration, not directives.
 *
 * (The LLM "consult" synthesis and the daily reflection feed are a later phase;
 * they reuse this same auth/limit/cache stack.)
 */
import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { asRows } from '../lib/rows.js';
import { toOrTsQuery } from '../lib/search-query.js';
import { bearerAuth, rateLimit, type AgentEnv } from '../lib/auth.js';
import { TtlCache } from '../lib/cache.js';

const DISCLAIMER =
  'Perspectives grounded in primary sources, offered to widen consideration — not directives. Verify every citation via its sourceUrl.';

export function agentRoute(db: Database) {
  const app = new Hono<AgentEnv>();
  app.use('*', bearerAuth(db));
  app.use('*', rateLimit());

  const cache = new TtlCache<unknown>(1000 * 60 * 60); // 1 hour

  // Authed liveness ping (also confirms a key works).
  app.get('/health', (c) => c.json({ ok: true, key: c.get('apiKey').label, time: new Date().toISOString() }));

  // GET /passages?q=...&limit=6 — cited retrieval over the VERIFIED corpus (no LLM).
  app.get('/passages', async (c) => {
    const q = (c.req.query('q') ?? '').trim();
    if (!q) return c.json({ error: 'Query parameter q is required' }, 400);
    const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 6), 1), 20);

    const cacheKey = `passages:${limit}:${q.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      c.header('X-Cache', 'HIT');
      return c.json(cached);
    }

    const respond = (passages: unknown[]) => {
      const coverage = passages.length === 0 ? 'none' : passages.length < 3 ? 'thin' : 'strong';
      const payload = { query: q, grounding: { coverage, passagesFound: passages.length }, passages, disclaimer: DISCLAIMER };
      cache.set(cacheKey, payload);
      c.header('X-Cache', 'MISS');
      return c.json(payload);
    };

    const orQuery = toOrTsQuery(q);
    if (!orQuery) return respond([]); // English keywords only for this cheap primitive

    try {
      const rows = await db.execute(sql`
        SELECT
          t.name_en as thinker, t.slug as thinker_slug, t.tradition, t.era,
          w.title_en as work, c.title_en as chapter,
          p.canonical_ref, p.original_text, p.english_text, p.summary_en,
          p.original_lang, p.translator, p.source_url, p.license, p.verification_status,
          ts_rank(p.search_vec, to_tsquery('english', ${orQuery})) * p.weight as rank
        FROM passages p
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE p.search_vec @@ to_tsquery('english', ${orQuery})
          AND p.verification_status = 'verified'
        ORDER BY rank DESC
        LIMIT ${limit}
      `);
      const passages = asRows<Record<string, unknown>>(rows).map((r) => ({
        thinker: r.thinker,
        tradition: r.tradition,
        era: r.era,
        work: r.work,
        chapter: r.chapter,
        canonicalRef: r.canonical_ref,
        originalText: r.original_text,
        englishText: r.english_text,
        summary: r.summary_en,
        citation: {
          canonicalRef: r.canonical_ref,
          sourceUrl: r.source_url,
          translator: r.translator,
          license: r.license,
          originalLang: r.original_lang,
          verificationStatus: r.verification_status,
        },
      }));
      return respond(passages);
    } catch (err: any) {
      console.error('Agent passages error:', err);
      return c.json({ error: 'Retrieval failed', details: err?.message }, 500);
    }
  });

  return app;
}
