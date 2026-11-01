/**
 * `pnpm content:excerpt-check <file> [ref-substring]` — fetch every excerpt of an
 * excerpt-sourced work and print it (or the anchor error), without enrichment or
 * writing anything. Use it while curating anchors.
 *
 *   pnpm content:excerpt-check marcus-aurelius
 */
import { fetchExcerpt } from './sources/excerpt.js';
import { verify } from './sources/verify.js';
import { ALLOWED_TAGS } from './works.js';
import type { ExcerptWork } from './excerpts/types.js';

const [name, filter] = process.argv.slice(2);
if (!name) {
  console.error('usage: content:excerpt-check <excerpts/file-stem> [ref-substring]');
  process.exit(2);
}
const mod = (await import(`./excerpts/${name}.js`)) as { default: ExcerptWork };
const work = mod.default;
let bad = 0;
for (const item of work.items) {
  if (filter && !item.canonicalRef.includes(filter)) continue;
  try {
    const t = await fetchExcerpt(item);
    const v = verify(t);
    const unknownTags = item.tags.filter((tag) => !ALLOWED_TAGS.includes(tag));
    const issues = [...v.issues, ...unknownTags.map((tag) => `unknown tag ${tag}`)];
    console.log(`\n${issues.length ? '❌' : '✅'} ${t.canonicalRef}${issues.length ? `  (${issues.join('; ')})` : ''}`);
    console.log(`   ORIG: ${t.originalText}`);
    console.log(`   EN:   ${t.englishText}`);
    if (issues.length) bad++;
  } catch (err) {
    bad++;
    console.log(`\n❌ ${item.canonicalRef}: ${(err as Error).message}`);
  }
}
console.log(`\n${work.items.length} items, ${bad} failing`);
process.exit(bad ? 1 : 0);
