import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import type { Database } from '@opencouncil/db';
import { themes, tags } from '@opencouncil/db/schema';

export function themesRoute(db: Database) {
  const app = new Hono();

  // GET / — list all themes with their tags
  app.get('/', async (c) => {
    const themeRows = await db.select().from(themes).orderBy(themes.sortOrder);
    const tagRows = await db.select().from(tags);

    const result = themeRows.map((theme) => ({
      ...theme,
      tags: tagRows.filter((tag) => tag.themeId === theme.id),
    }));

    return c.json(result);
  });

  return app;
}
