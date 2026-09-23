import { describe, expect, it } from 'vitest';
import { emAlerta, nivelLiquido } from './indicador';

describe('nivelLiquido', () => {
  it('mínimo é vazio e máximo é cheio', () => {
    expect(nivelLiquido(5)).toBe(0);
    expect(nivelLiquido(100)).toBe(1);
  });

  it('valor do meio fica proporcional', () => {
    expect(nivelLiquido(52.5)).toBeCloseTo(0.5, 6);
  });

  it('fora da faixa fica limitado entre vazio e cheio', () => {
    expect(nivelLiquido(-20)).toBe(0);
    expect(nivelLiquido(180)).toBe(1);
  });
});

describe('emAlerta', () => {
  it('alerta no limite de "quase quebrou" e abaixo dele', () => {
    expect(emAlerta(15)).toBe(true);
    expect(emAlerta(6)).toBe(true);
  });

  it('sem alerta acima do limite', () => {
    expect(emAlerta(16)).toBe(false);
  });
});
