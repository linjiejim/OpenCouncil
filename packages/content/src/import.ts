/**
 * OpenCouncil content import script.
 *
 * Usage: pnpm content:import
 *
 * Seeds the database with themes, tags, thinkers, and content.
 *
 * Two kinds of content sources:
 *   • collected JSON in ./data/*.json produced by `pnpm content:collect`
 *     — original text + translation fetched VERBATIM from authoritative,
 *       public-domain / openly licensed sources, carrying full provenance.
 *     This includes the excerpt-sourced works registered in ./excerpts/.
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
config({ path: resolve(import.meta.dirname, '../../../.env') });

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, inArray } from 'drizzle-orm';
import * as schema from '@opencouncil/db/schema';
import { seedDatabase } from '@opencouncil/db/seed';
import { RENAMED_SLUGS } from '@opencouncil/types';
import { EXCERPT_WORKS } from './excerpts/index.js';

// Collected, fully-sourced content (replaces the earlier AI-paraphrased versions).
const DHAMMAPADA_DATA = loadData('buddhism-dhammapada.json');
const QURAN_DATA = loadData('islam-quran.json');
const JESUS_DATA = loadData('christianity-gospels.json');
const CONFUCIUS_DATA = loadData('confucius-analects.json');
const RUMI_DATA = loadData('rumi-masnavi.json');
const LAOZI_DATA = loadData('laozi-daodejing.json');

function loadData(file: string): WorkData {
  return JSON.parse(readFileSync(resolve(import.meta.dirname, 'data', file), 'utf8')) as WorkData;
}

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://opencouncil:opencouncil@localhost:5432/opencouncil';
const client = postgres(DATABASE_URL, { onnotice: () => {} });
// Rebound to the transaction in main(): the whole import commits or rolls back as one,
// so a failure halfway never leaves the live site with works missing.
let sql: postgres.Sql = client;
let db = drizzle(client, { schema });

interface PassageData {
  originalText: string;
  englishText: string;
  summaryEn?: string;
  summaryZh?: string;
  similarQuestions?: string[];
  contextNote?: string;
  weight?: number;
  // provenance (optional — present on collected data)
  canonicalRef?: string;
  originalLang?: string;
  transliteration?: string | null;
  translator?: string;
  sourceUrl?: string;
  license?: string;
  verificationStatus?: string;
  metadataSource?: string;
  tags?: string[];
}

interface WorkData {
  work: any;
  chapters: {
    titleEn: string;
    titleZh: string;
    titleOrig?: string;
    passages: PassageData[];
  }[];
}

/** Add provenance columns to an already-migrated DB without an interactive drizzle push. */
async function ensureProvenanceColumns() {
  await sql.unsafe(`
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS canonical_ref text;
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS original_lang varchar(30);
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS transliteration text;
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS translator text;
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS source_url text;
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS license text;
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS verification_status varchar(30) NOT NULL DEFAULT 'unverified';
    ALTER TABLE passages ADD COLUMN IF NOT EXISTS metadata_source varchar(40);
  `);
}

/** Delete a work and all its chapters/passages (passage_tags first to satisfy FKs). */
async function deleteWork(workId: number) {
  const chs = await db.select({ id: schema.chapters.id }).from(schema.chapters).where(eq(schema.chapters.workId, workId));
  const chIds = chs.map((c) => c.id);
  if (chIds.length) {
    const ps = await db.select({ id: schema.passages.id }).from(schema.passages).where(inArray(schema.passages.chapterId, chIds));
    const pIds = ps.map((p) => p.id);
    if (pIds.length) {
      await db.delete(schema.passageTags).where(inArray(schema.passageTags.passageId, pIds));
      await db.delete(schema.passages).where(inArray(schema.passages.id, pIds));
    }
    await db.delete(schema.chapters).where(inArray(schema.chapters.id, chIds));
  }
  await db.delete(schema.works).where(eq(schema.works.id, workId));
}

