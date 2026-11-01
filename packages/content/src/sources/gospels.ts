/**
 * Gospels adapter — aligned Koine Greek + English, both freely licensed.
 *
 *   • original:    SBLGNT via the MorphGNT project
 *                  (https://github.com/morphgnt/sblgnt) — Greek text reassembled
 *                  from word rows keyed by BBCCVV (book/chapter/verse).
 *   • translation: World English Bible (WEB) via bible-api.com — public domain.
 *
 * Aligned by canonical reference, e.g. "Matthew 5:3".
 */
import { fetchText, fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

const MORPHGNT = 'https://raw.githubusercontent.com/morphgnt/sblgnt/master';

// Gospel name → { bookNum (in BBCCVV), morphgnt file, bible-api slug }
const BOOKS: Record<string, { num: string; file: string; slug: string }> = {
  matthew: { num: '01', file: '61-Mt-morphgnt.txt', slug: 'matthew' },
  mark: { num: '02', file: '62-Mk-morphgnt.txt', slug: 'mark' },
  luke: { num: '03', file: '63-Lk-morphgnt.txt', slug: 'luke' },
  john: { num: '04', file: '64-Jn-morphgnt.txt', slug: 'john' },
};

const greekCache = new Map<string, string>();

async function loadGreek(file: string): Promise<string> {
  const hit = greekCache.get(file);
  if (hit) return hit;
  const txt = await fetchText(`${MORPHGNT}/${file}`);
  greekCache.set(file, txt);
  return txt;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Reassemble a Greek verse from MorphGNT word rows (column 4 = text with punctuation). */
function greekVerse(morphgnt: string, bookNum: string, chapter: number, verse: number): string {
  const ref6 = `${bookNum}${pad2(chapter)}${pad2(verse)}`;
  const words: string[] = [];
  for (const line of morphgnt.split('\n')) {
    if (!line.startsWith(ref6 + ' ')) continue;
    const cols = line.split(' ');
    if (cols[3]) words.push(cols[3]);
  }
  return words
    .join(' ')
    .replace(/[⸀-ⸯ⟦⟧]/g, '') // strip SBLGNT text-critical sigla
    .replace(/\s+([,.;·])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

interface BibleApiResponse {
  verses?: { text: string }[];
  text?: string;
}

/** Parse "Matthew 5:3" → { bookKey, chapter, verse }. */
function parseRef(ref: string): { bookKey: string; chapter: number; verse: number } {
  const m = ref.trim().match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)$/);
  if (!m) throw new Error(`Unparseable gospel ref: "${ref}"`);
  const bookKey = m[1].toLowerCase().replace(/\s/g, '');
  if (!BOOKS[bookKey]) throw new Error(`Unsupported book in ref "${ref}" (gospels only)`);
  return { bookKey, chapter: Number(m[2]), verse: Number(m[3]) };
}

/** Fetch a single Gospel verse (SBLGNT Greek + WEB English), verbatim, with provenance. */
export async function fetchGospelVerse(ref: string): Promise<FetchedText> {
  const { bookKey, chapter, verse } = parseRef(ref);
  const book = BOOKS[bookKey];

  const [morphgnt, en] = await Promise.all([
    loadGreek(book.file),
    fetchJson<BibleApiResponse>(`https://bible-api.com/${book.slug}+${chapter}:${verse}?translation=web`),
  ]);

  const greek = greekVerse(morphgnt, book.num, chapter, verse);
  const english = (en.verses?.map((v) => v.text).join(' ') ?? en.text ?? '').replace(/\s+/g, ' ').trim();
  if (!greek) throw new Error(`No Greek text for ${ref}`);
  if (!english) throw new Error(`No WEB English for ${ref}`);

  const canonical = `${book.slug[0].toUpperCase()}${book.slug.slice(1)} ${chapter}:${verse}`;
  return {
    canonicalRef: canonical,
    originalText: greek,
    originalLang: 'koine-greek',
    transliteration: null,
    englishText: english,
    translator: 'World English Bible (WEB)',
    sourceUrl: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(`${book.slug} ${chapter}:${verse}`)}&version=WEB`,
    license: 'Greek: CC BY 4.0 (SBLGNT); English: public domain (WEB)',
  };
}
