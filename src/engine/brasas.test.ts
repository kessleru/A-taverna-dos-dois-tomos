import { describe, expect, it } from 'vitest';
import { gerarBrasas } from './brasas';

describe('gerarBrasas', () => {
  const brasas = gerarBrasas(26, 7);

  it('gera a quantidade pedida', () => {
    expect(brasas).toHaveLength(26);
  });

  it('mantém cada valor dentro da faixa', () => {
    for (const b of brasas) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x).toBeLessThanOrEqual(100);
      expect(b.tamanho).toBeGreaterThanOrEqual(3);
      expect(b.tamanho).toBeLessThanOrEqual(7);
      expect(b.duracao).toBeGreaterThanOrEqual(7);
      expect(b.duracao).toBeLessThanOrEqual(14);
      expect(b.atraso).toBeGreaterThanOrEqual(0);
      expect(b.atraso).toBeLessThanOrEqual(b.duracao);
      expect(Math.abs(b.deriva)).toBeLessThanOrEqual(60);
    }
  });

  it('é determinístico pela semente (mesma tela em todo ensaio)', () => {
    expect(gerarBrasas(26, 7)).toEqual(brasas);
    expect(gerarBrasas(26, 8)).not.toEqual(brasas);
  });
});
