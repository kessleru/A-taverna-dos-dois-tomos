import { describe, expect, it } from 'vitest';
import { DURACAO_FADE_S, DURACAO_PAGINA_S, temposTransicao } from './movimento';

describe('temposTransicao', () => {
  it('página virando leva 900 ms: a fase que sai levanta em volta da lombada', () => {
    expect(DURACAO_PAGINA_S).toBe(0.9);
    expect(temposTransicao(false)).toEqual({ saida: 0.45, entrada: 0, folha: 0.9 });
  });

  it('com movimento reduzido vira fade de 300 ms, sem folha', () => {
    expect(DURACAO_FADE_S).toBe(0.3);
    expect(temposTransicao(true)).toEqual({ saida: 0.15, entrada: 0.15, folha: 0 });
  });
});
