import { pgTable, serial, text, integer, varchar } from 'drizzle-orm/pg-core';

export const thinkers = pgTable('thinkers', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  nameOrig: text('name_orig'),
  tradition: varchar('tradition', { length: 50 }).notNull(),
  era: varchar('era', { length: 100 }).notNull(),
  bornYear: integer('born_year'),
  diedYear: integer('died_year'),
  bioEn: text('bio_en').notNull().default(''),
  bioZh: text('bio_zh').notNull().default(''),
  coreIdeasEn: text('core_ideas_en').notNull().default(''),
  coreIdeasZh: text('core_ideas_zh').notNull().default(''),
  portraitUrl: text('portrait_url'),
  region: varchar('region', { length: 100 }).notNull().default(''),
});
