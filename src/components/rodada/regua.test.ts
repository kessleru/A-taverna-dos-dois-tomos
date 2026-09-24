import { describe, expect, it } from 'vitest';
import { faixaDaFace, minimoNoDado } from './ReguaDado';

describe('régua do dado', () => {
  it('com bônus +4 basta tirar 7 (70%)', () => {
    expect(minimoNoDado(4)).toEqual({ minimo: 7, chance: 70 });
  });

  it('com bônus negativo precisa de mais', () => {
    expect(minimoNoDado(-2)).toEqual({ minimo: 13, chance: 40 });
  });

  it('bônus alto garante o sucesso em qualquer face', () => {
    expect(minimoNoDado(12)).toEqual({ minimo: 1, chance: 100 });
  });

  it('20 natural é sempre crítico, mesmo com bônus ruim', () => {
    expect(faixaDaFace(20, -5)).toBe('critico');
    expect(faixaDaFace(19, -5)).toBe('sucesso');
    expect(faixaDaFace(5, -5)).toBe('falha');
  });
});
