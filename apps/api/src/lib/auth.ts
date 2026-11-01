/**
 * Auth + rate-limit middleware for the agent surface (`/api/agent/*`).
 * The public browser routes are untouched and remain unauthenticated.
 */
import { createHash } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import { eq } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { apiKeys } from '@opencouncil/db/schema';
import { TokenBucket, DailyCounter } from './rate-limit.js';

export interface ApiKeyInfo { id: number; label: string; dailyQuota: number }
export type AgentEnv = { Variables: { apiKey: ApiKeyInfo } };

/** SHA-256 hex of a bearer token. Only the hash is stored; the token is never persisted. */
export function hashKey(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Require a valid, enabled API key in `Authorization: Bearer <token>`. */
export function bearerAuth(db: Database): MiddlewareHandler<AgentEnv> {
  return async (c, next) => {
    const header = c.req.header('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token) return c.json({ error: 'Missing bearer token' }, 401);

    const [row] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, hashKey(token))).limit(1);
    if (!row || !row.enabled) return c.json({ error: 'Invalid or disabled API key' }, 401);

    c.set('apiKey', { id: row.id, label: row.label, dailyQuota: row.dailyQuota });
    await next();
  };
}

/** Per-key token bucket (burst smoothing) + daily quota. Mount AFTER bearerAuth. */
export function rateLimit(opts: { burst?: number; refillPerSec?: number } = {}): MiddlewareHandler<AgentEnv> {
  const bucket = new TokenBucket(opts.burst ?? 20, opts.refillPerSec ?? 5);
  const daily = new DailyCounter();
  return async (c, next) => {
    const key = c.get('apiKey');
    const id = String(key.id);
    if (!bucket.take(id)) {
      c.header('Retry-After', '1');
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }
    const d = daily.hit(id, key.dailyQuota);
    c.header('X-RateLimit-Daily-Remaining', String(d.remaining));
    if (!d.ok) return c.json({ error: 'Daily quota exceeded' }, 429);
    await next();
  };
}
