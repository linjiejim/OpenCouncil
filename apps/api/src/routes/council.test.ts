import { describe, expect, it } from 'vitest';
import type { Database } from '@opencouncil/db';
import { councilCacheKey, councilRoute } from './council.js';
import { LlmGuard } from '../lib/llm-guard.js';
import type { Llm } from '../lib/llm.js';

/** A database with one Confucius passage, and a model that answers with one perspective. */
function fakes() {
  let llmCalls = 0;
  const row = {
    id: 1, original_text: '學而時習之', english_text: 'Is it not pleasant to learn…', summary_en: '', context_note: '',
    chapter_title: 'Book 1', work_id: 1, work_title: 'Analects', thinker_id: 1, thinker_slug: 'confucius',
    thinker_name: 'Confucius', thinker_name_zh: '孔子', tradition: 'confucianism', era: '551–479 BCE', portrait_url: null, rank: 1,
  };
  const db = { execute: async () => [row] } as unknown as Database;
  const llm: Llm = {
    model: 'test',
    extraBody: {},
    client: {
      chat: {
        completions: {
          create: async () => {
            llmCalls++;
            const content = llmCalls % 2 === 1
              ? 'learning practice'
              : JSON.stringify({ perspectives: [{ thinkerSlug: 'confucius', response: 'Keep learning.', citations: [] }] });
            return { choices: [{ message: { content }, finish_reason: 'stop' }] };
          },
        },
      },
    } as unknown as Llm['client'],
  };
  return { db, llm, calls: () => llmCalls };
}

const ask = (app: ReturnType<typeof councilRoute>, question: string) =>
  app.request('/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question }) });

describe('council /ask limits', () => {
  it('returns 429 rate_limited after the per-IP burst', async () => {
    const f = fakes();
    const app = councilRoute(f.db, { llm: f.llm, guard: new LlmGuard({ perIpBurst: 5, dailyLimit: 1000 }) });
    for (let i = 0; i < 5; i++) expect((await ask(app, `question ${i}`)).status).toBe(200);
    const res = await ask(app, 'one more');
    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ code: 'rate_limited' });
  });

  it('returns 429 daily_limit when the site-wide budget is spent, without calling the model', async () => {
    const f = fakes();
    const app = councilRoute(f.db, { llm: f.llm, guard: new LlmGuard({ dailyLimit: 3 }) });
    expect((await ask(app, 'first')).status).toBe(200); // 2 calls
    const res = await ask(app, 'second'); // needs 2, only 1 left
    expect(res.status).toBe(429);
    expect(await res.json()).toMatchObject({ code: 'daily_limit' });
    expect(f.calls()).toBe(2);
  });

  it('answers an identical question from cache without spending quota', async () => {
    const f = fakes();
    const guard = new LlmGuard({ dailyLimit: 2 });
    const app = councilRoute(f.db, { llm: f.llm, guard });
    expect((await ask(app, 'How should I live?')).status).toBe(200);
    const again = await ask(app, '  how should   I live？ ');
    expect(again.status).toBe(200);
    expect(again.headers.get('X-Cache')).toBe('HIT');
    expect(f.calls()).toBe(2);
    expect(guard.stats().callsToday).toBe(2);
  });
});

describe('councilCacheKey', () => {
  it('normalises case, spacing and trailing punctuation, and keys on everything that changes the answer', () => {
    const k = (question: string, extra = {}) => councilCacheKey({ question, lang: 'zh', ...extra });
    expect(k('如何面对死亡？')).toBe(k(' 如何面对死亡 '));
    expect(k('How to LIVE?')).toBe(k('how to live'));
    expect(k('x')).not.toBe(councilCacheKey({ question: 'x', lang: 'en' }));
    expect(k('x', { thinkerSlugs: ['kant', 'laozi'] })).toBe(k('x', { thinkerSlugs: ['laozi', 'kant'] }));
    expect(k('x', { deepDiveSlug: 'kant' })).not.toBe(k('x'));
  });
});
