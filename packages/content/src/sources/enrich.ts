/**
 * Editorial-metadata enrichment via DeepSeek.
 *
 * IMPORTANT — the honest boundary: this NEVER touches originalText/englishText
 * (those are sourced verbatim). It only generates derived, search/display
 * metadata — summary, similar questions, context — which is always recorded with
 * `metadataSource` = the model name, so AI-authored metadata is distinguishable
 * from human-authored ("editorial") metadata.
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
config({ path: resolve(import.meta.dirname, '../../../../.env') });

const API_KEY = process.env.DEEPSEEK_API_KEY ?? '';
const BASE = process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com';
export const ENRICH_MODEL = 'deepseek-v4-flash';

export interface EnrichInput {
  thinkerName: string;
  tradition: string;
  canonicalRef: string;
  originalText: string;
  englishText: string;
  allowedTags: string[];
}

export interface EnrichOutput {
  summaryEn: string;
  summaryZh: string;
  similarQuestions: string[];
  contextNote: string;
  tags: string[];
  weight: number;
}

const SYSTEM = `You are a scholar of world philosophy and religion building search and display metadata for an authoritative, source-traceable quote database aimed at ordinary people seeking guidance for life questions.
You are given a VERBATIM, already-sourced passage (original text + an established translation). Do NOT alter, re-translate, paraphrase, or invent any quotation. Produce ONLY derived metadata.
Respond with a single strict JSON object, no markdown, with exactly these keys:
- "summaryEn": one plain-English sentence a layperson understands (no jargon).
- "summaryZh": one concise Simplified Chinese sentence (白话).
- "similarQuestions": array of 3-4 real, first-person life questions (English) this passage genuinely speaks to.
- "contextNote": 1-2 sentences of historical context and applicability boundaries.
- "tags": array of 2-4 slugs chosen ONLY from the provided allowed list.
- "weight": integer 1-5 for how central/quotable this passage is.`;

interface ChatResponse {
  choices?: { message?: { content?: string } }[];
  error?: unknown;
}

export async function enrich(input: EnrichInput, retries = 2): Promise<EnrichOutput> {
  const user = `Thinker: ${input.thinkerName} (tradition: ${input.tradition})
Reference: ${input.canonicalRef}
Original: ${input.originalText}
Translation: ${input.englishText}

Allowed tag slugs (choose only from these): ${input.allowedTags.join(', ')}`;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: ENRICH_MODEL,
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: user },
          ],
          temperature: 0.4,
          max_tokens: 1100,
          response_format: { type: 'json_object' },
          // v4 models think by default and the reasoning eats max_tokens; we want the JSON directly.
          thinking: { type: 'disabled' },
        }),
      });
      if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}: ${await res.text()}`);
      const data = (await res.json()) as ChatResponse;
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('empty completion');

      const raw = JSON.parse(content) as Partial<EnrichOutput>;
      const allowed = new Set(input.allowedTags);
      const out: EnrichOutput = {
        summaryEn: String(raw.summaryEn ?? '').trim(),
        summaryZh: String(raw.summaryZh ?? '').trim(),
        similarQuestions: (Array.isArray(raw.similarQuestions) ? raw.similarQuestions : [])
          .map((q) => String(q).trim())
          .filter(Boolean)
          .slice(0, 5),
        contextNote: String(raw.contextNote ?? '').trim(),
        tags: (Array.isArray(raw.tags) ? raw.tags : []).map((t) => String(t).trim()).filter((t) => allowed.has(t)).slice(0, 4),
        weight: Math.min(5, Math.max(1, Math.round(Number(raw.weight) || 3))),
      };
      if (!out.summaryEn || !out.summaryZh || out.similarQuestions.length === 0) {
        throw new Error(`incomplete enrichment: ${JSON.stringify(out)}`);
      }
      return out;
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw new Error(`enrich failed for ${input.canonicalRef}: ${String(lastErr)}`);
}
