// src/engine/motor.ts
// Funções puras do motor da rodada. Sem React — testadas com Vitest.
// Ordem por etapa: situacao → votacao → consequencia → dado → artigos →
// evento (etapas 0–2) → [desbloqueio antes da etapa 3] → próxima etapa.

import type { Indicadores } from '../data/conteudo';
import {
  type Escolha,
  etapas,
  eventos,
  dadoDaIncerteza,
  regras,
  combinarDesbloqueado,
} from '../data/rodada';

export type Passo = 'situacao' | 'votacao' | 'consequencia' | 'dado' | 'artigos' | 'evento' | 'desbloqueio';

export interface EstadoRodada {
  etapa: number; // 0–3
  passo: Passo;
  ind: Indicadores;
  escolhas: Escolha[];
  ultimoDado?: number;
  ultimoEvento?: { titulo: string; texto: string; efeito: Partial<Indicadores> };
  terminou: boolean;
}

const CHAVES_INDICADORES: (keyof Indicadores)[] = ['caixa', 'clientes', 'moral'];

export function estadoInicial(): EstadoRodada {
  return {
    etapa: 0,
    passo: 'situacao',
    ind: { ...regras.inicial },
    escolhas: [],
    terminou: false,
  };
}

export function aplicarEfeito(ind: Indicadores, efeito: Partial<Indicadores>): Indicadores {
  const resultado = { ...ind };
  for (const chave of CHAVES_INDICADORES) {
    const delta = efeito[chave] ?? 0;
    resultado[chave] = Math.min(regras.maximo, Math.max(regras.minimo, resultado[chave] + delta));
  }
  return resultado;
}

export function escolher(estado: EstadoRodada, escolha: Escolha): EstadoRodada {
  if (escolha === 'combinar' && !combinarDesbloqueado(estado.escolhas)) {
    throw new Error('A carta Combinar ainda não foi desbloqueada.');
  }
  const etapaAtual = etapas[estado.etapa];
  const opcao = escolha === 'combinar' ? etapaAtual.combinar : etapaAtual[escolha];
  if (!opcao) {
    throw new Error(`A etapa "${etapaAtual.id}" não tem a opção "${escolha}".`);
  }
  const escolhas = [...estado.escolhas];
  escolhas[estado.etapa] = escolha;
  return {
    ...estado,
    ind: aplicarEfeito(estado.ind, opcao.efeito),
    escolhas,
    passo: 'consequencia',
  };
}

export function rolarDado(estado: EstadoRodada, rng: () => number = Math.random): EstadoRodada {
  const face = Math.floor(rng() * 6) + 1;
  const resultado = dadoDaIncerteza.faces[face];
  return {
    ...estado,
    ind: aplicarEfeito(estado.ind, resultado.efeito),
    ultimoDado: face,
    passo: 'artigos',
  };
}

function avancarEtapa(estado: EstadoRodada): EstadoRodada {
  const proximaEtapa = estado.etapa + 1;
  if (proximaEtapa >= etapas.length) {
    return { ...estado, terminou: true };
  }
  if (proximaEtapa === 3) {
    return { ...estado, etapa: proximaEtapa, passo: 'desbloqueio', ultimoDado: undefined };
  }
  return { ...estado, etapa: proximaEtapa, passo: 'situacao', ultimoDado: undefined };
}

export function resolverEvento(estado: EstadoRodada): EstadoRodada {
  const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa);
  if (!evento) return avancarEtapa(estado);

  const condicaoVerdadeira = evento.condicao(estado.escolhas, estado.ind);
  const desfecho = condicaoVerdadeira ? evento.seSim : evento.seNao;
  const novoEstado: EstadoRodada = {
    ...estado,
    ind: aplicarEfeito(estado.ind, desfecho.efeito),
    ultimoEvento: { titulo: desfecho.titulo, texto: desfecho.texto, efeito: desfecho.efeito },
  };
  return avancarEtapa(novoEstado);
}

export function proximoPasso(estado: EstadoRodada): EstadoRodada {
  switch (estado.passo) {
    case 'situacao':
      return { ...estado, passo: 'votacao' };
    case 'consequencia':
      return { ...estado, passo: 'dado' };
    case 'artigos': {
      const temEvento = eventos.some((e) => e.depoisDaEtapa === estado.etapa);
      return temEvento ? { ...estado, passo: 'evento' } : avancarEtapa(estado);
    }
    case 'evento':
      return resolverEvento(estado);
    case 'desbloqueio':
      return { ...estado, passo: 'situacao', ultimoDado: undefined };
    case 'votacao':
    case 'dado':
      throw new Error(`O passo "${estado.passo}" precisa de escolher()/rolarDado(), não de proximoPasso().`);
  }
}

export function pontuacao(ind: Indicadores): { total: number; estrelas: number } {
  const total = ind.caixa + ind.clientes + ind.moral;
  const faixa = regras.estrelas.find((r) => total >= r.minimo) ?? regras.estrelas[regras.estrelas.length - 1];
  return { total, estrelas: faixa.estrelas };
}