async function importWork(
  thinkerSlug: string,
  data: WorkData,
  tagMap: Map<string, number>,
  opts: { replace?: boolean; supersedes?: string[] } = {},
) {
  const [thinker] = await db.select().from(schema.thinkers).where(eq(schema.thinkers.slug, thinkerSlug));
  if (!thinker) {
    console.error(`  ❌ Thinker '${thinkerSlug}' not found. Run seed first.`);
    return;
  }

  const existingWorks = await db.select().from(schema.works).where(eq(schema.works.thinkerId, thinker.id));

  // Purge any superseded (e.g. earlier, unsourced) versions of this work.
  for (const stale of existingWorks.filter((w) => (opts.supersedes ?? []).includes(w.titleEn))) {
    await deleteWork(stale.id);
    console.log(`  🗑️  Purged superseded work '${stale.titleEn}' (id: ${stale.id})`);
  }

  const existing = existingWorks.find((w) => w.titleEn === data.work.titleEn);
  if (existing) {
    if (opts.replace) {
      await deleteWork(existing.id);
      console.log(`  ♻️  Replacing existing work '${data.work.titleEn}'`);
    } else {
      console.log(`  ⏩ Work '${data.work.titleEn}' already exists, skipping.`);
      return;
    }
  }

  const [work] = await db
    .insert(schema.works)
    .values({ ...data.work, thinkerId: thinker.id })
    .returning();
  console.log(`  📖 Imported work: ${work.titleEn} (id: ${work.id})`);

  let totalPassages = 0;
  let taggedLinks = 0;
  for (let ci = 0; ci < data.chapters.length; ci++) {
    const ch = data.chapters[ci];
    const [chapter] = await db
      .insert(schema.chapters)
      .values({
        workId: work.id,
        titleEn: ch.titleEn,
        titleZh: ch.titleZh,
        titleOrig: ch.titleOrig ?? null,
        sortOrder: ci,
      })
      .returning();

    for (let pi = 0; pi < ch.passages.length; pi++) {
      const p = ch.passages[pi];
      const [inserted] = await db
        .insert(schema.passages)
        .values({
          chapterId: chapter.id,
          originalText: p.originalText,
          englishText: p.englishText,
          summaryEn: p.summaryEn ?? null,
          summaryZh: p.summaryZh ?? null,
          similarQuestions: p.similarQuestions ?? [],
          contextNote: p.contextNote ?? null,
          sortOrder: pi,
          weight: p.weight ?? 1,
          canonicalRef: p.canonicalRef ?? null,
          originalLang: p.originalLang ?? null,
          transliteration: p.transliteration ?? null,
          translator: p.translator ?? null,
          sourceUrl: p.sourceUrl ?? null,
          license: p.license ?? null,
          verificationStatus: p.verificationStatus ?? 'unverified',
          metadataSource: p.metadataSource ?? null,
        })
        .returning({ id: schema.passages.id });
      totalPassages++;

      // Link tags by slug (skip unknown slugs).
      for (const slug of p.tags ?? []) {
        const tagId = tagMap.get(slug);
        if (!tagId) {
          console.warn(`    ⚠️  unknown tag slug '${slug}' on ${p.canonicalRef ?? `${thinkerSlug} p${pi}`}`);
          continue;
        }
        await db.insert(schema.passageTags).values({ passageId: inserted.id, tagId }).onConflictDoNothing();
        taggedLinks++;
      }
    }
  }

  console.log(`  ✅ ${data.chapters.length} chapters, ${totalPassages} passages, ${taggedLinks} tag links`);
}

async function setupSearchVector() {
  console.log('\n🔍 Setting up full-text search...');
  await sql.unsafe(`
    ALTER TABLE passages DROP COLUMN IF EXISTS search_vec;

    ALTER TABLE passages
      ADD COLUMN search_vec tsvector
      GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(summary_en, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(similar_questions::text, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(english_text, '')), 'B') ||
        setweight(to_tsvector('simple', coalesce(original_text, '')), 'C') ||
        setweight(to_tsvector('simple', coalesce(transliteration, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(context_note, '')), 'D')
      ) STORED;

    CREATE INDEX IF NOT EXISTS idx_passages_search ON passages USING GIN (search_vec);
  `);
  console.log('✅ Full-text search index created!');
}

async function main() {
  console.log('🏛️  OpenCouncil Content Import\n');
  await client.begin(async (tx) => {
    // drizzle's postgres-js driver reads parser options off the client; a transaction
    // handle doesn't carry them, so lend it the pool's (drizzle(client) set them up already).
    sql = Object.assign(tx, { options: client.options }) as unknown as postgres.Sql;
    db = drizzle(sql, { schema });
    await runImport();
  });
  console.log('\n🎉 Import complete!\n');
  await client.end();
}

