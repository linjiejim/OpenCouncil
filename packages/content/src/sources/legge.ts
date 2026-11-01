/**
 * Wikisource adapter — James Legge's "The Chinese Classics".
 *
 * Legge's edition is BILINGUAL and aligned: each chapter appears as the original
 * Classical Chinese (`{{lang|zh|【第一章】…}}`) immediately followed by Legge's
 * English translation. Both are public domain (Legge d. 1897; the Chinese text is
 * classical). We parse a book page once and reassemble each chapter verbatim.
 *
 * Reference scheme: "Analects B.C" (book.chapter), e.g. "Analects 4.15".
 */
import { fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

/** Clean Legge's English: drop templates, categories, wikilinks, refs, and the "Chapter N." prefix. */
function cleanEnglish(raw: string): string {
  return raw
    .replace(/<ref[^>]*>.*?<\/ref>/gis, '')
    .replace(/\[\[(?:Category|File|Image):[^\]]*\]\]/gi, '')
    .replace(/\{\{sc\|([^}]*)\}\}/gi, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/^\s*Chapter\s+[IVXLC]+\.\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface Chapter { chapter: number; original: string; english: string }

interface Block { zh: string; start: number; end: number }

/**
 * Extract `{{lang|zh|…}}` blocks with brace-awareness, so nested templates inside
 * a chapter (e.g. footnotes) don't truncate the captured Chinese. Returns each
 * block's inner text and its [start,end) span in the source.
 */
function extractLangBlocks(wt: string): Block[] {
  const out: Block[] = [];
  const opener = /\{\{lang(?:\s+block)?\|zh\|/g;
  let m: RegExpExecArray | null;
  while ((m = opener.exec(wt)) !== null) {
    const contentStart = opener.lastIndex;
    let depth = 1;
    let i = contentStart;
    while (i < wt.length && depth > 0) {
      if (wt.startsWith('{{', i)) { depth++; i += 2; }
      else if (wt.startsWith('}}', i)) { depth--; if (depth === 0) break; i += 2; }
      else i++;
    }
    if (depth !== 0) break; // unbalanced — stop rather than emit garbage
    out.push({ zh: wt.slice(contentStart, i), start: m.index, end: i + 2 });
    opener.lastIndex = i + 2;
  }
  return out;
}

const bookCache = new Map<number, Map<number, Chapter>>();

async function loadBook(book: number): Promise<Map<number, Chapter>> {
  const hit = bookCache.get(book);
  if (hit) return hit;

  const page = `The Chinese Classics/Volume 1/Confucian Analects/${ROMAN[book]}`;
  const data = await fetchJson<{ parse?: { wikitext?: { '*'?: string } } }>(
    `https://en.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json`,
  );
  const wt = data.parse?.wikitext?.['*'] ?? '';
  if (!wt) throw new Error(`empty wikitext for Analects book ${book}`);

  // Find each {{lang|zh|...}} / {{lang block|zh|...}} Chinese block and the English that follows it.
  const blocks = extractLangBlocks(wt);

  // Chapters are numbered sequentially in canonical order. The leading book-title
  // block (e.g. "里仁第四") has no 【…】 chapter marker, so we skip it; every real
  // chapter carries at least one 【…】 marker. (Marker form varies: 【第十一章】,
  // 【十一章】, 【廿六章】 …, so we rely on order rather than parsing the numeral.)
  const map = new Map<number, Chapter>();
  let chapter = 0;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (!b.zh.includes('【')) continue; // book-title / non-chapter block
    chapter++;
    const original = b.zh
      .replace(/<ref[^>]*>.*?<\/ref>/gis, '')
      .replace(/\{\{[^{}]*\}\}/g, '')
      .replace(/\{\{[^{}]*\}\}/g, '')
      .replace(/【[^】]*】/g, '')
      .replace(/\s+/g, '')
      .trim();
    const englishRaw = wt.slice(b.end, i + 1 < blocks.length ? blocks[i + 1].start : undefined);
    const english = cleanEnglish(englishRaw);
    if (original && english) map.set(chapter, { chapter, original, english });
  }
  if (map.size === 0) throw new Error(`parsed 0 chapters for Analects book ${book}`);
  bookCache.set(book, map);
  return map;
}

/** Fetch one Analects chapter (Classical Chinese + Legge English), verbatim, with provenance. ref = "B.C". */
export async function fetchAnalects(ref: string): Promise<FetchedText> {
  const [bookStr, chStr] = ref.split('.');
  const book = Number(bookStr);
  const chapter = Number(chStr);
  if (!book || !chapter || book < 1 || book > 20) throw new Error(`bad Analects ref "${ref}"`);

  const map = await loadBook(book);
  const ch = map.get(chapter);
  if (!ch) throw new Error(`Analects ${ref} not found (book has ${map.size} chapters)`);

  return {
    canonicalRef: `Analects ${book}.${chapter}`,
    originalText: ch.original,
    originalLang: 'classical-chinese',
    transliteration: null,
    englishText: ch.english,
    translator: 'James Legge',
    sourceUrl: `https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects/${ROMAN[book]}`,
    license: 'public-domain',
  };
}
