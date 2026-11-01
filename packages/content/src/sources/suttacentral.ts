/**
 * SuttaCentral / bilara-data adapter — the Dhammapada.
 *
 * Source: https://github.com/suttacentral/bilara-data (published branch)
 *   - root text:   romanized Pali (Mahāsaṅgīti edition)
 *   - translation: Bhikkhu Sujato — both released CC0 (public domain dedication)
 *
 * The data is segmented: each verse N is stored as keys `dhpN:1`, `dhpN:2`, …
 * (keys `dhpN:0.x` are structural headers we skip). We reassemble a verse by
 * joining its numbered segments in order — so the text is verbatim, not paraphrased.
 */
import { fetchJson } from './fetch.js';
import type { FetchedText } from './types.js';

const RAW = 'https://raw.githubusercontent.com/suttacentral/bilara-data/published';
const ROOT = (range: string) => `${RAW}/root/pli/ms/sutta/kn/dhp/dhp${range}_root-pli-ms.json`;
const TRANS = (range: string) => `${RAW}/translation/en/sujato/sutta/kn/dhp/dhp${range}_translation-en-sujato.json`;

/** Standard 26-vagga verse ranges of the Dhammapada (matches bilara file names). */
const VAGGA_RANGES = [
  '1-20', '21-32', '33-43', '44-59', '60-75', '76-89', '90-99', '100-115',
  '116-128', '129-145', '146-156', '157-166', '167-178', '179-196', '197-208',
  '209-220', '221-234', '235-255', '256-272', '273-289', '290-305', '306-319',
  '320-333', '334-359', '360-382', '383-423',
];

function rangeForVerse(n: number): string {
  for (const r of VAGGA_RANGES) {
    const [lo, hi] = r.split('-').map(Number);
    if (n >= lo && n <= hi) return r;
  }
  throw new Error(`Dhammapada verse ${n} is out of range (1–423)`);
}

type Segments = Record<string, string>;
const cache = new Map<string, Segments>();

async function loadRange(range: string, kind: 'root' | 'trans'): Promise<Segments> {
  const key = `${kind}:${range}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const data = await fetchJson<Segments>(kind === 'root' ? ROOT(range) : TRANS(range));
  cache.set(key, data);
  return data;
}

function joinVerse(segments: Segments, verse: number): string {
  const prefix = `dhp${verse}:`;
  const parts = Object.keys(segments)
    .filter((k) => k.startsWith(prefix) && !k.slice(prefix.length).startsWith('0'))
    .sort((a, b) => {
      const na = Number(a.slice(prefix.length));
      const nb = Number(b.slice(prefix.length));
      return na - nb;
    })
    .map((k) => segments[k]);
  return parts.join('').replace(/\s+/g, ' ').trim();
}

/** Fetch a single Dhammapada verse (Pali + Sujato English), verbatim, with provenance. */
export async function fetchDhammapadaVerse(verse: number): Promise<FetchedText> {
  const range = rangeForVerse(verse);
  const [root, trans] = await Promise.all([loadRange(range, 'root'), loadRange(range, 'trans')]);

  const pali = joinVerse(root, verse);
  const english = joinVerse(trans, verse);
  if (!pali) throw new Error(`No Pali text found for Dhp ${verse} in range ${range}`);
  if (!english) throw new Error(`No English text found for Dhp ${verse} in range ${range}`);

  return {
    canonicalRef: `Dhp ${verse}`,
    originalText: pali,
    originalLang: 'pali',
    transliteration: null, // Pali root is already romanized (IAST)
    englishText: english,
    translator: 'Bhikkhu Sujato',
    sourceUrl: `https://suttacentral.net/dhp${verse}/pli/ms`,
    license: 'CC0',
  };
}
