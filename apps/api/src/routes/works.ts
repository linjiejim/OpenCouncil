import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { works, chapters, thinkers, passages } from '@opencouncil/db/schema';
import { asRows } from '../lib/rows.js';

export function worksRoute(db: Database) {
  const app = new Hono();

  // GET /:id — work detail with chapters
  app.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const [work] = await db.select().from(works).where(eq(works.id, id)).limit(1);
    if (!work) return c.json({ error: 'Not found' }, 404);

    const [thinker] = await db.select().from(thinkers).where(eq(thinkers.id, work.thinkerId)).limit(1);

    // Use raw SQL to get proper correlated subquery for passage counts
    const chaptersRows = await db.execute(sql`
      SELECT
        c.id, c.title_en, c.title_zh, c.title_orig, c.sort_order,
        (SELECT count(*)::int FROM passages p WHERE p.chapter_id = c.id) AS passage_count
      FROM chapters c
      WHERE c.work_id = ${id}
      ORDER BY c.sort_order
    `);

    return c.json({ ...work, thinker, chapters: asRows(chaptersRows) });
  });

  return app;
}
