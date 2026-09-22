import { describe, expect, it } from 'vitest';
import {
  estadoInicial,
  escolher,
  rolarDado,
  proximoPasso,
  resolverEvento,
  pontuacao,
  type EstadoRodada,
} from './motor';
import { calcularPerfil, combinarDesbloqueado, type Escolha } from '../data/rodada';

const dadoNeutro = () => 2 / 6; // face 3 = "Mercado estável", efeito {}

function jogarRodada(escolhas: Escolha[]): EstadoRodada {
  let estado = estadoInicial();
  for (const escolha of escolhas) {
    estado = proximoPasso(estado); // situacao -> votacao
    estado = escolher(estado, escolha); // votacao -> consequencia
    estado = proximoPasso(estado); // consequencia -> dado
    estado = rolarDado(estado, dadoNeutro); // dado -> artigos
    estado = proximoPasso(estado); // artigos -> evento | avança etapa
    if (estado.passo === 'evento') {
      estado = proximoPasso(estado); // resolve o evento -> avança etapa
    }
    if (estado.passo === 'desbloqueio') {
      estado = proximoPasso(estado); // desbloqueio -> situacao
    }
  }
  return estado;
}

describe('motor da rodada', () => {
  it('adaptar, adaptar, planejar, combinar => lendario, 295 pontos, 3 estrelas', () => {
    const escolhas: Escolha[] = ['adaptar', 'adaptar', 'planejar', 'combinar'];
    const estado = jogarRodada(escolhas);
    expect(estado.terminou).toBe(true);
    expect(estado.ind).toEqual({ caixa: 95, clientes: 100, moral: 100 });
    expect(pontuacao(estado.ind)).toEqual({ total: 295, estrelas: 3 });
    expect(calcularPerfil(escolhas)).toBe('lendario');
  });

  it('adaptar x4 => improvisador, 205 pontos, 2 estrelas; Combinar trancado', () => {
    const escolhas: Escolha[] = ['adaptar', 'adaptar', 'adaptar', 'adaptar'];
    const estado = jogarRodada(escolhas);
    expect(estado.terminou).toBe(true);
    expect(estado.ind).toEqual({ caixa: 35, clientes: 100, moral: 70 });
    expect(pontuacao(estado.ind)).toEqual({ total: 205, estrelas: 2 });
    expect(calcularPerfil(escolhas)).toBe('improvisador');
    expect(combinarDesbloqueado(escolhas.slice(0, 3))).toBe(false);
  });

  it('planejar x4 => planejador, 80 pontos, 1 estrela; nenhuma barra abaixo de 5', () => {
    const escolhas: Escolha[] = ['planejar', 'planejar', 'planejar', 'planejar'];
    const estado = jogarRodada(escolhas);
    expect(estado.terminou).toBe(true);
    expect(estado.ind).toEqual({ caixa: 5, clientes: 55, moral: 20 });
    expect(pontuacao(estado.ind)).toEqual({ total: 80, estrelas: 1 });
    expect(calcularPerfil(escolhas)).toBe('planejador');
    expect(estado.ind.caixa).toBeGreaterThanOrEqual(5);
    expect(estado.ind.clientes).toBeGreaterThanOrEqual(5);
    expect(estado.ind.moral).toBeGreaterThanOrEqual(5);
  });

  it('planejar, planejar, adaptar, adaptar => invertido', () => {
    const escolhas: Escolha[] = ['planejar', 'planejar', 'adaptar', 'adaptar'];
    expect(calcularPerfil(escolhas)).toBe('invertido');
  });

  it('escolher combinar sem desbloqueio lança erro', () => {
    const estado = proximoPasso(estadoInicial());
    expect(() => escolher(estado, 'combinar')).toThrowError();
  });

  it('evento da incubadora depende dos indicadores do momento', () => {
    const base: EstadoRodada = {
      etapa: 2,
      passo: 'evento',
      ind: { caixa: 60, clientes: 50, moral: 70 },
      escolhas: ['adaptar', 'adaptar'],
      terminou: false,
    };
    const comSucesso = resolverEvento(base);
    expect(comSucesso.ultimoEvento?.titulo).toBe('🏥 Portas abertas');

    const semCondicoes = resolverEvento({ ...base, ind: { caixa: 10, clientes: 50, moral: 70 } });
    expect(semCondicoes.ultimoEvento?.titulo).toBe('😮‍💨 Não foi dessa vez');
  });
});
