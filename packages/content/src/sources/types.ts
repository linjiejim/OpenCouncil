/**
 * The verbatim text a source adapter returns for a single canonical reference.
 * Everything here is sourced (not authored): original-language text, an
 * established translation, an optional romanization, and the provenance needed
 * to make the passage independently verifiable.
 */
export interface FetchedText {
  /** Canonical citation, e.g. "Dhp 5", "Quran 49:13". */
  canonicalRef: string;
  /** Original-language text, verbatim from the source. */
  originalText: string;
  /** ISO-ish language tag of originalText, e.g. "pali", "arabic". */
  originalLang: string;
  /** Romanization / transliteration of the original, if available. */
  transliteration: string | null;
  /** Established translation, verbatim from the source. */
  englishText: string;
  /** Named translator / edition of englishText. */
  translator: string;
  /** Stable, deep-linkable URL pointing at this exact passage. */
  sourceUrl: string;
  /** License of the texts above, e.g. "CC0", "public-domain". */
  license: string;
}