async function runImport() {
  // Step 0: Rename thinker slugs in place (keeps ids, works and passages attached).
  for (const [from, to] of Object.entries(RENAMED_SLUGS)) {
    const moved = await sql`
      UPDATE thinkers SET slug = ${to}
      WHERE slug = ${from} AND NOT EXISTS (SELECT 1 FROM thinkers WHERE slug = ${to})
      RETURNING id`;
    if (moved.length) {
      console.log(`🔀 Renamed thinker '${from}' → '${to}'`);
      continue;
    }
    // Both rows exist (the new one was seeded before this rename ran): fold the old into the new.
    const [old] = await sql<{ id: number }[]>`SELECT id FROM thinkers WHERE slug = ${from}`;
    const [cur] = await sql<{ id: number }[]>`SELECT id FROM thinkers WHERE slug = ${to}`;
    if (old && cur) {
      await sql`UPDATE works SET thinker_id = ${cur.id} WHERE thinker_id = ${old.id}`;
      await sql`DELETE FROM thinkers WHERE id = ${old.id}`;
      console.log(`🔀 Merged thinker '${from}' into '${to}'`);
    }
  }

  // Step 1: Seed base data (themes, tags, thinkers)
  const database = drizzle(sql, { schema }) as any;
  await seedDatabase(database);

  // Step 1b: Ensure provenance columns exist on the live DB.
  await ensureProvenanceColumns();

  // Build tag slug → id map for linking.
  const tagRows = await db.select({ id: schema.tags.id, slug: schema.tags.slug }).from(schema.tags);
  const tagMap = new Map(tagRows.map((t) => [t.slug, t.id]));

  // Step 2: Import works
  console.log('\n📚 Importing works...\n');

  // Excerpt-sourced works (anchored verbatim cuts) — replace the earlier hand-written versions.
  for (const ew of EXCERPT_WORKS) {
    console.log(`${ew.thinkerSlug} — ${ew.work.titleEn} (sourced, verified):`);
    await importWork(ew.thinkerSlug, loadData(ew.dataFile), tagMap, { replace: true, supersedes: ew.supersedes });
  }

  // Collected, fully-sourced works — replace any earlier (unsourced) version.
  console.log('\nBuddhism — Dhammapada (sourced, verified):');
  await importWork('dhammapada', DHAMMAPADA_DATA, tagMap, {
    replace: true,
    supersedes: ['Dhammapada (with Selected Suttas)'],
  });

  console.log('\nIslam — Quran (sourced, verified):');
  await importWork('quran', QURAN_DATA, tagMap, {
    replace: true,
    supersedes: ['Selected Quranic Verses & Hadith'],
  });

  console.log('\nChristianity — Gospels (sourced, verified):');
  await importWork('gospels', JESUS_DATA, tagMap, {
    replace: true,
    supersedes: ['The Gospels (Selected)'],
  });

  console.log('\nConfucius — Analects (sourced, verified):');
  await importWork('confucius', CONFUCIUS_DATA, tagMap, {
    replace: true,
    supersedes: ['The Analects'],
  });

  console.log('\nRumi — Masnavi (sourced, verified; replaces fabricated legacy data):');
  await importWork('rumi', RUMI_DATA, tagMap, {
    replace: true,
    supersedes: ['Masnavi & Divan-e Shams'],
  });

  console.log('\nLaozi — Tao Te Ching (sourced, verified):');
  await importWork('laozi', LAOZI_DATA, tagMap, {
    replace: true,
    supersedes: ['Tao Te Ching'],
  });

  // Step 2b: Anything left without a single verified passage is legacy, unsourced
  // content (e.g. a hand-written work from before the verification gate) — remove it.
  const stale = await sql<{ id: number; title_en: string }[]>`
    SELECT w.id, w.title_en FROM works w
    WHERE NOT EXISTS (
      SELECT 1 FROM chapters c JOIN passages p ON p.chapter_id = c.id
      WHERE c.work_id = w.id AND p.verification_status = 'verified'
    )`;
  for (const w of stale) {
    await deleteWork(w.id);
    console.log(`🗑️  Removed unverified legacy work '${w.title_en}'`);
  }

  // Step 3: Setup full-text search
  await setupSearchVector();

}

main().catch((err) => {
  console.error('Import failed (rolled back):', err);
  process.exit(1);
});
