import { pgTable, serial, text, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * API keys for the agent-facing surface (`/api/agent/*`). The public browser app
 * is unauthenticated as before; only the agent namespace requires a key.
 *
 * Only the SHA-256 hash of the token is stored — the plaintext is shown once at
 * mint time (see apps/api/scripts/mint-agent-key.ts) and never persisted.
 */
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  keyHash: varchar('key_hash', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').notNull().default(true),
  /** Per-key requests/day budget (enforced in-process). */
  dailyQuota: integer('daily_quota').notNull().default(1000),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
