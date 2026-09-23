import { describe, expect, it } from 'vitest';
import { marcosDaJornada } from './jornada';

const ideais = ['adaptar', 'adaptar', 'planejar', 'combinar'] as const;

describe('marcosDaJornada', () => {
  it('no começo, o primeiro marco é o atual e o resto é futuro', () => {
    expect(marcosDaJornada(0, [], ideais).map((m) => m.estado)).toEqual(['atual', 'futuro', 'futuro', 'futuro']);
  });

  it('marco jogado mostra a carta e se bateu com a história real', () => {
    const marcos = marcosDaJornada(2, ['adaptar', 'planejar'], ideais);
    expect(marcos[0]).toEqual({ estado: 'feito', escolha: 'adaptar', bateuReal: true });
    expect(marcos[1]).toEqual({ estado: 'feito', escolha: 'planejar', bateuReal: false });
    expect(marcos[2]).toEqual({ estado: 'atual' });
    expect(marcos[3]).toEqual({ estado: 'futuro' });
  });

  it('com a rodada completa, todos os marcos ficam feitos', () => {
    const marcos = marcosDaJornada(4, ['adaptar', 'adaptar', 'planejar', 'combinar'], ideais);
    expect(marcos.every((m) => m.estado === 'feito' && m.bateuReal)).toBe(true);
  });

  it('o marco atual que já tem escolha (consequência na tela) conta como feito', () => {
    expect(marcosDaJornada(1, ['adaptar', 'adaptar'], ideais)[1]).toEqual({ estado: 'feito', escolha: 'adaptar', bateuReal: true });
  });
});
