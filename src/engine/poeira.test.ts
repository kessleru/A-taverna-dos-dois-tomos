import { describe, expect, it } from 'vitest';
import { aleatorio } from './brasas';
import { MAX_SEQUENCIA, atualizarParticulas, emitirFaiscas, emitirPoeira, forcaDaSequencia, opacidadeAtual, proximaSequencia } from './poeira';

describe('sequência de cliques', () => {
  it('cliques rápidos no mesmo lugar sobem a contagem', () => {
    let s = proximaSequencia(null, 100, 100, 0);
    s = proximaSequencia(s, 110, 105, 200);
    s = proximaSequencia(s, 105, 100, 400);
    expect(s.contagem).toBe(2);
  });

  it('longe ou devagar recomeça do zero', () => {
    const s = proximaSequencia(null, 100, 100, 0);
    expect(proximaSequencia(s, 400, 100, 100).contagem).toBe(0);
    expect(proximaSequencia(s, 100, 100, 2000).contagem).toBe(0);
  });

  it('a força para de crescer no limite', () => {
    expect(forcaDaSequencia(0)).toBe(1);
    expect(forcaDaSequencia(99)).toBe(forcaDaSequencia(MAX_SEQUENCIA));
  });
});

describe('partículas', () => {
  it('clique forte solta mais poeira que o comum', () => {
    const fraco = emitirPoeira(0, 0, 1, aleatorio(1));
    const forte = emitirPoeira(0, 0, 2, aleatorio(1));
    expect(forte.length).toBeGreaterThan(fraco.length);
    expect(fraco.some((p) => p.tipo === 'anel')).toBe(true);
  });

  it('todas morrem no fim da vida, sem sobrar laço rodando', () => {
    let lista = [...emitirPoeira(50, 50, 2, aleatorio(3)), ...emitirFaiscas(50, 50, aleatorio(4))];
    for (let i = 0; i < 100 && lista.length; i++) lista = atualizarParticulas(lista, 0.05);
    expect(lista).toEqual([]);
  });

  it('grão quica no tampo e não atravessa a mesa', () => {
    let lista = emitirPoeira(0, 500, 1, aleatorio(7)).filter((p) => p.tipo === 'grao');
    for (let i = 0; i < 12; i++) {
      lista = atualizarParticulas(lista, 0.05);
      for (const p of lista) expect(p.y).toBeLessThanOrEqual(p.chao + 0.001);
    }
  });

  it('opacidade fica entre 0 e 1', () => {
    for (const p of emitirPoeira(0, 0, 1.5, aleatorio(9))) {
      p.idade = p.vida * 0.5;
      const a = opacidadeAtual(p);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
    }
  });
});
