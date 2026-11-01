/**
 * Normalize the result of `db.execute(sql`...`)` into a plain row array.
 *
 * With the postgres-js Drizzle driver, `db.execute` returns a `RowList`
 * (an array-like of rows) — the rows ARE the returned value, and there is no
 * `.rows` property. Other drivers (e.g. node-postgres) return `{ rows }`.
 * This helper handles both shapes so callers don't reach for a `.rows`
 * property that doesn't exist on the postgres-js result type.
 */
export function asRows<T = Record<string, unknown>>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}
