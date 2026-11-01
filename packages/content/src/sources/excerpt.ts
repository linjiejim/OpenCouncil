/**
 * Anchored-excerpt adapter — the generic way to pull a passage VERBATIM out of a
 * full public-domain text (Project Gutenberg plain text, Perseus TEI XML, a
 * Wikisource page, …) without writing a bespoke parser per edition.
 *
 * Each side of a passage (original + translation) is described by a source URL
 * and two literal anchors: the excerpt is the source text from the first
 * character of `start` through the last character of `end`. If an anchor is
 * missing or ambiguous, the fetch fails and the passage never enters the corpus.
 *
 * The only transformation applied is mechanical normalisation (markup stripped,
 * entities decoded, footnote markers removed, whitespace collapsed), so the
 * result is the source's wording, punctuation and spelling, character for
 * character. Anchors are matched against the normalised text.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchText } from './fetch.js';
import type { FetchedText } from './types.js';

/**
 * How to turn the downloaded document into plain text.
 *   text      — plain text (Project Gutenberg .txt)
 *   html      — an HTML page
 *   xml       — TEI XML (Perseus); <note> elements are dropped
 *   mediawiki — a MediaWiki `action=parse&prop=text&format=json` API response
 */
export type SourceFormat = 'text' | 'html' | 'xml' | 'mediawiki';

export interface ExcerptSide {
  url: string;
  format: SourceFormat;
  start: string;
  end: string;
  /** Optional: begin searching for `start` only after this anchor (disambiguates repeated phrases). */
  after?: string;
  /**
   * Optional regex (source string, applied globally) for an edition's own apparatus
   * that sits inside sentences — page/line markers like "|161.35|" or "#289#",
   * emphasis marks like "=…=". Only mechanical markers, never words.
   */
  strip?: string;
}

export interface ExcerptSpec {
  canonicalRef: string;
  original: ExcerptSide & { lang: string };
  english: ExcerptSide & { translator: string };
  /** Human-facing deep link for this passage. */
  sourceUrl: string;
  license: string;
}

const MAX_EXCERPT = 4000;
const CACHE_DIR = resolve(import.meta.dirname, '../../.cache/sources');

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…',
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function stripMarkup(s: string): string {
  return s
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<sup\b[\s\S]*?<\/sup>/gi, '') // footnote / reference markers
    .replace(/<\/?(p|div|br|li|tr|h\d|lg|l|section)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '');
}

export function normalize(raw: string, format: SourceFormat): string {
  let s = raw.replace(/^\ufeff/, '');
  if (format === 'mediawiki') {
    const d = JSON.parse(s) as { parse?: { text?: { '*'?: string } } };
    s = d.parse?.text?.['*'] ?? '';
    if (!s) throw new Error('empty MediaWiki parse response');
    s = s.replace(/<span class="mw-editsection"[\s\S]*?<\/span>\s*<\/span>/g, '');
  }
  if (format === 'xml') {
    s = s.replace(/<teiHeader[\s\S]*?<\/teiHeader>/i, '').replace(/<note\b[\s\S]*?<\/note>/gi, '');
  }
  if (format !== 'text') s = decodeEntities(stripMarkup(s));
  // Footnote markers like "[A]" / "[12]" (Gutenberg) — not part of the author's text.
  s = s.replace(/\[(?:[A-Z]|\d{1,3})\]/g, '');
  // Zero-width characters (U+200B–U+200D, U+2060, BOM) are invisible markup artefacts.
  s = s.replace(/[\u200b-\u200d\u2060\ufeff]/g, '');
  return s.replace(/\s+/g, ' ').trim();
}

const memo = new Map<string, Promise<string>>();

function applyStrip(text: string, strip?: string): string {
  return strip ? text.replace(new RegExp(strip, 'g'), '').replace(/\s+/g, ' ').trim() : text;
}

/** Download (with an on-disk cache, so iterating on anchors doesn't hammer the source) and normalise. */
export function loadSource(url: string, format: SourceFormat, strip?: string): Promise<string> {
  const key = `${format} ${strip ?? ''} ${url}`;
  let p = memo.get(key);
  if (!p) {
    p = (async () => {
      const file = resolve(CACHE_DIR, createHash('sha256').update(url).digest('hex').slice(0, 24));
      if (existsSync(file)) return applyStrip(normalize(readFileSync(file, 'utf8'), format), strip);
      const raw = await fetchText(url, 60_000);
      const text = normalize(raw, format); // throws on a malformed response — then nothing is cached
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(file, raw);
      return applyStrip(text, strip);
    })();
    memo.set(key, p);
  }
  return p;
}

/** Cut the excerpt between the anchors out of normalised text. Throws if not found or ambiguous. */
export function cut(text: string, side: Pick<ExcerptSide, 'start' | 'end' | 'after'>, label = ''): string {
  const start = side.start.replace(/\s+/g, ' ').trim();
  const end = side.end.replace(/\s+/g, ' ').trim();
  let from = 0;
  if (side.after) {
    const a = text.indexOf(side.after.replace(/\s+/g, ' ').trim());
    if (a < 0) throw new Error(`${label}: "after" anchor not found: ${side.after}`);
    from = a;
  }
  const i = text.indexOf(start, from);
  if (i < 0) throw new Error(`${label}: start anchor not found: ${start}`);
  if (text.indexOf(start, i + 1) >= 0 && !side.after) {
    throw new Error(`${label}: start anchor is ambiguous (occurs more than once): ${start}`);
  }
  const j = text.indexOf(end, i);
  if (j < 0) throw new Error(`${label}: end anchor not found after start: ${end}`);
  const out = text.slice(i, j + end.length);
  if (out.length > MAX_EXCERPT) throw new Error(`${label}: excerpt is ${out.length} chars (> ${MAX_EXCERPT}); anchors probably wrong`);
  return out;
}

export async function fetchExcerpt(spec: ExcerptSpec): Promise<FetchedText> {
  const [orig, en] = await Promise.all([
    loadSource(spec.original.url, spec.original.format, spec.original.strip),
    loadSource(spec.english.url, spec.english.format, spec.english.strip),
  ]);
  return {
    canonicalRef: spec.canonicalRef,
    originalText: cut(orig, spec.original, `${spec.canonicalRef} original`),
    originalLang: spec.original.lang,
    transliteration: null,
    englishText: cut(en, spec.english, `${spec.canonicalRef} english`),
    translator: spec.english.translator,
    sourceUrl: spec.sourceUrl,
    license: spec.license,
  };
}
