/**
 * Incremental content expander — core logic (no side effects on import).
 *
 * The self-sustaining half of the pipeline. Where `collect.ts` rebuilds a work's
 * data file from scratch (and re-enriches everything), this walks the un-collected
 * FRONTIER of each already-aligned canon and APPENDS only the new verses:
 *
 *   load data/<work>.json  →  diff backlog against the canonicalRefs already present
 *   →  fetch the next N verbatim (verify gate + integrity anchor)
 *   →  enrich ONLY the new ones  →  append into the right chapter  →  rewrite file
 *
 * Existing passages (and their enriched metadata) are never touched. The honest
 * boundary is unchanged: original text + translation are fetched VERBATIM; the LLM
 * only ever writes the separable editorial metadata.
 *
 * The CLI wrapper lives in `expand.ts`. This module is import-safe (it runs nothing
 * at import time), so the pure helpers below can be unit-tested without network.
 */
import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { verify } from './sources/verify.js';
import { enrich, ENRICH_MODEL } from './sources/enrich.js';
import { ALLOWED_TAGS, EXPANDABLE_WORKS, mapPool, type ExpandableWork } from './works.js';

const DATA_DIR = resolve(import.meta.dirname, 'data');

// ── Data-file shapes (mirror import.ts) ──────────────────────────────────────
export interface PassageData {
  originalText: string;
  englishText: string;
  transliteration?: string | null;
  canonicalRef?: string;
  originalLang?: string;
  translator?: string;
  sourceUrl?: string;
  license?: string;
  verificationStatus?: string;
  metadataSource?: string;
  summaryEn?: string;
  summaryZh?: string;
  similarQuestions?: string[];
  contextNote?: string;
  tags?: string[];
  weight?: number;
}
export interface ChapterMeta { titleEn: string; titleZh: string; titleOrig?: string }
export interface Chapter extends ChapterMeta { passages: PassageData[] }
export interface WorkData { work: Record<string, unknown>; chapters: Chapter[] }
export interface BuiltItem { chapter: ChapterMeta; passage: PassageData }

export interface Skip { ref: string; reason: string }
export interface WorkReport { slug: string; added: string[]; skipped: Skip[]; remaining: number; total: number }

// ── Pure helpers (unit-tested in expand.test.ts, no network) ─────────────────

/** The set of canonicalRefs already present in a work's data file. */
export function existingRefs(work: WorkData): Set<string> {
  const s = new Set<string>();
  for (const ch of work.chapters) for (const p of ch.passages) if (p.canonicalRef) s.add(p.canonicalRef);
  return s;
}

/** Take the next `cap` backlog refs whose canonicalRef isn't already collected. */
export function selectFrontier(
  existing: Set<string>,
  backlog: string[],
  refToCanonical: (ref: string) => string,
  cap: number,
): string[] {
  const out: string[] = [];
  for (const ref of backlog) {
    if (out.length >= cap) break;
    if (!existing.has(refToCanonical(ref))) out.push(ref);
  }
  return out;
}

/** Append built passages into their chapters (matched by titleEn), creating
 *  chapters as needed. Mutates and returns the count added. */
export function mergeIntoWork(work: WorkData, items: BuiltItem[]): number {
  for (const { chapter, passage } of items) {
    let ch = work.chapters.find((c) => c.titleEn === chapter.titleEn);
    if (!ch) {
      ch = { titleEn: chapter.titleEn, titleZh: chapter.titleZh, titleOrig: chapter.titleOrig, passages: [] };
      work.chapters.push(ch);
    }
    ch.passages.push(passage);
  }
  return items.length;
}

// ── The expansion step for a single work ─────────────────────────────────────
export async function expandWork(w: ExpandableWork, cap: number): Promise<WorkReport> {
  const file = resolve(DATA_DIR, w.dataFile);
  if (!existsSync(file)) {
    return { slug: w.slug, added: [], skipped: [{ ref: '-', reason: `data file missing: ${w.dataFile}` }], remaining: 0, total: 0 };
  }
  const work = JSON.parse(readFileSync(file, 'utf8')) as WorkData;
  const existing = existingRefs(work);
  const backlog = w.backlog();
  const total = backlog.filter((r) => !existing.has(w.refToCanonical(r))).length;
  const frontier = selectFrontier(existing, backlog, w.refToCanonical, cap);

  const skipped: Skip[] = [];
  const built = await mapPool(frontier, 4, async (ref): Promise<BuiltItem | null> => {
    const c = w.label(ref);
    let text;
    try {
      text = await w.fetch(ref);
    } catch (err) {
      skipped.push({ ref, reason: `fetch failed: ${String(err)}` });
      return null;
    }
    const v = verify(text);
    if (v.status !== 'verified') {
      skipped.push({ ref: text.canonicalRef, reason: `verify: ${v.issues.join('; ')}` });
      return null;
    }
    if (c.expectContains && !text.originalText.includes(c.expectContains)) {
      skipped.push({ ref: text.canonicalRef, reason: `integrity anchor「${c.expectContains}」not found` });
      return null;
    }
    let meta;
    try {
      meta = await enrich({
        thinkerName: w.thinkerName, tradition: w.tradition, canonicalRef: text.canonicalRef,
        originalText: text.originalText, englishText: text.englishText, allowedTags: ALLOWED_TAGS,
      });
    } catch (err) {
      skipped.push({ ref: text.canonicalRef, reason: `enrich failed: ${String(err)}` });
      return null;
    }
    console.log(`  ✅ ${text.canonicalRef}`);
    return {
      chapter: { titleEn: c.chapterEn, titleZh: c.chapterZh, titleOrig: c.chapterOrig },
      passage: {
        originalText: text.originalText,
        englishText: text.englishText,
        transliteration: text.transliteration,
        canonicalRef: text.canonicalRef,
        originalLang: text.originalLang,
        translator: text.translator,
        sourceUrl: text.sourceUrl,
        license: text.license,
        verificationStatus: v.status,
        metadataSource: ENRICH_MODEL,
        summaryEn: meta.summaryEn,
        summaryZh: meta.summaryZh,
        similarQuestions: meta.similarQuestions,
        contextNote: meta.contextNote,
        tags: meta.tags,
        weight: c.weight ?? meta.weight,
      },
    };
  });

  const items = built.filter((b): b is BuiltItem => b !== null);
  if (items.length > 0) {
    mergeIntoWork(work, items);
    writeFileSync(file, JSON.stringify(work, null, 2) + '\n');
  }
  return {
    slug: w.slug,
    added: items.map((i) => i.passage.canonicalRef!).filter(Boolean) as string[],
    skipped,
    remaining: total - items.length,
    total,
  };
}

/** Expand every (optionally filtered) work by up to `cap` new passages each. */
export async function runExpansion(opts: { cap: number; onlySlugs?: Set<string> }): Promise<WorkReport[]> {
  const works = EXPANDABLE_WORKS.filter((w) => !opts.onlySlugs?.size || opts.onlySlugs.has(w.slug));
  const reports: WorkReport[] = [];
  for (const w of works) {
    console.log(`${w.slug} (${w.dataFile}):`);
    reports.push(await expandWork(w, opts.cap));
    console.log('');
  }
  return reports;
}
