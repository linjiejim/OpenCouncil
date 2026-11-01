/**
 * Build a Postgres tsquery that ORs all meaningful terms (maximising recall,
 * while ts_rank still scores passages matching more terms higher).
 *
 * Returns '' when nothing usable remains. Callers MUST treat '' as "no query"
 * and short-circuit to empty results — never pass a raw user string to
 * to_tsquery(). The previous code fell back to the raw query when every term was
 * a stop word, so an input like "?!" or one containing tsquery operators
 * (& | ! : ( )) made Postgres throw a syntax error → an unhandled 500. Tokens
 * here are reduced to \w runs and joined with ' | ', which is always valid.
 */
export const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has', 'her',
  'was', 'one', 'our', 'out', 'had', 'how', 'its', 'let', 'may', 'who', 'did',
  'get', 'him', 'his', 'she', 'too', 'use', 'what', 'when', 'where', 'which',
  'with', 'this', 'that', 'from', 'they', 'been', 'have', 'will', 'each',
  'make', 'like', 'does', 'into', 'than', 'them', 'then', 'these', 'some',
  'would', 'about', 'there', 'their', 'should', 'could',
]);

export function toOrTsQuery(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return words.join(' | ');
}
