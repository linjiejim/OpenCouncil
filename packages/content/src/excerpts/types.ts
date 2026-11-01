import type { ExcerptSpec } from '../sources/excerpt.js';

/**
 * One curated passage of an excerpt-sourced work: where to cut the verbatim text
 * from (ExcerptSpec) plus hand-written editorial metadata. The editorial fields
 * are commentary about the passage and are kept separate from the sourced text.
 */
export interface ExcerptItem extends ExcerptSpec {
  chapterEn: string;
  chapterZh: string;
  chapterOrig?: string;
  summaryEn: string;
  summaryZh: string;
  similarQuestions: string[];
  contextNote: string;
  tags: string[];
  weight: number;
}

export interface ExcerptWork {
  /** Thinker slug in packages/db seed. */
  thinkerSlug: string;
  /** Output file under data/, e.g. "zhuangzi-inner-chapters.json". */
  dataFile: string;
  thinkerName: string;
  tradition: string;
  /** Titles of earlier (unsourced) versions of this work to purge on import. */
  supersedes: string[];
  work: {
    titleEn: string;
    titleZh: string;
    titleOrig: string;
    language: string;
    circaYear: number;
    description: string;
    copyright: string;
    sourceUrl: string;
  };
  items: ExcerptItem[];
}
