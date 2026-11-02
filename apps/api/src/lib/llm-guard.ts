/**
 * Spending guard for the public, unauthenticated endpoints that call the model.
 * The demo runs on the maintainer's API key, so two limits apply:
 *
 *   • per client IP: a token bucket (burst 5, refilling at 20 per hour);
 *   • site-wide: a daily cap on model calls (COUNCIL_DAILY_LIMIT, default 300).
 *
 * In-memory, so per process; fine for the single PM2 process the demo runs.
 */
import type { Context } from 'hono';
import { getConnInfo } from '@hono/node-server/conninfo';
import { DailyBudget, TokenBucket } from './rate-limit.js';

/** Error codes the web app recognises in 429 responses. */
export const LIMIT_CODES = { rateLimited: 'rate_limited', dailyLimit: 'daily_limit' } as const;

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

/**
 * The client's IP. X-Forwarded-For is trusted only when the connection comes from
 * the local reverse proxy (Caddy); anyone else could forge it.
 */
export function clientIp(remote: string | undefined, forwardedFor: string | undefined): string {
  if (remote && LOOPBACK.has(remote) && forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }
  return remote || 'unknown';
}

export function requestIp(c: Context): string {
  let remote: string | undefined;
  try {
    remote = getConnInfo(c).remote.address;
  } catch {
    remote = undefined; // no socket (e.g. app.request() in tests)
  }
  return clientIp(remote, c.req.header('x-forwarded-for'));
}

export interface GuardOptions {
  perIpBurst?: number;
  perIpPerHour?: number;
  dailyLimit?: number;
}

export class LlmGuard {
  private ipBucket: TokenBucket;
  private budget: DailyBudget;

  constructor(opts: GuardOptions = {}) {
    const perHour = opts.perIpPerHour ?? 20;
    this.ipBucket = new TokenBucket(opts.perIpBurst ?? 5, perHour / 3600);
    this.budget = new DailyBudget(opts.dailyLimit ?? 300);
  }

  /** Consumes one request from this IP's allowance. */
  allowIp(ip: string, now = Date.now()): boolean {
    return this.ipBucket.take(ip, now);
  }

  /** True if `calls` more model calls fit in today's site-wide budget (consumes nothing). */
  hasBudget(calls = 1, now = Date.now()): boolean {
    return this.budget.remaining(now) >= calls;
  }

  /** Records one model call; false (and nothing recorded) if today's budget is used up. */
  useCall(now = Date.now()): boolean {
    return this.budget.use(now);
  }

  stats(now = Date.now()): { callsToday: number; dailyLimit: number } {
    return { callsToday: this.budget.used(now), dailyLimit: this.budget.limit };
  }
}

export function guardFromEnv(env: NodeJS.ProcessEnv = process.env): LlmGuard {
  const n = env.COUNCIL_DAILY_LIMIT ? Number(env.COUNCIL_DAILY_LIMIT) : NaN;
  return new LlmGuard({ dailyLimit: Number.isInteger(n) && n >= 0 ? n : 300 });
}
