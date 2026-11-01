/** Tradition categories for thinkers */
export type Tradition =
  | 'confucianism'
  | 'daoism'
  | 'buddhism'
  | 'hinduism'
  | 'christianity'
  | 'islam'
  | 'sufism'
  | 'ancient-greek'
  | 'stoicism'
  | 'enlightenment'
  | 'existentialism'
  | 'literature'
  | 'pragmatism'
  | 'transcendentalism'
  | 'judaism'
  | 'zen';

export interface ThinkerSummary {
  id: number;
  slug: string;
  nameEn: string;
  nameZh: string;
  nameOrig: string | null;
  tradition: Tradition;
  era: string;
  bornYear: number | null;
  diedYear: number | null;
  portraitUrl: string | null;
  region: string;
}

export interface ThinkerDetail extends ThinkerSummary {
  bioEn: string;
  bioZh: string;
  coreIdeasEn: string;
  coreIdeasZh: string;
  works: WorkSummary[];
}

export interface WorkSummary {
  id: number;
  titleEn: string;
  titleZh: string;
  titleOrig: string | null;
  language: string;
  circaYear: number | null;
  description: string | null;
  chapterCount: number;
}

export interface WorkDetail extends WorkSummary {
  thinkerId: number;
  thinker: ThinkerSummary;
  copyright: string;
  sourceUrl: string | null;
  chapters: ChapterSummary[];
}

export interface ChapterSummary {
  id: number;
  titleEn: string;
  titleZh: string;
  titleOrig: string | null;
  sortOrder: number;
  passageCount: number;
}

export interface PassageDetail {
  id: number;
  chapterId: number;
  originalText: string;
  englishText: string;
  summaryEn: string | null;
  summaryZh: string | null;
  similarQuestions: string[];
  contextNote: string | null;
  sortOrder: number;
  weight: number;
  // Provenance / traceability
  canonicalRef: string | null;
  originalLang: string | null;
  transliteration: string | null;
  translator: string | null;
  sourceUrl: string | null;
  license: string | null;
  verificationStatus: string;
  metadataSource: string | null;
  tags: TagSummary[];
  chapter: ChapterSummary;
  work: WorkSummary;
  thinker: ThinkerSummary;
}

export interface TagSummary {
  id: number;
  slug: string;
  nameEn: string;
  nameZh: string;
  themeSlug: string | null;
}

export interface ThemeSummary {
  id: number;
  slug: string;
  nameEn: string;
  nameZh: string;
  icon: string;
  description: string | null;
  sortOrder: number;
  tags: TagSummary[];
}

export interface SearchResult {
  passage: PassageDetail;
  rank: number;
  headline: string;
}

export interface SearchParams {
  q: string;
  tradition?: Tradition;
  thinkerSlug?: string;
  themeSlug?: string;
  limit?: number;
  offset?: number;
}

export interface CouncilPerspective {
  thinkerId: number;
  thinkerName: string;
  thinkerNameZh: string;
  tradition: Tradition;
  era: string;
  portraitUrl: string | null;
  response: string;
  citations: {
    passageId: number;
    quoteOriginal: string;
    quoteEnglish: string;
    workTitle: string;
    chapterTitle: string;
  }[];
  isInference: boolean;
}

export interface CouncilResponse {
  questionAbstract: string;
  questionAbstractZh: string;
  perspectives: CouncilPerspective[];
  disclaimer: string;
}

/**
 * Scriptures are presented as the text of a living tradition, not as a person
 * speaking: the council describes what the text teaches in the third person,
 * never voices its founder, prophet or God, and offers no one-on-one "deep dive".
 */
export const SCRIPTURE_SLUGS = ['dhammapada', 'gospels', 'quran'] as const;

export function isScripture(slug: string | null | undefined): boolean {
  return !!slug && (SCRIPTURE_SLUGS as readonly string[]).includes(slug);
}

/** Renamed thinker slugs (old → new), applied in place by `content:import`. */
export const RENAMED_SLUGS: Record<string, string> = {
  buddha: 'dhammapada',
  jesus: 'gospels',
  muhammad: 'quran',
};
