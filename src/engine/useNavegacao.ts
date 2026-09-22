import { useCallback, useEffect, useState } from 'react';
import { ordemFases, type Fase } from '../types';

const CHAVE_SESSAO = 'sa-fase-index';

function lerFaseInicial(): number {
  const salvo = sessionStorage.getItem(CHAVE_SESSAO);
  const indice = salvo ? Number(salvo) : 0;
  return Number.isFinite(indice) && indice >= 0 && indice < ordemFases.length ? indice : 0;
}

export function useNavegacao() {
  const [faseIndex, setFaseIndex] = useState(lerFaseInicial);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_SESSAO, String(faseIndex));
  }, [faseIndex]);

  const avancar = useCallback(() => {
    setFaseIndex((i) => Math.min(i + 1, ordemFases.length - 1));
  }, []);

  const voltar = useCallback(() => {
    setFaseIndex((i) => Math.max(i - 1, 0));
  }, []);

  const irPara = useCallback((fase: Fase) => {
    const indice = ordemFases.indexOf(fase);
    if (indice >= 0) setFaseIndex(indice);
  }, []);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'ArrowRight' || evento.key === ' ' || evento.key === 'PageDown') {
        evento.preventDefault();
        avancar();
      } else if (evento.key === 'ArrowLeft' || evento.key === 'PageUp') {
        evento.preventDefault();
        voltar();
      } else if (evento.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [avancar, voltar]);

  return {
    fase: ordemFases[faseIndex],
    faseIndex,
    ultimaFase: faseIndex === ordemFases.length - 1,
    primeiraFase: faseIndex === 0,
    avancar,
    voltar,
    irPara,
  };
}
