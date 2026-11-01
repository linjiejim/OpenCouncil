/**
 * Rumi adapter — authentic Persian + public-domain English, paired by hand.
 *
 *   • original:    ganjoor.net API — the canonical Persian text of the Masnavi.
 *   • translation: E. H. Whinfield's "Masnavi I Ma'navi" (1898, public domain),
 *                  via Wikisource (clean wikitext, not OCR).
 *
 * Because the Masnavi is one long narrative poem, passages are curated by hand:
 * each spec names a ganjoor poem + beyt range and the matching Whinfield section.
 * The collector still runs every result through the verification gate, and each
 * pairing is eyeballed before import.
 */
import { fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

export interface RumiSpec {
  canonicalRef: string;       // e.g. "Masnavi I, Proem (Song of the Reed)"
  ganjoorUrl: string;         // e.g. "/moulavi/masnavi/daftar1/sh1"
  beytFrom: number;           // 1-based inclusive
  beytTo: number;
  whinfieldBook: string;      // Roman numeral, e.g. "I"
  whinfieldHeading: string;   // exact section heading, e.g. "PROLOGUE."
}

interface GanjoorPoem { verses?: { vOrder: number; text: string }[] }

async function fetchGanjoorBeyts(url: string, from: number, to: number): Promise<string> {
  const d = await fetchJson<GanjoorPoem>(`https://api.ganjoor.net/api/ganjoor/poem?url=${encodeURIComponent(url)}`);
  const verses = (d.verses ?? []).filter((v) => v.vOrder >= from && v.vOrder <= to).sort((a, b) => a.vOrder - b.vOrder);
  // Persian beyts come as alternating misras (half-lines); pair them into couplets.
  const lines = verses.map((v) => v.text.trim()).filter(Boolean);
  return lines.join(' / ');
}

const wikiCache = new Map<string, string>();
async function fetchWhinfieldBook(book: string): Promise<string> {
  const hit = wikiCache.get(book);
  if (hit) return hit;
  const page = `Masnavi I Ma'navi/Book ${book}`;
  const d = await fetchJson<{ parse?: { wikitext?: { '*'?: string } } }>(
    `https://en.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&format=json`,
  );
  const wt = d.parse?.wikitext?.['*'] ?? '';
  if (!wt) throw new Error(`empty Whinfield wikitext for Book ${book}`);
  wikiCache.set(book, wt);
  return wt;
}

/** Extract the body under `== heading ==` up to the next heading, cleaned. */
function whinfieldSection(wt: string, heading: string): string {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`==+\\s*${esc}\\s*==+([\\s\\S]*?)(?:\\n==|$)`);
  const m = wt.match(re);
  if (!m) throw new Error(`Whinfield section not found: "${heading}"`);
  return m[1]
    .replace(/<ref[^>]*>.*?<\/ref>/gis, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/(?<=[.,!?:;])\s*\d+(?=\s|$)/g, '') // trailing footnote numbers
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchRumiPassage(spec: RumiSpec): Promise<FetchedText> {
  const [persian, book] = await Promise.all([
    fetchGanjoorBeyts(spec.ganjoorUrl, spec.beytFrom, spec.beytTo),
    fetchWhinfieldBook(spec.whinfieldBook),
  ]);
  const english = whinfieldSection(book, spec.whinfieldHeading);
  if (!persian) throw new Error(`no Persian beyts for ${spec.canonicalRef}`);
  if (!english) throw new Error(`no Whinfield English for ${spec.canonicalRef}`);

  return {
    canonicalRef: spec.canonicalRef,
    originalText: persian,
    originalLang: 'persian',
    transliteration: null,
    englishText: english,
    translator: 'E. H. Whinfield (1898)',
    sourceUrl: `https://ganjoor.net${spec.ganjoorUrl}`,
    license: 'public-domain',
  };
}
