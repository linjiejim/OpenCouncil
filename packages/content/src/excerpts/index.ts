/**
 * Registry of excerpt-sourced works (anchored, verbatim cuts from public-domain
 * or openly licensed editions). `collect.ts` turns each into data/<dataFile>,
 * and `import.ts` loads them.
 */
import type { ExcerptWork } from './types.js';
import aristotle from './aristotle.js';
import epictetus from './epictetus.js';
import kant from './kant.js';
import marcusAurelius from './marcus-aurelius.js';
import mencius from './mencius.js';
import nietzsche from './nietzsche.js';
import plato from './plato.js';
import seneca from './seneca.js';
import wangYangming from './wang-yangming.js';
import zhuangzi from './zhuangzi.js';

export const EXCERPT_WORKS: ExcerptWork[] = [
  aristotle, epictetus, kant, marcusAurelius, mencius, nietzsche, plato, seneca, wangYangming, zhuangzi,
];
