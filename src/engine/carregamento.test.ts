import { describe, expect, it } from 'vitest';
import { carregarTudo } from './carregamento';

const ok = () => Promise.resolve();
const falha = () => Promise.reject(new Error('404'));
const nunca = () => new Promise<void>(() => {});

describe('carregarTudo', () => {
  it('avisa o progresso a cada item e termina com tudo carregado', async () => {
    const progresso: [number, number][] = [];
    const resultado = await carregarTudo([ok, ok, ok], (feitos, total) => progresso.push([feitos, total]));
    expect(progresso).toEqual([
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
    expect(resultado).toEqual({ total: 3, falhas: 0 });
  });

  it('arquivo que falha conta como feito, para o jogo não travar', async () => {
    const resultado = await carregarTudo([ok, falha, ok], () => {});
    expect(resultado).toEqual({ total: 3, falhas: 1 });
  });

  it('arquivo que nunca responde desiste depois do limite de tempo', async () => {
    const resultado = await carregarTudo([ok, nunca], () => {}, 20);
    expect(resultado).toEqual({ total: 2, falhas: 1 });
  });

  it('lista vazia termina na hora', async () => {
    const progresso: [number, number][] = [];
    expect(await carregarTudo([], (f, t) => progresso.push([f, t]))).toEqual({ total: 0, falhas: 0 });
    expect(progresso).toEqual([[0, 0]]);
  });
});
