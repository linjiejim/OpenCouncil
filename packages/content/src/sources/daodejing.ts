/**
 * Daodejing (Laozi) adapter — aligned original + public-domain English by chapter.
 *
 *   • original:    Chinese Text Project API (ctext) — `ctp:dao-de-jing` returns the
 *                  81 chapters as an array (index = chapter − 1).
 *   • translation: James Legge, "Tâo Teh King" (Sacred Books of the East v39, 1891),
 *                  public domain, via Wikisource (sections `===1===` … `===81===`).
 *
 * Both sources are numbered by the same 81 chapters, so they align exactly.
 */
import { fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

let chineseCache: string[] | null = null;
let leggeCache: Map<number, string> | null = null;

async function loadChinese(): Promise<string[]> {
  if (chineseCache) return chineseCache;
  const d = await fetchJson<{ fulltext?: string[] }>('https://api.ctext.org/gettext?urn=ctp:dao-de-jing');
  const ft = d.fulltext ?? [];
  if (ft.length < 81) throw new Error(`ctext dao-de-jing returned ${ft.length} chapters`);
  chineseCache = ft;
  return ft;
}

async function loadLegge(): Promise<Map<number, string>> {
  if (leggeCache) return leggeCache;
  const d = await fetchJson<{ parse?: { wikitext?: { '*'?: string } } }>(
    "https://en.wikisource.org/w/api.php?action=parse&page=T%C3%A2o%20Teh%20King&prop=wikitext&format=json",
  );
  const wt = d.parse?.wikitext?.['*'] ?? '';
  if (!wt) throw new Error('empty Tâo Teh King wikitext');

  // Sections are `===N===` followed by the English paragraph(s) until the next `===`.
  const map = new Map<number, string>();
  const re = /===\s*(\d+)\s*===([\s\S]*?)(?====\s*\d+\s*===|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(wt)) !== null) {
    const chapter = Number(m[1]);
    const english = m[2]
      .replace(/<ref[^>]*>.*?<\/ref>/gis, '')
      .replace(/<\/?br\s*\/?>/gi, ' ')
      .replace(/\{\{[^}]*\}\}/g, '')
      .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
      .replace(/\[\[([^\]]*)\]\]/g, '$1')
      .replace(/'''?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (english) map.set(chapter, english);
  }
  if (map.size < 81) throw new Error(`parsed ${map.size} Legge TTC chapters`);
  leggeCache = map;
  return map;
}

/** Fetch one Daodejing chapter (Chinese + Legge English), verbatim, with provenance. ref = chapter number. */
export async function fetchDaodejing(ref: string): Promise<FetchedText> {
  const chapter = Number(ref);
  if (!chapter || chapter < 1 || chapter > 81) throw new Error(`bad Daodejing chapter "${ref}"`);

  const [zh, legge] = await Promise.all([loadChinese(), loadLegge()]);
  const original = zh[chapter - 1]?.trim();
  const english = legge.get(chapter);
  if (!original) throw new Error(`no Chinese for Daodejing ${chapter}`);
  if (!english) throw new Error(`no Legge English for Daodejing ${chapter}`);

  return {
    canonicalRef: `Tao Te Ching ${chapter}`,
    originalText: original,
    originalLang: 'classical-chinese',
    transliteration: null,
    englishText: english,
    translator: 'James Legge',
    sourceUrl: `https://ctext.org/dao-de-jing/${chapter}`,
    license: 'public-domain',
  };
}
