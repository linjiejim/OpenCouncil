import { describe, it, expect } from 'vitest';
import {
  selectFrontier,
  existingRefs,
  mergeIntoWork,
  type WorkData,
  type BuiltItem,
} from './expand-core.js';
import { EXPANDABLE_WORKS } from './works.js';

const sampleWork = (): WorkData => ({
  work: { titleEn: 'Test' },
  chapters: [
    { titleEn: 'Ch A', titleZh: '甲', passages: [{ originalText: 'o1', englishText: 'e1', canonicalRef: 'Dhp 1' }] },
    { titleEn: 'Ch B', titleZh: '乙', passages: [{ originalText: 'o2', englishText: 'e2', canonicalRef: 'Dhp 5' }] },
  ],
});

describe('existingRefs', () => {
  it('collects every canonicalRef in the work', () => {
    expect(existingRefs(sampleWork())).toEqual(new Set(['Dhp 1', 'Dhp 5']));
  });
  it('ignores passages without a canonicalRef', () => {
    const w: WorkData = { work: {}, chapters: [{ titleEn: 'x', titleZh: '', passages: [{ originalText: 'a', englishText: 'b' }] }] };
    expect(existingRefs(w).size).toBe(0);
  });
});

describe('selectFrontier', () => {
  const refToCanonical = (r: string) => `Dhp ${r}`;
  const backlog = ['1', '2', '3', '4', '5', '6'];

  it('skips already-collected refs and respects the cap, preserving order', () => {
    const existing = new Set(['Dhp 1', 'Dhp 3']);
    expect(selectFrontier(existing, backlog, refToCanonical, 2)).toEqual(['2', '4']);
  });
  it('returns nothing when the frontier is fully consumed', () => {
    const existing = new Set(backlog.map(refToCanonical));
    expect(selectFrontier(existing, backlog, refToCanonical, 5)).toEqual([]);
  });
  it('a cap of 0 selects nothing', () => {
    expect(selectFrontier(new Set(), backlog, refToCanonical, 0)).toEqual([]);
  });
});

describe('mergeIntoWork', () => {
  const built = (titleEn: string, ref: string): BuiltItem => ({
    chapter: { titleEn, titleZh: 'z' },
    passage: { originalText: 'o', englishText: 'e', canonicalRef: ref, verificationStatus: 'verified' },
  });

  it('appends into an existing chapter matched by titleEn', () => {
    const w = sampleWork();
    mergeIntoWork(w, [built('Ch A', 'Dhp 2')]);
    const chA = w.chapters.find((c) => c.titleEn === 'Ch A')!;
    expect(chA.passages.map((p) => p.canonicalRef)).toEqual(['Dhp 1', 'Dhp 2']);
    expect(w.chapters).toHaveLength(2); // no new chapter created
  });
  it('creates a new chapter when titleEn is unseen', () => {
    const w = sampleWork();
    mergeIntoWork(w, [built('Ch C', 'Dhp 9')]);
    expect(w.chapters).toHaveLength(3);
    expect(w.chapters.at(-1)!.titleEn).toBe('Ch C');
  });
  it('returns the number of items merged', () => {
    expect(mergeIntoWork(sampleWork(), [built('Ch A', 'Dhp 2'), built('Ch C', 'Dhp 9')])).toBe(2);
  });
});

describe('EXPANDABLE_WORKS registry', () => {
  it('covers the five aligned canons with non-empty, duplicate-free backlogs', () => {
    expect(EXPANDABLE_WORKS.map((w) => w.slug).sort()).toEqual(
      ['confucius', 'dhammapada', 'gospels', 'laozi', 'quran'],
    );
    for (const w of EXPANDABLE_WORKS) {
      const bl = w.backlog();
      expect(bl.length, `${w.slug} backlog`).toBeGreaterThan(0);
      expect(new Set(bl).size, `${w.slug} has no duplicate refs`).toBe(bl.length);
    }
  });

  it('refToCanonical matches each adapter’s stamped canonicalRef format', () => {
    const byslug = Object.fromEntries(EXPANDABLE_WORKS.map((w) => [w.slug, w]));
    expect(byslug.dhammapada.refToCanonical('5')).toBe('Dhp 5');
    expect(byslug.laozi.refToCanonical('8')).toBe('Tao Te Ching 8');
    expect(byslug.quran.refToCanonical('2:255')).toBe('Quran 2:255');
    expect(byslug.gospels.refToCanonical('Matthew 5:3')).toBe('Matthew 5:3');
    expect(byslug.confucius.refToCanonical('4.16')).toBe('Analects 4.16');
  });

  it('every Analects backlog ref carries an integrity anchor', () => {
    const confucius = EXPANDABLE_WORKS.find((w) => w.slug === 'confucius')!;
    for (const ref of confucius.backlog()) {
      expect(confucius.label(ref).expectContains, `${ref} anchor`).toBeTruthy();
    }
  });
});
