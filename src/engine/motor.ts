// src/engine/motor.ts
// Funções puras do motor da rodada. Sem React — testadas com Vitest.
// Ordem por etapa (02-jogabilidade.md §2): situacao → votacao → dado →
// consequencia → [bricolagem na fundação] → cronica → evento (etapas 1–3) → [forja antes da etapa 4] →
// próxima etapa. O dado vem antes da consequência porque decide quanto a
// carta rende.

import type { Indicadores } from '../data/conteudo';
import {
  type Bloco,
  type Escolha,
  etapas,
  eventos,
  dadoDoDestino,
  regras,
  combinarDesbloqueado,
  revelacaoBricolagem,
  type Logica,
} from '../data/rodada';

export type Passo = 'situacao' | 'votacao' | 'dado' | 'consequencia' | 'bricolagem' | 'cronica' | 'evento' | 'forja';
export type Faixa = 'critico' | 'sucesso' | 'falha';

export interface ResultadoDado {
  d20: number;
  bonus: number;
  total: number;
  faixa: Faixa;
}

// Blocos do Canvas que cada carta jogada tocou, na lógica da carta (a
// Bricolagem repinta os blocos do Adaptar da fundação quando é descoberta).
export type Canvas = Partial<Record<Bloco, Logica[]>>;

export interface EstadoRodada {
  etapa: number; // 0–3
  passo: Passo;
  ind: Indicadores;
  escolhas: Escolha[];
  canvas: Canvas;
  ultimoDado?: ResultadoDado;
  // Faixa escolhida pelo apresentador para o próximo dado (Shift+1..3).
  faixaForcada?: Faixa;
  ultimoEvento?: { titulo: string; texto: string; efeito: Partial<Indicadores> };
  // A turma jogou Adaptar na fundação e descobriu a carta Bricolagem.
  bricolagem: boolean;
  terminou: boolean;
}

const CHAVES_INDICADORES: (keyof Indicadores)[] = ['caixa', 'clientes', 'moral'];

