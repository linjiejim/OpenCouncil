import { pgTable, serial, text, integer, jsonb, index, real, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { chapters } from './chapter.js';

export const passages = pgTable(
  'passages',
  {
    id: serial('id').primaryKey(),
    chapterId: integer('chapter_id').notNull().references(() => chapters.id),
    originalText: text('original_text').notNull(),
    englishText: text('english_text').notNull(),
    summaryEn: text('summary_en'),
    summaryZh: text('summary_zh'),
    similarQuestions: jsonb('similar_questions').$type<string[]>().default([]),
    contextNote: text('context_note'),
    sortOrder: integer('sort_order').notNull().default(0),
    weight: real('weight').notNull().default(1),

    // ── Provenance / traceability ────────────────────────────────────────────
    // These make the "可溯源 / traceable" promise enforceable: every passage can
    // be independently checked against a cited, licensed source.
    /** Canonical citation, e.g. "Dhp 5", "Quran 49:13", "Analects 1.1". */
    canonicalRef: text('canonical_ref'),
    /** Language of originalText, e.g. "pali", "arabic", "classical-chinese". */
    originalLang: varchar('original_lang', { length: 30 }),
    /** Romanization / transliteration of the original, if available. */
    transliteration: text('transliteration'),
    /** Named translator / edition of englishText, e.g. "Bhikkhu Sujato". */
    translator: text('translator'),
    /** Stable, deep-linkable URL pointing at this exact passage. */
    sourceUrl: text('source_url'),
    /** License of the source text, e.g. "CC0", "public-domain". */
    license: text('license'),
    /** "verified" (sourced verbatim + passed gate) | "needs-review" | "unverified". */
    verificationStatus: varchar('verification_status', { length: 30 }).notNull().default('unverified'),
    /** How the editorial metadata (summary/questions/context) was produced:
     *  "editorial" (human) or a model name (e.g. "deepseek-v4-flash"). Never applies
     *  to originalText/englishText, which are always sourced verbatim. */
    metadataSource: varchar('metadata_source', { length: 40 }),

    // tsvector generated column for full-text search
    searchVec: text('search_vec'),
  },
  (table) => [
    index('idx_passages_chapter').on(table.chapterId),
  ],
);

/**
 * SQL to create the tsvector column and GIN index.
 * Run after initial migration via a raw SQL migration.
 */
export const SEARCH_VEC_SQL = `
-- Add generated tsvector column
ALTER TABLE passages
  DROP COLUMN IF EXISTS search_vec;

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

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_passages_search ON passages USING GIN (search_vec);
`;
