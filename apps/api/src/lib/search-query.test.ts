import { describe, it, expect } from 'vitest';
import { toOrTsQuery } from './search-query.js';

describe('toOrTsQuery', () => {
  it('ORs meaningful terms in order', () => {
    expect(toOrTsQuery('death and meaning of life')).toBe('death | meaning | life');
  });

  it('drops short tokens and stop words', () => {
    expect(toOrTsQuery('how do I cope with the loss')).toBe('cope | loss');
  });

  it('returns empty (never a raw/unsafe query) when nothing usable remains', () => {
    // These previously fell through to a raw to_tsquery() call → syntax-error 500.
    expect(toOrTsQuery('?!')).toBe('');
    expect(toOrTsQuery('a I')).toBe('');
    expect(toOrTsQuery('')).toBe('');
  });

  it('never emits tsquery operator characters (& | ! : parens) as lexemes', () => {
    const q = toOrTsQuery('faith & doubt: (reason)! or | despair');
    // The only pipes present are our own OR separators, never inside a lexeme.
    for (const lexeme of q.split(' | ')) {
      expect(lexeme).toMatch(/^\w+$/);
    }
    expect(q).toContain('faith');
    expect(q).toContain('doubt');
    expect(q).toContain('despair');
  });
});
