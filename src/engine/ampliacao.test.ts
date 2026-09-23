import { describe, expect, it } from 'vitest';
import { fatorAmpliacao } from './ampliacao';

describe('fatorAmpliacao', () => {
  it('leva a carta até a altura-alvo, descontando a escala que ela já tem', () => {
    // Carta grande: 364 px de altura base × 1,8 de escala = 655 px na tela.
    expect(fatorAmpliacao(364, 1.8, 900)).toBeCloseTo(900 / 655.2, 6);
  });

  it('carta pequena cresce mais para chegar à mesma altura', () => {
    expect(fatorAmpliacao(238, 1.8, 900)).toBeCloseTo(900 / 428.4, 6);
  });

  it('nunca encolhe uma carta que já é maior que o alvo', () => {
    expect(fatorAmpliacao(600, 1.8, 900)).toBe(1);
  });

  it('medidas inválidas não geram zoom infinito nem NaN', () => {
    expect(fatorAmpliacao(0, 1.8, 900)).toBe(1);
    expect(fatorAmpliacao(364, 0, 900)).toBe(1);
  });
});
