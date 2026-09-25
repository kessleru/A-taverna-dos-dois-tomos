import { describe, expect, it } from 'vitest';
import { aleatorio } from './brasas';
import { VOLUME_BATIDA, parametrosBatida } from './batida';

describe('batida do clique', () => {
  it('clique comum varia o tom perto de 1', () => {
    const p = parametrosBatida(1, aleatorio(2));
    expect(p.tom).toBeGreaterThan(0.85);
    expect(p.tom).toBeLessThan(1.15);
    expect(p.volume).toBeCloseTo(VOLUME_BATIDA * 0.8);
  });

  it('sequência de cliques fica mais cheia e mais alta', () => {
    const comum = parametrosBatida(1, () => 0.5);
    const forte = parametrosBatida(2, () => 0.5);
    expect(forte.volume).toBeGreaterThan(comum.volume);
    expect(forte.graos.length).toBeGreaterThan(comum.graos.length);
    expect(forte.tom).toBeGreaterThan(comum.tom);
  });

  it('força fora da faixa é limitada', () => {
    expect(parametrosBatida(50, () => 0.5)).toEqual(parametrosBatida(2.2, () => 0.5));
    expect(parametrosBatida(-3, () => 0.5)).toEqual(parametrosBatida(1, () => 0.5));
  });
});
