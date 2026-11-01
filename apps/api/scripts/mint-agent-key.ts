/**
 * Mint an agent API key — `pnpm agent:mint-key <label> [dailyQuota]`
 *
 * Inserts a new row in api_keys storing only the SHA-256 hash, and prints the
 * plaintext token ONCE. Store it immediately — it cannot be recovered.
 * Use it as:  Authorization: Bearer <token>
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
config({ path: resolve(import.meta.dirname, '../../../.env') });

import { createDatabase } from '@opencouncil/db';
import { apiKeys } from '@opencouncil/db/schema';
import { hashKey } from '../src/lib/auth.js';

async function main() {
  const label = process.argv[2];
  if (!label) {
    console.error('Usage: pnpm agent:mint-key <label> [dailyQuota]');
    process.exit(1);
  }
  const dailyQuota = Number(process.argv[3] ?? 1000);
  // Use a provided token (AGENT_TOKEN) so the SAME key can be re-registered in
  // another database — e.g. on the server after deploy; otherwise generate one.
  const token = process.env.AGENT_TOKEN || 'oc_' + randomBytes(24).toString('base64url');

  const url = process.env.DATABASE_URL ?? 'postgresql://opencouncil:opencouncil@localhost:5432/opencouncil';
  const db = createDatabase(url);
  await db.insert(apiKeys).values({ label, keyHash: hashKey(token), dailyQuota }).onConflictDoNothing();

  console.log(`\n✅ Minted agent key "${label}" (quota ${dailyQuota}/day)\n`);
  console.log(`   ${token}\n`);
  console.log('   Store it now — it is not recoverable.');
  console.log('   Use as:  Authorization: Bearer <token>\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Mint failed:', err);
  process.exit(1);
});
