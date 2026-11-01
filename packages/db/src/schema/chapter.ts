import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { works } from './work.js';

export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  workId: integer('work_id').notNull().references(() => works.id),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh').notNull().default(''),
  titleOrig: text('title_orig'),
  sortOrder: integer('sort_order').notNull().default(0),
});
