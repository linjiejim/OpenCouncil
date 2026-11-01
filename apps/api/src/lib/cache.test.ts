import { describe, it, expect } from 'vitest';
import { TtlCache } from './cache.js';

describe('TtlCache', () => {
  it('returns a value before its TTL and undefined after', () => {
    const c = new TtlCache<number>(1000);
    c.set('a', 1, 0);
    expect(c.get('a', 500)).toBe(1);
    expect(c.get('a', 1000)).toBeUndefined(); // expires at now+ttl, inclusive
    expect(c.get('a', 1500)).toBeUndefined();
  });

  it('evicts the least-recently-used entry past the cap', () => {
    const c = new TtlCache<number>(10_000, 2);
    c.set('a', 1, 0);
    c.set('b', 2, 0);
    c.get('a', 1); // touch 'a' so 'b' is now the LRU
    c.set('c', 3, 1); // over cap → evict 'b'
    expect(c.get('a', 2)).toBe(1);
    expect(c.get('b', 2)).toBeUndefined();
    expect(c.get('c', 2)).toBe(3);
    expect(c.size).toBe(2);
  });
});
