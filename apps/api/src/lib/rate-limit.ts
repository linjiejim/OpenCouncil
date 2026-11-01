/**
 * In-process rate limiting for the agent surface: a per-key token bucket (smooths
 * bursts) plus a per-key daily counter (caps total spend). In-memory, so it's
 * per-PM2-process; fine at current scale, swap for a shared store if scaled out.
 *
 * `now` is injectable so refill/reset logic is unit-testable without clocks.
 */
export class TokenBucket {
  private state = new Map<string, { tokens: number; last: number }>();

  /** @param capacity burst size  @param refillPerSec tokens added per second */
  constructor(private capacity: number, private refillPerSec: number, private max = 10_000) {}

  /** Returns true if `cost` tokens were available (and consumes them). */
  take(key: string, now: number = Date.now(), cost = 1): boolean {
    let s = this.state.get(key);
    if (!s) {
      if (this.state.size >= this.max) this.state.delete(this.state.keys().next().value!);
      s = { tokens: this.capacity, last: now };
      this.state.set(key, s);
    }
    const elapsed = Math.max(0, now - s.last) / 1000;
    s.tokens = Math.min(this.capacity, s.tokens + elapsed * this.refillPerSec);
    s.last = now;
    if (s.tokens >= cost) {
      s.tokens -= cost;
      return true;
    }
    return false;
  }
}

export class DailyCounter {
  private state = new Map<string, { day: number; count: number }>();

  constructor(private max = 50_000) {}

  /** Increments today's count for `key`; reports whether it's within `quota`. */
  hit(key: string, quota: number, now: number = Date.now()): { ok: boolean; remaining: number } {
    const day = Math.floor(now / 86_400_000);
    let s = this.state.get(key);
    if (!s || s.day !== day) {
      if (!s && this.state.size >= this.max) this.state.delete(this.state.keys().next().value!);
      s = { day, count: 0 };
      this.state.set(key, s);
    }
    s.count += 1;
    return { ok: s.count <= quota, remaining: Math.max(0, quota - s.count) };
  }
}
