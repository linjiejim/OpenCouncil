import { pgTable, serial, text, integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { passages } from './passage.js';

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  icon: varchar('icon', { length: 50 }).notNull().default(''),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  themeId: integer('theme_id').references(() => themes.id),
});

export const passageTags = pgTable(
  'passage_tags',
  {
    passageId: integer('passage_id').notNull().references(() => passages.id),
    tagId: integer('tag_id').notNull().references(() => tags.id),
  },
  (table) => [primaryKey({ columns: [table.passageId, table.tagId] })],
);
