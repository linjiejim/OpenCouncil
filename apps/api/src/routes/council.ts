import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import OpenAI from 'openai';
import { asRows } from '../lib/rows.js';
import { toOrTsQuery } from '../lib/search-query.js';
import { NO_THINKING } from '../lib/deepseek.js';
import { isScripture } from '@opencouncil/types';

/** Detect if a string contains CJK characters */
function containsNonLatin(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u30ff\uac00-\ud7af\u0400-\u04ff\u0600-\u06ff]/.test(text);
}

/** Expand a search query: translate non-English, extract keywords */
async function expandSearchQuery(text: string, client: OpenAI): Promise<string> {
  // Always translate/expand for better search recall
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        {
          role: 'system',
          content: `You are a search query expander. Given a question (in any language), output ONLY a short list of English search keywords separated by spaces. Focus on the core philosophical concepts. No punctuation, no quotes, no explanation. Example input: "如何面对死亡" → output: "death mortality acceptance cope fear afterlife meaning"`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
      max_tokens: 100,
      ...NO_THINKING,
    });
    return completion.choices[0]?.message?.content?.trim() ?? text;
  } catch {
    return text;
  }
}

export function councilRoute(db: Database) {
  const app = new Hono();
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY ?? '',
    baseURL: (process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com') + '/v1',
  });

  // POST /ask — ask the council (supports multi-turn and @ mentions)
  app.post('/ask', async (c) => {
    const body = await c.req.json<{
      question: string;
      lang?: string;
      thinkerSlugs?: string[];         // @ mentioned thinkers
      conversationHistory?: { role: string; content: string }[];  // multi-turn
      deepDiveSlug?: string;            // deep dive with specific thinker
    }>();
    const { question, lang = 'en', thinkerSlugs, conversationHistory, deepDiveSlug } = body;
    if (!question) return c.json({ error: 'Question is required' }, 400);
    // Scriptures are described, never voiced — so there is no one-on-one deep dive with them.
    if (isScripture(deepDiveSlug)) return c.json({ error: 'Deep dive is not available for scriptures' }, 400);

    // Step 0: Expand search query (always translate/expand to English keywords)
    const expandedQuery = await expandSearchQuery(question, client);
    const orQuery = toOrTsQuery(expandedQuery);

    const noPassages = () =>
      c.json({
        questionAbstract: question,
        questionAbstractZh: '',
        perspectives: [],
        disclaimer: lang === 'zh' ? '当前文库中未找到相关段落。' : 'No relevant passages found in the current collection.',
      });

    // No usable search terms → nothing to retrieve. This also guards to_tsquery
    // from ever receiving an empty/operator-laden string (the old unhandled 500).
    if (!orQuery) return noPassages();

    // Step 1: Search for relevant passages
    const conditions = [sql`p.search_vec @@ to_tsquery('english', ${orQuery})`];

    // If specific thinkers are mentioned via @, filter to those
    if (thinkerSlugs && thinkerSlugs.length > 0) {
      // sql.join, not ANY(${array}): drizzle expands an array param into a row value.
      conditions.push(sql`t.slug IN (${sql.join(thinkerSlugs.map((s) => sql`${s}`), sql`, `)})`);
    }

    // If deep dive, filter to that thinker only
    if (deepDiveSlug) {
      conditions.push(sql`t.slug = ${deepDiveSlug}`);
    }

    const whereClause = sql.join(conditions, sql` AND `);

    let rows: any[];
    try {
      const searchResults = await db.execute(sql`
        SELECT
          p.id, p.original_text, p.english_text, p.summary_en, p.context_note,
          c.title_en as chapter_title,
          w.id as work_id, w.title_en as work_title,
          t.id as thinker_id, t.slug as thinker_slug, t.name_en as thinker_name,
          t.name_zh as thinker_name_zh, t.tradition, t.era, t.portrait_url,
          ts_rank(p.search_vec, to_tsquery('english', ${orQuery})) * p.weight as rank
        FROM passages p
        JOIN chapters c ON c.id = p.chapter_id
        JOIN works w ON w.id = c.work_id
        JOIN thinkers t ON t.id = w.thinker_id
        WHERE ${whereClause}
        ORDER BY rank DESC
        LIMIT 30
      `);
      rows = asRows<any>(searchResults);
    } catch (err: any) {
      console.error('Council search error:', err);
      return c.json({ error: 'Search failed', details: err?.message }, 500);
    }

    if (rows.length === 0) return noPassages();

    // Step 2: Group by thinker
    const byThinker = new Map<string, any[]>();
    for (const row of rows) {
      const key = row.thinker_slug;
      if (!byThinker.has(key)) byThinker.set(key, []);
      byThinker.get(key)!.push(row);
    }

    const maxThinkers = deepDiveSlug ? 1 : (thinkerSlugs && thinkerSlugs.length > 0 ? thinkerSlugs.length : 4);
    const selectedThinkers = [...byThinker.entries()]
      .map(([slug, passages]) => ({
        slug,
        thinker: passages[0],
        passages: passages.slice(0, deepDiveSlug ? 5 : 3),
      }))
      .sort((a, b) => (b.passages[0]?.rank ?? 0) - (a.passages[0]?.rank ?? 0))
      .slice(0, maxThinkers);

    // Step 3: Build prompt
    const passageContext = selectedThinkers
      .map(({ thinker: t, passages: ps }) => {
        const passageTexts = ps
          .map((p: any) => `[Passage ID: ${p.id}] (${p.work_title}, ${p.chapter_title})\nOriginal: ${p.original_text}\nEnglish: ${p.english_text}`)
          .join('\n\n');
        const voice = isScripture(t.thinker_slug) ? ' [voice: tradition]' : '';
        return `=== ${t.thinker_name} [thinkerSlug: ${t.thinker_slug}] (${t.tradition}, ${t.era})${voice} ===\n${passageTexts}`;
      })
      .join('\n\n---\n\n');

    const responseLanguage = lang === 'zh' ? 'Chinese (Simplified)' : 'English';
    const isDeepDive = !!deepDiveSlug;

    const systemPrompt = isDeepDive
      ? `You are OpenCouncil. The user wants a deep discussion with ${selectedThinkers[0]?.thinker?.thinker_name ?? 'a thinker'}.

Rules:
1. Respond as this thinker would, grounded in the provided passages. Copy the "thinkerSlug" EXACTLY as given in [thinkerSlug: …]; never invent or alter it.
2. Use direct quotes from original texts (include both original language and translation).
3. Go deeper than a brief overview — explain the reasoning, historical context, and practical implications.
4. Keep language accessible. No jargon.
5. All your explanatory/response text MUST be in ${responseLanguage}.
6. Original quotes/citations stay in their original language.
7. If inferring beyond the text, state "Based on their philosophy..."
8. Also provide a "takeaway": ONE warm, resonant sentence (≤ 28 words, both languages) distilling the essence of what this thinker offers on the question — a line the user can carry away.

Output format (JSON):
{
  "questionAbstract": "Theme (English)",
  "questionAbstractZh": "主题（中文）",
  "takeaway": "one resonant sentence (English)",
  "takeawayZh": "一句话（中文）",
  "perspectives": [{
    "thinkerSlug": "slug",
    "response": "Deep response in ${responseLanguage}...",
    "citations": [{"passageId": 123, "quoteOriginal": "...", "quoteEnglish": "...", "workTitle": "...", "chapterTitle": "..."}],
    "isInference": false
  }]
}`
      : `You are OpenCouncil, an AI that presents perspectives from history's greatest thinkers on human questions.

Rules:
1. For each thinker, write a response grounded in the provided passages. Copy the "thinkerSlug" EXACTLY as given in [thinkerSlug: …]; never invent or alter it.
2. Use direct quotes from original texts (include both original language and translation).
3. When inferring beyond the text, state "Based on their philosophy..."
4. Keep language accessible. No jargon.
5. All your explanatory/response text MUST be in ${responseLanguage}.
6. Original quotes/citations must stay in their original language — do NOT translate them.
7. Do NOT mix teachings from different traditions in a single perspective.
8. Provide a "takeaway": ONE warm, resonant sentence (≤ 28 words, both languages) — not a summary of each view, but a single line a thoughtful person should carry away from the whole council.
9. Sources marked [voice: tradition] are scriptures. Never speak as their founder, prophet or God and never put words in their mouth; write in the third person about what the text teaches (e.g. "The Dhammapada teaches…", "In the Quran…", "The Gospels record Jesus teaching…" / "《法句经》教导……"). Name them by the text, not as a person, here and in the synthesis.
10. Provide a "synthesis" that maps the council as a deliberation:
   - "consensus" (both languages): one sentence on where these thinkers fundamentally agree.
   - "tensions": 1–3 items, each a CONCRETE divergence that NAMES the thinkers involved (both languages), e.g. "Confucius anchors the self in social duty, while Zhuangzi dissolves it into nature." Each ≤ 24 words.
   If only one perspective is present, set "tensions" to [].

Output format (JSON):
{
  "questionAbstract": "The universal theme (English)",
  "questionAbstractZh": "永恒主题（中文）",
  "takeaway": "one resonant sentence (English)",
  "takeawayZh": "一句话（中文）",
  "perspectives": [
    {
      "thinkerSlug": "slug",
      "response": "Perspective in ${responseLanguage}...",
      "citations": [{"passageId": 123, "quoteOriginal": "original", "quoteEnglish": "english", "workTitle": "Work", "chapterTitle": "Chapter"}],
      "isInference": false
    }
  ],
  "synthesis": {
    "consensus": "where they agree (English)",
    "consensusZh": "他们一致之处（中文）",
    "tensions": [ { "en": "concrete divergence naming thinkers", "zh": "点名思想家的具体分歧" } ]
  }
}`;

    // Build messages with optional conversation history
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory.slice(-6)) { // Keep last 6 turns max
        messages.push({ role: msg.role as any, content: msg.content });
      }
    }

    messages.push({
      role: 'user',
      content: `Question: "${question}"\n\nRelevant passages:\n\n${passageContext}`,
    });

    try {
      const completion = await client.chat.completions.create({
        model: 'deepseek-v4-flash',
        messages,
        temperature: 0.7,
        max_tokens: deepDiveSlug ? 6000 : 4000,
        response_format: { type: 'json_object' },
        ...NO_THINKING,
      });

      const content = completion.choices[0]?.message?.content ?? '{}';
      let parsed;
      try { parsed = JSON.parse(content); } catch { parsed = { questionAbstract: question, perspectives: [], raw: content }; }

      // Enrich with thinker metadata
      const perspectives = (parsed.perspectives ?? []).map((p: any) => {
        // Match by exact slug; fall back to name (the model occasionally alters the slug)
        const thinkerData =
          selectedThinkers.find((t) => t.slug === p.thinkerSlug) ??
          selectedThinkers.find((t) => {
            const n = (t.thinker.thinker_name ?? '').toLowerCase();
            const ps = (p.thinkerSlug ?? '').toLowerCase().replace(/-/g, ' ');
            return n && (n.includes(ps) || ps.includes(t.slug));
          });
        return {
          ...p,
          thinkerSlug: thinkerData?.slug ?? p.thinkerSlug,
          thinkerId: thinkerData?.thinker.thinker_id,
          thinkerName: thinkerData?.thinker.thinker_name ?? p.thinkerSlug,
          thinkerNameZh: thinkerData?.thinker.thinker_name_zh ?? '',
          tradition: thinkerData?.thinker.tradition ?? '',
          era: thinkerData?.thinker.era ?? '',
          portraitUrl: thinkerData?.thinker.portrait_url ?? null,
          workId: thinkerData?.passages?.[0]?.work_id ?? null,
        };
      });

      // Normalize synthesis (guard against missing fields / wrong shapes)
      const rawSynthesis = parsed.synthesis ?? null;
      const synthesis =
        rawSynthesis && (rawSynthesis.consensus || (Array.isArray(rawSynthesis.tensions) && rawSynthesis.tensions.length))
          ? {
              consensus: rawSynthesis.consensus ?? '',
              consensusZh: rawSynthesis.consensusZh ?? '',
              tensions: Array.isArray(rawSynthesis.tensions)
                ? rawSynthesis.tensions
                    .map((t: any) => (typeof t === 'string' ? { en: t, zh: '' } : { en: t?.en ?? '', zh: t?.zh ?? '' }))
                    .filter((t: any) => t.en || t.zh)
                : [],
            }
          : null;

      return c.json({
        questionAbstract: parsed.questionAbstract ?? question,
        questionAbstractZh: parsed.questionAbstractZh ?? '',
        takeaway: parsed.takeaway ?? '',
        takeawayZh: parsed.takeawayZh ?? '',
        perspectives,
        synthesis: perspectives.length > 1 ? synthesis : null,
        disclaimer:
          lang === 'zh'
            ? '⚠️ 以上回答基于思想家原著的 AI 推演。点击「查看详情」可核实引用。'
            : '⚠️ AI interpretations grounded in original texts. Click "View details" to verify citations.',
      });
    } catch (error: any) {
      console.error('Council LLM error:', error);
      return c.json({ error: 'Failed to generate council response', details: error.message }, 500);
    }
  });

  return app;
}
