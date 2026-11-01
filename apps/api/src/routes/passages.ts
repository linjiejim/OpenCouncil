import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { passages, chapters, works, thinkers, passageTags, tags } from '@opencouncil/db/schema';

export function passagesRoute(db: Database) {
  const app = new Hono();

  // GET /by-chapter/:chapterId — list passages in a chapter
  app.get('/by-chapter/:chapterId', async (c) => {
    const chapterId = Number(c.req.param('chapterId'));
    const rows = await db
      .select()
      .from(passages)
      .where(eq(passages.chapterId, chapterId))
      .orderBy(passages.sortOrder);
    return c.json(rows);
  });

  // GET /:id — passage detail with context
  app.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const [passage] = await db.select().from(passages).where(eq(passages.id, id)).limit(1);
    if (!passage) return c.json({ error: 'Not found' }, 404);

    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, passage.chapterId)).limit(1);
    const [work] = await db.select().from(works).where(eq(works.id, chapter.workId)).limit(1);
    const [thinker] = await db.select().from(thinkers).where(eq(thinkers.id, work.thinkerId)).limit(1);

    // Get tags
    const tagRows = await db
      .select({ id: tags.id, slug: tags.slug, nameEn: tags.nameEn, nameZh: tags.nameZh })
      .from(passageTags)
      .innerJoin(tags, eq(passageTags.tagId, tags.id))
      .where(eq(passageTags.passageId, id));

    return c.json({ ...passage, chapter, work, thinker, tags: tagRows });
  });

  return app;
}
