import { useReducer } from 'react';
import { estadoInicial, escolher, forcarFaixa, proximoPasso, rolarDado, type EstadoRodada, type Faixa } from './motor';
import type { Escolha } from '../data/rodada';

type Acao =
  | { tipo: 'AVANCAR' }
  | { tipo: 'ESCOLHER'; escolha: Escolha }
  | { tipo: 'ROLAR_DADO' }
  | { tipo: 'FORCAR_FAIXA'; faixa: Faixa }
  | { tipo: 'REINICIAR' };

function reducer(estado: EstadoRodada, acao: Acao): EstadoRodada {
  switch (acao.tipo) {
    case 'AVANCAR':
      return proximoPasso(estado);
    case 'ESCOLHER':
      return escolher(estado, acao.escolha);
    case 'ROLAR_DADO':
      return rolarDado(estado);
    case 'FORCAR_FAIXA':
      return forcarFaixa(estado, acao.faixa);
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
    forcarFaixa: (faixa: Faixa) => despachar({ tipo: 'FORCAR_FAIXA', faixa }),
    reiniciar: () => despachar({ tipo: 'REINICIAR' }),
  };
}
