/**
 * Incremental content expander — CLI entry: `pnpm content:expand [slug...] [--n=N]`
 *
 * Walks the un-collected frontier of each already-aligned canon and appends only
 * the new verses (see expand-core.ts for the logic and the honest-boundary notes).
 *
 *   pnpm content:expand              # every source, EXPAND_PER_SOURCE (default 5) each
 *   pnpm content:expand dhammapada laozi # only these sources
 *   pnpm content:expand --n=10       # up to 10 new passages per source
 *
 * Run daily (see .github/workflows/expand.yml). Idempotent: once a source's
 * frontier is consumed, re-running adds nothing.
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
config({ path: resolve(import.meta.dirname, '../../../.env') });

import { runExpansion } from './expand-core.js';
import { EXPANDABLE_WORKS } from './works.js';

const DEFAULT_PER_SOURCE = Number(process.env.EXPAND_PER_SOURCE ?? 5);

async function main() {
  const argv = process.argv.slice(2);
  const nArg = argv.find((a) => a.startsWith('--n='));
  const cap = nArg ? Math.max(0, Number(nArg.slice(4))) : DEFAULT_PER_SOURCE;
  const known = new Set(EXPANDABLE_WORKS.map((w) => w.slug));
  const onlySlugs = new Set(argv.filter((a) => !a.startsWith('--') && known.has(a.toLowerCase())).map((s) => s.toLowerCase()));

  console.log(`🌱 OpenCouncil content expander — up to ${cap}/source${onlySlugs.size ? ` (only: ${[...onlySlugs].join(', ')})` : ''}\n`);

  const reports = await runExpansion({ cap, onlySlugs });

  // ── Frontier report — the audit trail for the daily run ────────────────────
  let totalAdded = 0;
  console.log('── Frontier report ───────────────────────────────────────────');
  for (const r of reports) {
    totalAdded += r.added.length;
    console.log(
      `${r.slug.padEnd(10)} +${r.added.length} added` +
        (r.skipped.length ? `, ${r.skipped.length} skipped` : '') +
        `  (backlog remaining: ${r.remaining})`,
    );
    for (const s of r.skipped) console.log(`   ⚠️  ${s.ref}: ${s.reason}`);
  }
  console.log('──────────────────────────────────────────────────────────────');
  console.log(`\n${totalAdded > 0 ? `🎉 Added ${totalAdded} verified passage(s).` : '✓ Nothing new — frontier already consumed (idempotent).'}`);

  // Signal to CI whether the working tree changed (so it can commit only when needed).
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `added=${totalAdded}\n`, { flag: 'a' });
  }
}

main().catch((err) => {
  console.error('Expansion failed:', err);
  process.exit(1);
});
