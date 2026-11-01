import { pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core';

export interface ConceptMapping {
  tradition: string;
  termOrig: string;
  termEn: string;
  thinkerId?: number;
  note?: string;
}

export const conceptMaps = pgTable('concept_maps', {
  id: serial('id').primaryKey(),
  conceptEn: text('concept_en').notNull(),
  conceptZh: text('concept_zh').notNull().default(''),
  mappings: jsonb('mappings').$type<ConceptMapping[]>().notNull().default([]),
});
