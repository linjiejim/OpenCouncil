import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { verify } from './verify.js';
import type { FetchedText } from './types.js';

const GOOD: FetchedText = {
  canonicalRef: 'Dhp 5',
  originalText: 'Na hi verena verāni, sammantīdha kudācanaṁ;',
  originalLang: 'pali',
  transliteration: null,
  englishText: 'For never is hatred laid to rest by hate, it’s laid to rest by love.',
  translator: 'Bhikkhu Sujato',
  sourceUrl: 'https://suttacentral.net/dhp5/pli/ms',
  license: 'CC0',
};

describe('verify gate', () => {
  it('passes a well-formed, correctly-scripted passage', () => {
    expect(verify(GOOD).status).toBe('verified');
  });

  it('flags empty original text', () => {
    expect(verify({ ...GOOD, originalText: '' }).status).toBe('needs-review');
  });

  it('flags wrong-script original (the fabrication failure mode)', () => {
    // Arabic-tagged passage whose "original" is actually Latin script → caught.
    expect(verify({ ...GOOD, originalLang: 'arabic' }).status).toBe('needs-review');
  });

  it('flags original identical to english (copy error)', () => {
    expect(verify({ ...GOOD, originalText: GOOD.englishText }).status).toBe('needs-review');
  });
});

describe('collected data integrity', () => {
  const dataDir = resolve(import.meta.dirname, '../data');
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'));

  it('has collected data files', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`${file}: every passage is verified and fully sourced`, () => {
      const work = JSON.parse(readFileSync(resolve(dataDir, file), 'utf8'));
      const passages = work.chapters.flatMap((c: any) => c.passages);
      expect(passages.length).toBeGreaterThan(0);
      for (const p of passages) {
        expect(p.verificationStatus, `${p.canonicalRef} status`).toBe('verified');
        expect(p.originalText?.length, `${p.canonicalRef} original`).toBeGreaterThan(1);
        expect(p.englishText?.length, `${p.canonicalRef} english`).toBeGreaterThan(1);
        expect(p.canonicalRef, 'canonicalRef').toBeTruthy();
        expect(p.translator, `${p.canonicalRef} translator`).toBeTruthy();
        expect(p.sourceUrl, `${p.canonicalRef} sourceUrl`).toMatch(/^https?:\/\//);
        expect(p.license, `${p.canonicalRef} license`).toBeTruthy();
      }
    });
  }
});

describe('excerpt registry', () => {
  it('canonicalRefs are unique within each work (they key the collector and expander)', async () => {
    const { EXCERPT_WORKS } = await import('../excerpts/index.js');
    for (const w of EXCERPT_WORKS) {
      expect(w.work.copyright.length, `${w.thinkerSlug} copyright fits varchar(50)`).toBeLessThanOrEqual(50);
      const refs = w.items.map((i) => i.canonicalRef);
      expect(new Set(refs).size, `${w.thinkerSlug} has duplicate canonicalRefs`).toBe(refs.length);
    }
  });
});