export function estadoInicial(): EstadoRodada {
  return {
    etapa: 0,
    passo: 'situacao',
    ind: { ...regras.inicial },
    escolhas: [],
    canvas: {},
    bricolagem: false,
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

function opcaoDe(etapa: number, escolha: Escolha) {
  const etapaAtual = etapas[etapa];
  const opcao = escolha === 'combinar' ? etapaAtual.combinar : etapaAtual[escolha];
  if (!opcao) throw new Error(`A etapa "${etapaAtual.id}" não tem a opção "${escolha}".`);
  return opcao;
}

// Soma das setas da Leitura do Mapa para a carta, mais a "Experiência" da Combinar.
export function bonusDoContexto(etapa: number, escolha: Escolha): number {
  const { micro, meso, macro } = etapas[etapa].leitura;
  const setas = [micro, meso, macro].reduce((soma, nivel) => soma + (nivel.setas[escolha] ?? 0), 0);
  return setas + (escolha === 'combinar' ? dadoDoDestino.bonusCombinar : 0);
}

export function faixaDoDado(d20: number, total: number): Faixa {
  if (d20 === 20 || total >= dadoDoDestino.critico) return 'critico';
  return total >= dadoDoDestino.cd ? 'sucesso' : 'falha';
}

// Crítico aumenta os ganhos, falha corta os ganhos; perdas ficam como estão.
export function ajustarEfeito(efeito: Partial<Indicadores>, faixa: Faixa): Partial<Indicadores> {
  const multiplicador = dadoDoDestino.faixas[faixa].multiplicador;
  const ajustado: Partial<Indicadores> = {};
  for (const chave of CHAVES_INDICADORES) {
    const delta = efeito[chave];
    if (delta === undefined) continue;
    ajustado[chave] = delta > 0 ? Math.round(delta * multiplicador) : delta;
  }
  return ajustado;
}

export function escolher(estado: EstadoRodada, escolha: Escolha): EstadoRodada {
  if (escolha === 'combinar' && !combinarDesbloqueado(estado.escolhas)) {
    throw new Error('A carta Combinar ainda não foi desbloqueada.');
  }
  opcaoDe(estado.etapa, escolha); // valida
  const escolhas = [...estado.escolhas];
  escolhas[estado.etapa] = escolha;
  return { ...estado, escolhas, passo: 'dado' };
}

export function forcarFaixa(estado: EstadoRodada, faixa: Faixa): EstadoRodada {
  return { ...estado, faixaForcada: faixa };
}

// d20 que produz a faixa pedida com este bônus (para o ensaio e emergências).
function d20ParaFaixa(faixa: Faixa, bonus: number): number {
  if (faixa === 'critico') return 20;
  if (faixa === 'falha') return 1;
  const minimo = dadoDoDestino.cd - bonus;
  const maximo = dadoDoDestino.critico - 1 - bonus;
  return Math.min(19, Math.max(1, Math.min(maximo, Math.max(minimo, 10))));
}

export function rolarDado(estado: EstadoRodada, rng: () => number = Math.random): EstadoRodada {
  const escolha = estado.escolhas[estado.etapa];
  if (!escolha) throw new Error('Rolar o dado exige uma carta escolhida nesta etapa.');
  const bonus = bonusDoContexto(estado.etapa, escolha);
  const d20 = estado.faixaForcada ? d20ParaFaixa(estado.faixaForcada, bonus) : Math.floor(rng() * 20) + 1;
  const total = d20 + bonus;
  const faixa = estado.faixaForcada ?? faixaDoDado(d20, total);
  const opcao = opcaoDe(estado.etapa, escolha);

  const canvas: Canvas = { ...estado.canvas };
  for (const bloco of opcao.blocos) canvas[bloco] = [...(canvas[bloco] ?? []), escolha];

  return {
    ...estado,
    ind: aplicarEfeito(estado.ind, ajustarEfeito(opcao.efeito, faixa)),
    ultimoDado: { d20, bonus, total, faixa },
    faixaForcada: undefined,
    canvas,
    passo: 'consequencia',
  };
}

function avancarEtapa(estado: EstadoRodada): EstadoRodada {
  const proximaEtapa = estado.etapa + 1;
  if (proximaEtapa >= etapas.length) {
    return { ...estado, terminou: true };
  }
  if (proximaEtapa === 3) {
    return { ...estado, etapa: proximaEtapa, passo: 'forja', ultimoDado: undefined };
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

// Revelação da Bricolagem na fundação. Jogando Adaptar, a carta é descoberta:
// devolve o caixa e troca o Adaptar pela Bricolagem nos blocos dessa jogada.
function revelarBricolagem(estado: EstadoRodada): EstadoRodada {
  if (estado.escolhas[estado.etapa] !== revelacaoBricolagem.gatilho) return { ...estado, passo: 'bricolagem' };
  const canvas: Canvas = { ...estado.canvas };
  for (const bloco of opcaoDe(estado.etapa, revelacaoBricolagem.gatilho).blocos) {
    canvas[bloco] = (canvas[bloco] ?? []).map((l) => (l === revelacaoBricolagem.gatilho ? 'bricolagem' : l));
  }
  return {
    ...estado,
    passo: 'bricolagem',
    bricolagem: true,
    canvas,
    ind: aplicarEfeito(estado.ind, revelacaoBricolagem.bonus),
  };
}

export function proximoPasso(estado: EstadoRodada): EstadoRodada {
  switch (estado.passo) {
    case 'situacao':
      return { ...estado, passo: 'votacao' };
    case 'consequencia':
      return estado.etapa === revelacaoBricolagem.etapa ? revelarBricolagem(estado) : { ...estado, passo: 'cronica' };
    case 'bricolagem':
      return { ...estado, passo: 'cronica' };
    case 'cronica': {
      const temEvento = eventos.some((e) => e.depoisDaEtapa === estado.etapa);
      return temEvento ? { ...estado, passo: 'evento' } : avancarEtapa(estado);
    }
    case 'evento':
      return resolverEvento(estado);
    case 'forja':
      return { ...estado, passo: 'situacao', ultimoDado: undefined };
    case 'votacao':
    case 'dado':
      throw new Error(`O passo "${estado.passo}" precisa de escolher()/rolarDado(), não de proximoPasso().`);
  }
}

export function pontuacao(ind: Indicadores): { total: number; estrelas: number; rank: string } {
  const total = ind.caixa + ind.clientes + ind.moral;
  const faixa = regras.estrelas.find((r) => total >= r.minimo) ?? regras.estrelas[regras.estrelas.length - 1];
  return { total, estrelas: faixa.estrelas, rank: faixa.nome };
}
