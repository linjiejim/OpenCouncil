import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NOTICE_PATH, renderNotice } from './notice.js';

describe('NOTICE.md', () => {
  it('matches the committed corpus (run `pnpm content:notice` after changing data/)', () => {
    expect(readFileSync(NOTICE_PATH, 'utf8')).toBe(renderNotice());
  });
});
