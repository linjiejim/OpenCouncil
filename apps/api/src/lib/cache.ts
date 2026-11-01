/**
 * Tiny in-process TTL + LRU cache. Single PM2 process today, so an in-memory map
 * is enough; swap for a shared store (Redis/Postgres) if the API ever scales out.
 *
 * `now` is injectable so the eviction/expiry logic is unit-testable without clocks.
 */
export class TtlCache<V> {
  private store = new Map<string, { value: V; expires: number }>();

  constructor(private ttlMs: number, private max = 500) {}

  get(key: string, now: number = Date.now()): V | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (hit.expires <= now) {
      this.store.delete(key);
      return undefined;
    }
    // Refresh recency (Map preserves insertion order → re-insert moves to newest).
    this.store.delete(key);
    this.store.set(key, hit);
    return hit.value;
  }

  set(key: string, value: V, now: number = Date.now()): void {
    this.store.delete(key);
    this.store.set(key, { value, expires: now + this.ttlMs });
    // Evict the least-recently-used entries past the cap.
    while (this.store.size > this.max) {
      const oldest = this.store.keys().next().value;
      if (oldest === undefined) break;
      this.store.delete(oldest);
    }
  }

  get size(): number {
    return this.store.size;
  }
}
