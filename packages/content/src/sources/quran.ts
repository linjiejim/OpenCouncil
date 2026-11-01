/**
 * Quran.com API adapter (Tanzil-based text).
 *
 * Source: https://api.quran.com/api/v4
 *   - original:        Uthmani Arabic (Tanzil project)
 *   - translation 19:  Marmaduke Pickthall, 1930 — public domain
 *   - translation 57:  word/verse transliteration (romanization)
 *
 * Returns verbatim verse text keyed by canonical reference "Quran S:V".
 */
import { fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

const PICKTHALL = 19;
const TRANSLITERATION = 57;

interface VerseResponse {
  verse: {
    verse_key: string;
    text_uthmani: string;
    translations?: { resource_id: number; text: string }[];
  };
}

/** Strip footnote/HTML markup that quran.com embeds in some translations. */
function clean(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/gis, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Fetch a single Quran verse (Arabic + Pickthall + transliteration), verbatim, with provenance. */
export async function fetchQuranVerse(ref: string): Promise<FetchedText> {
  const key = ref.trim(); // "2:255"
  const url =
    `https://api.quran.com/api/v4/verses/by_key/${encodeURIComponent(key)}` +
    `?fields=text_uthmani&translations=${PICKTHALL},${TRANSLITERATION}`;
  const data = await fetchJson<VerseResponse>(url);
  const v = data.verse;
  if (!v?.text_uthmani) throw new Error(`No Arabic text for Quran ${key}`);

  const byId = new Map((v.translations ?? []).map((t) => [t.resource_id, clean(t.text)]));
  const english = byId.get(PICKTHALL) ?? '';
  const translit = byId.get(TRANSLITERATION) ?? null;
  if (!english) throw new Error(`No Pickthall translation for Quran ${key}`);

  return {
    canonicalRef: `Quran ${v.verse_key}`,
    originalText: v.text_uthmani,
    originalLang: 'arabic',
    transliteration: translit,
    englishText: english,
    translator: 'Marmaduke Pickthall (1930)',
    sourceUrl: `https://quran.com/${v.verse_key.replace(':', '/')}`,
    license: 'Arabic: CC BY 3.0 (Tanzil); English: public domain',
  };
}
