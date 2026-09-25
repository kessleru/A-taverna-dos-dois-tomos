import { describe, expect, it } from 'vitest';
import { naoVistos } from './vistos';

describe('ajudas já vistas', () => {
  it('deixa só o que ainda não apareceu, na ordem original', () => {
    const itens = [{ termo: 'A' }, { termo: 'B' }, { termo: 'C' }];
    expect(naoVistos(itens, (i) => i.termo, ['B'])).toEqual([{ termo: 'A' }, { termo: 'C' }]);
  });

  it('tudo visto: nada a mostrar', () => {
    expect(naoVistos(['x', 'y'], (i) => i, ['x', 'y'])).toEqual([]);
  });
});
