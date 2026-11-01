import { describe, it, expect } from 'vitest';
import { TokenBucket, DailyCounter } from './rate-limit.js';

describe('TokenBucket', () => {
  it('allows up to the burst capacity, then refuses', () => {
    const b = new TokenBucket(3, 1);
    expect(b.take('k', 0)).toBe(true);
    expect(b.take('k', 0)).toBe(true);
    expect(b.take('k', 0)).toBe(true);
    expect(b.take('k', 0)).toBe(false); // bucket empty
  });

  it('refills over time at refillPerSec', () => {
    const b = new TokenBucket(2, 1); // 1 token/sec
    expect(b.take('k', 0)).toBe(true);
    expect(b.take('k', 0)).toBe(true);
    expect(b.take('k', 0)).toBe(false);
    expect(b.take('k', 1000)).toBe(true); // 1s later → 1 token back
    expect(b.take('k', 1000)).toBe(false);
  });

  it('tracks buckets independently per key', () => {
    const b = new TokenBucket(1, 1);
    expect(b.take('a', 0)).toBe(true);
    expect(b.take('b', 0)).toBe(true);
    expect(b.take('a', 0)).toBe(false);
  });
});

describe('DailyCounter', () => {
  it('counts within a day and flags when the quota is exceeded', () => {
    const d = new DailyCounter();
    const t = 0;
    expect(d.hit('k', 2, t)).toEqual({ ok: true, remaining: 1 });
    expect(d.hit('k', 2, t)).toEqual({ ok: true, remaining: 0 });
    expect(d.hit('k', 2, t)).toEqual({ ok: false, remaining: 0 });
  });

  it('resets when the day rolls over', () => {
    const d = new DailyCounter();
    expect(d.hit('k', 1, 0).ok).toBe(true);
    expect(d.hit('k', 1, 0).ok).toBe(false);
    expect(d.hit('k', 1, 86_400_000).ok).toBe(true); // next day → reset
  });
});
