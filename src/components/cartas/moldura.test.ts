import { describe, expect, it } from 'vitest';
import { SLOTS_MOLDURA, urlMoldura } from './moldura';
import { IMAGENS } from '../../data/assets';

describe('moldura das cartas', () => {
  it('cada raridade usa o metal da sua moldura', () => {
    expect(urlMoldura('comum')).toMatch(/molduras\/carta-bronze\.webp$/);
    expect(urlMoldura('rara')).toMatch(/molduras\/carta-prata\.webp$/);
    expect(urlMoldura('lendaria')).toMatch(/molduras\/carta-ouro\.webp$/);
  });

  it('as molduras entram no carregamento inicial', () => {
    for (const raridade of ['comum', 'rara', 'lendaria'] as const) expect(IMAGENS).toContain(urlMoldura(raridade));
  });

  it('todos os espaços da moldura ficam dentro da carta', () => {
    for (const [nome, slot] of Object.entries(SLOTS_MOLDURA)) {
      expect(slot.esquerda, nome).toBeGreaterThanOrEqual(0);
      expect(slot.topo, nome).toBeGreaterThanOrEqual(0);
      expect(slot.esquerda + slot.largura, nome).toBeLessThanOrEqual(100);
      expect(slot.topo + slot.altura, nome).toBeLessThanOrEqual(100);
    }
  });

  it('a janela de arte bate com a máscara do pacote (20–80% × 13,8–54,7%)', () => {
    const { arte } = SLOTS_MOLDURA;
    expect(arte.esquerda).toBeCloseTo(20, 0);
    expect(arte.esquerda + arte.largura).toBeCloseTo(80, 0);
    expect(arte.topo).toBeCloseTo(13.8, 0);
    expect(arte.topo + arte.altura).toBeCloseTo(54.7, 0);
  });
});
