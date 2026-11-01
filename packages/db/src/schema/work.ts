import { pgTable, serial, text, integer, varchar } from 'drizzle-orm/pg-core';
import { thinkers } from './thinker.js';

export const works = pgTable('works', {
  id: serial('id').primaryKey(),
  thinkerId: integer('thinker_id').notNull().references(() => thinkers.id),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh').notNull(),
  titleOrig: text('title_orig'),
  language: varchar('language', { length: 50 }).notNull().default('en'),
  circaYear: integer('circa_year'),
  description: text('description'),
  copyright: varchar('copyright', { length: 50 }).notNull().default('public-domain'),
  sourceUrl: text('source_url'),
});
