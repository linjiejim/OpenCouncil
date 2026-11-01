import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { thinkers, works, chapters, passages } from '@opencouncil/db/schema';
import { asRows } from '../lib/rows.js';
import { RENAMED_SLUGS } from '@opencouncil/types';

export function thinkersRoute(db: Database) {
  const app = new Hono();

  // GET / — list all thinkers
  app.get('/', async (c) => {
    const tradition = c.req.query('tradition');
    const rows = await db.select().from(thinkers).orderBy(thinkers.slug);
    const filtered = tradition ? rows.filter((r) => r.tradition === tradition) : rows;
    return c.json(filtered);
  });

  // GET /:slug — thinker detail with works
  app.get('/:slug', async (c) => {
    // Old links (/thinker/buddha …) keep working after the scripture renames.
    const param = c.req.param('slug');
    const slug = RENAMED_SLUGS[param] ?? param;
    const [thinker] = await db.select().from(thinkers).where(eq(thinkers.slug, slug)).limit(1);
    if (!thinker) return c.json({ error: 'Not found' }, 404);

    // Use raw SQL for proper correlated subquery
    const worksRows = await db.execute(sql`
      SELECT
        w.id, w.title_en, w.title_zh, w.title_orig, w.language, w.circa_year,
        w.description, w.copyright, w.source_url,
        (SELECT count(*)::int FROM chapters c WHERE c.work_id = w.id) AS chapter_count
      FROM works w
      WHERE w.thinker_id = ${thinker.id}
      ORDER BY w.circa_year
    `);

    return c.json({ ...thinker, works: asRows(worksRows) });
  });

  return app;
}
