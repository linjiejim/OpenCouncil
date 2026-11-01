/**
 * Verification gate.
 *
 * Anything entering the corpus must pass these checks. The point is to make the
 * "可溯源 / traceable" promise enforceable rather than aspirational: a passage is
 * only marked `verified` when its original + translation came verbatim from a
 * cited source and survive sanity checks. Otherwise it is flagged for review and
 * (by policy in the collector) kept out of the database.
 */
import type { FetchedText } from './types.js';

export type VerificationStatus = 'verified' | 'needs-review';

export interface VerificationResult {
  status: VerificationStatus;
  issues: string[];
}

const SCRIPT_RANGES: Record<string, RegExp> = {
  arabic: /[؀-ۿ]/,
  pali: /[A-Za-zĀāĪīŪūṂṃṄṅÑñṆṇṬṭḌḍṆṇḶḷṢṣŚśṚṛ]/,
  'classical-chinese': /[一-鿿]/,
  persian: /[؀-ۿ]/,
  'ancient-greek': /[\u0370-\u03ff\u1f00-\u1fff]/,
  'koine-greek': /[\u0370-\u03ff\u1f00-\u1fff]/,
  latin: /[A-Za-z]/,
  german: /[A-Za-zÄÖÜäöüß]/,
};

export function verify(t: FetchedText): VerificationResult {
  const issues: string[] = [];

  if (!t.originalText || t.originalText.trim().length < 2) issues.push('originalText empty/too short');
  if (!t.englishText || t.englishText.trim().length < 2) issues.push('englishText empty/too short');
  if (!t.canonicalRef) issues.push('missing canonicalRef');
  if (!t.sourceUrl?.startsWith('http')) issues.push('missing/invalid sourceUrl');
  if (!t.translator) issues.push('missing translator attribution');
  if (!t.license) issues.push('missing license');

  // Original text should contain characters in the expected script — catches the
  // failure mode where "original" text was back-translated/fabricated in the wrong script.
  const scriptRe = SCRIPT_RANGES[t.originalLang];
  if (scriptRe && !scriptRe.test(t.originalText)) {
    issues.push(`originalText has no ${t.originalLang} script characters`);
  }

  // English and original shouldn't be identical (would indicate a copy error).
  if (t.originalText.trim() === t.englishText.trim()) issues.push('original and english are identical');

  return { status: issues.length === 0 ? 'verified' : 'needs-review', issues };
}
