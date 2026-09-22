import { useReducer } from 'react';
import { estadoInicial, escolher, proximoPasso, rolarDado, type EstadoRodada } from './motor';
import type { Escolha } from '../data/rodada';

type Acao = { tipo: 'AVANCAR' } | { tipo: 'ESCOLHER'; escolha: Escolha } | { tipo: 'ROLAR_DADO' } | { tipo: 'REINICIAR' };

function reducer(estado: EstadoRodada, acao: Acao): EstadoRodada {
  switch (acao.tipo) {
    case 'AVANCAR':
      return proximoPasso(estado);
    case 'ESCOLHER':
      return escolher(estado, acao.escolha);
    case 'ROLAR_DADO':
      return rolarDado(estado);
    case 'REINICIAR':
      return estadoInicial();
  }
}

export function useRodada() {
  const [estado, despachar] = useReducer(reducer, undefined, estadoInicial);

  return {
    estado,
    avancar: () => despachar({ tipo: 'AVANCAR' }),
    escolher: (escolha: Escolha) => despachar({ tipo: 'ESCOLHER', escolha }),
    rolarDado: () => despachar({ tipo: 'ROLAR_DADO' }),
    reiniciar: () => despachar({ tipo: 'REINICIAR' }),
  };
}
