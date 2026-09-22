import { describe, expect, it } from 'vitest';
import { ordemFases } from './types';

describe('ordemFases', () => {
  it('tem as 6 fases na ordem da apresentação', () => {
    expect(ordemFases).toEqual(['abertura', 'briefing', 'rodada', 'resultado', 'artigos', 'fusao']);
  });
});
