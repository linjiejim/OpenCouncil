import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { TtlCache } from '../lib/cache.js';
import { createLlm, type Llm } from '../lib/llm.js';
import { LlmGuard, requestIp } from '../lib/llm-guard.js';
import { TokenBucket } from '../lib/rate-limit.js';
import { asRows } from '../lib/rows.js';
import { toOrTsQuery } from '../lib/search-query.js';

/** Detect if a string contains Chinese characters */
function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

/** Translate a Chinese query to English for better search; falls back to the original on any failure. */
async function translateToEnglish(text: string, llm: Llm): Promise<string> {
  try {
    const completion = await llm.client.chat.completions.create({
      model: llm.model,
      messages: [
        {
          role: 'system',
          content: 'You are a translator. Translate the following Chinese question/phrase into natural English. Output ONLY the English translation, nothing else. Keep it concise and natural.',
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
      max_tokens: 200,
      ...llm.extraBody,
    });

    return completion.choices[0]?.message?.content?.trim() || text;
  } catch (err) {
    console.error('Translation failed, falling back to original:', err);
    return text;
  }
}

export interface SearchDeps {
  llm?: Llm;
  guard?: LlmGuard;
}

export function searchRoute(db: Database, deps: SearchDeps = {}) {
  const app = new Hono();
  const llm = deps.llm ?? createLlm();
  const guard = deps.guard ?? new LlmGuard();
  // Translation is a nicety: cached, separately rate-limited per IP (30/hour), and
  // skipped (search runs on the original text) when the IP or the site budget is out.
  const translations = new TtlCache<string>(24 * 3_600_000, 1000);
  const ipBucket = new TokenBucket(10, 30 / 3600);

  async function maybeTranslate(q: string, ip: string): Promise<string> {
    const key = q.trim().toLowerCase();
    const hit = translations.get(key);
    if (hit) return hit;
    if (!ipBucket.take(ip) || !guard.useCall()) return q;
    const en = await translateToEnglish(q, llm);
    if (en !== q) translations.set(key, en);
    return en;
  }

  app.get('/', async (c) => {
    const q = c.req.query('q');
    if (!q) return c.json({ results: [], total: 0 });

    const tradition = c.req.query('tradition');
    const thinkerSlug = c.req.query('thinker');
    const tag = c.req.query('tag');
    const limit = Math.min(Number(c.req.query('limit') ?? 20), 50);
    const offset = Number(c.req.query('offset') ?? 0);

    // Always expand query to English keywords for better recall
    let searchQuery = q;
    let translatedFrom: string | undefined;
    if (containsChinese(q)) {
      translatedFrom = q;
      searchQuery = await maybeTranslate(q, requestIp(c));
    }

    const orQuery = toOrTsQuery(searchQuery);
    if (!orQuery) {
      return c.json({ results: [], total: 0, limit, offset, ...(translatedFrom ? { translatedFrom, translatedTo: searchQuery } : {}) });
    }

    try {
      const conditions = [sql`p.search_vec @@ to_tsquery('english', ${orQuery})`];

      if (tradition) conditions.push(sql`t.tradition = ${tradition}`);
      if (thinkerSlug) conditions.push(sql`t.slug = ${thinkerSlug}`);

      const whereClause = sql.join(conditions, sql` AND `);

      const results = await db.execute(sql`
        SELECT
          p.id, p.original_text, p.english_text, p.summary_en, p.summary_zh,
          p.similar_questions, p.context_note, p.sort_order, p.weight,
          p.canonical_ref, p.transliteration, p.translator, p.source_url,
          p.license, p.verification_status, p.metadata_source,
          c.id as chapter_id, c.title_en as chapter_title_en, c.title_zh as chapter_title_zh,
          w.id as work_id, w.title_en as work_title_en, w.title_zh as work_title_zh,
          t.id as thinker_id, t.slug as thinker_slug, t.name_en as thinker_name_en, 
          t.name_zh as thinker_name_zh, t.tradition, t.era, t.portrait_url,
          ts_rank(p.search_vec, to_tsquery('english', ${orQuery})) * p.weight as rank,
          ts_headline('english', p.english_text, to_tsquery('english', ${orQuery}), 
            'MaxWords=60, MinWords=20, StartSel=<mark>, StopSel=</mark>') as headline
        FROM passages p
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE ${whereClause}
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${offset}
      `);

      const countResult = await db.execute(sql`
        SELECT count(*)::int as total
        FROM passages p
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE p.search_vec @@ to_tsquery('english', ${orQuery})
      `);

      return c.json({
        results: asRows(results),
        total: Number(asRows<{ total: number }>(countResult)[0]?.total ?? 0),
        limit,
        offset,
        ...(translatedFrom ? { translatedFrom, translatedTo: searchQuery } : {}),
      });
    } catch (err: any) {
      console.error('Search error:', err);
      return c.json({ error: 'Search failed' }, 500);
    }
  });

  // GET /by-tag/:slug — passages for a specific tag
  app.get('/by-tag/:slug', async (c) => {
    const slug = c.req.param('slug');
    const limit = Math.min(Number(c.req.query('limit') ?? 30), 50);

    try {
      // First try passage_tags join
      const tagResults = await db.execute(sql`
        SELECT 
          p.id, p.original_text, p.english_text, p.summary_en, p.summary_zh,
          p.context_note, p.weight,
          c.title_en as chapter_title_en, c.title_zh as chapter_title_zh,
          w.id as work_id, w.title_en as work_title_en, w.title_zh as work_title_zh,
          t.slug as thinker_slug, t.name_en as thinker_name_en,
          t.name_zh as thinker_name_zh, t.tradition, t.era
        FROM passage_tags pt
        JOIN tags tg ON tg.id = pt.tag_id
        JOIN passages p ON p.id = pt.passage_id
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE tg.slug = ${slug}
        ORDER BY p.weight DESC, t.tradition
        LIMIT ${limit}
      `);

      const tagRows = asRows(tagResults);
      if (tagRows.length > 0) {
        return c.json({ results: tagRows });
      }

      // Fallback: keyword search using the tag's English name
      const tagNameResult = await db.execute(sql`
        SELECT name_en FROM tags WHERE slug = ${slug} LIMIT 1
      `);
      const tagName = asRows<{ name_en: string }>(tagNameResult)[0]?.name_en;
      if (!tagName) return c.json({ results: [] });

      const searchTerm = toOrTsQuery(tagName);
      if (!searchTerm) return c.json({ results: [] });

      const results = await db.execute(sql`
        SELECT 
          p.id, p.original_text, p.english_text, p.summary_en, p.summary_zh,
          p.context_note, p.weight,
          c.title_en as chapter_title_en, c.title_zh as chapter_title_zh,
          w.id as work_id, w.title_en as work_title_en, w.title_zh as work_title_zh,
          t.slug as thinker_slug, t.name_en as thinker_name_en,
          t.name_zh as thinker_name_zh, t.tradition, t.era
        FROM passages p
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE p.search_vec @@ to_tsquery('english', ${searchTerm})
        ORDER BY ts_rank(p.search_vec, to_tsquery('english', ${searchTerm})) * p.weight DESC
        LIMIT ${limit}
      `);

      return c.json({ results: asRows(results) });
    } catch (err: any) {
      console.error('Tag search error:', err);
      return c.json({ results: [] });
    }
  });

  return app;
}
