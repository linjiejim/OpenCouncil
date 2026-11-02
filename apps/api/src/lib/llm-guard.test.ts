import { describe, expect, it } from 'vitest';
import { clientIp, guardFromEnv, LlmGuard } from './llm-guard.js';
import { llmConfig } from './llm.js';
import { DailyBudget } from './rate-limit.js';

const DAY = 86_400_000;

describe('clientIp', () => {
  it('trusts X-Forwarded-For only from the local proxy', () => {
    expect(clientIp('127.0.0.1', '203.0.113.7, 10.0.0.1')).toBe('203.0.113.7');
    expect(clientIp('::ffff:127.0.0.1', '203.0.113.7')).toBe('203.0.113.7');
    expect(clientIp('198.51.100.9', '203.0.113.7')).toBe('198.51.100.9');
  });
  it('falls back to the socket address, then "unknown"', () => {
    expect(clientIp('127.0.0.1', undefined)).toBe('127.0.0.1');
    expect(clientIp(undefined, '203.0.113.7')).toBe('unknown');
  });
});

describe('DailyBudget', () => {
  it('refuses past the limit without counting refusals, and resets the next UTC day', () => {
    const b = new DailyBudget(2);
    const t = 10 * DAY + 1000;
    expect(b.use(t)).toBe(true);
    expect(b.use(t)).toBe(true);
    expect(b.use(t)).toBe(false);
    expect(b.used(t)).toBe(2);
    expect(b.remaining(t)).toBe(0);
    expect(b.use(t + DAY)).toBe(true);
    expect(b.used(t + DAY)).toBe(1);
  });
});

describe('LlmGuard', () => {
  it('allows a burst of 5 per IP, then 20 an hour', () => {
    const g = new LlmGuard({ perIpBurst: 5, perIpPerHour: 20, dailyLimit: 1000 });
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(g.allowIp('a', t)).toBe(true);
    expect(g.allowIp('a', t)).toBe(false);
    expect(g.allowIp('b', t)).toBe(true); // other IPs unaffected
    expect(g.allowIp('a', t + 180_000)).toBe(true); // 3 minutes = one token at 20/hour
    expect(g.allowIp('a', t + 180_000)).toBe(false);
  });

  it('reports usage for the health endpoint', () => {
    const g = new LlmGuard({ dailyLimit: 3 });
    g.useCall(5);
    expect(g.stats(5)).toEqual({ callsToday: 1, dailyLimit: 3 });
    expect(g.hasBudget(2, 5)).toBe(true);
    expect(g.hasBudget(3, 5)).toBe(false);
  });

  it('reads COUNCIL_DAILY_LIMIT, defaulting to 300', () => {
    expect(guardFromEnv({}).stats().dailyLimit).toBe(300);
    expect(guardFromEnv({ COUNCIL_DAILY_LIMIT: '50' }).stats().dailyLimit).toBe(50);
    expect(guardFromEnv({ COUNCIL_DAILY_LIMIT: 'lots' }).stats().dailyLimit).toBe(300);
  });
});

describe('llmConfig', () => {
  it('falls back to the DEEPSEEK_* variables and turns off DeepSeek thinking', () => {
    const c = llmConfig({ DEEPSEEK_API_KEY: 'k', DEEPSEEK_BASE_URL: 'https://api.deepseek.com' });
    expect(c).toEqual({
      baseURL: 'https://api.deepseek.com/v1', apiKey: 'k', model: 'deepseek-v4-flash',
      extraBody: { thinking: { type: 'disabled' } },
    });
  });
  it('switches provider with LLM_* only', () => {
    const c = llmConfig({
      DEEPSEEK_API_KEY: 'old', LLM_BASE_URL: 'https://openrouter.ai/api/v1', LLM_API_KEY: 'new',
      LLM_MODEL: 'deepseek/deepseek-v4-flash',
    });
    expect(c).toEqual({ baseURL: 'https://openrouter.ai/api/v1', apiKey: 'new', model: 'deepseek/deepseek-v4-flash', extraBody: {} });
    expect(llmConfig({ LLM_BASE_URL: 'https://openrouter.ai/api/v1', LLM_EXTRA_BODY: '{"reasoning":{"enabled":false}}' }).extraBody)
      .toEqual({ reasoning: { enabled: false } });
  });
});
