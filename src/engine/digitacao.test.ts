import { describe, expect, it } from 'vitest';
import { digitar } from './digitacao';

describe('digitar', () => {
  const linhas = ['abc', 'de'];

  it('nada digitado ainda', () => {
    expect(digitar(linhas, 0)).toEqual({ linhas: [], completo: false });
  });

  it('meio da primeira linha', () => {
    expect(digitar(linhas, 2)).toEqual({ linhas: ['ab'], completo: false });
  });

  it('fim exato da primeira linha não abre a segunda', () => {
    expect(digitar(linhas, 3)).toEqual({ linhas: ['abc'], completo: false });
  });

  it('começo da segunda linha', () => {
    expect(digitar(linhas, 4)).toEqual({ linhas: ['abc', 'd'], completo: false });
  });

  it('tudo digitado', () => {
    expect(digitar(linhas, 5)).toEqual({ linhas: ['abc', 'de'], completo: true });
    expect(digitar(linhas, 99)).toEqual({ linhas: ['abc', 'de'], completo: true });
  });

  it('valor negativo conta como zero', () => {
    expect(digitar(linhas, -3)).toEqual({ linhas: [], completo: false });
  });

  it('sem linhas já está completo', () => {
    expect(digitar([], 0)).toEqual({ linhas: [], completo: true });
  });

  it('linha nova no log continua de onde parou, sem redigitar', () => {
    expect(digitar(['abc', 'de', 'fg'], 5)).toEqual({ linhas: ['abc', 'de'], completo: false });
  });
});
