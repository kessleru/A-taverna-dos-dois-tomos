import { useCallback, useEffect, useRef, useState } from 'react';
import { GUIA, guiaVisto, marcarGuiaVisto } from '../../data/tutorial';
import { useSomDoJogo } from '../../engine/SomContexto';
import { Tour } from './Tour';

const TECLAS_AVANCAR = ['ArrowRight', 'Enter', ' ', 'PageDown'];
// Quem passa o balão antes de o Taverneiro terminar corta a fala: ela some
// neste tempo e a do próximo balão entra logo em seguida.
const CORTE_FALA_MS = 180;

interface GuiaProps {
  // Passo atual da rodada; as dicas dele abrem na primeira vez que ele aparece.
  passo: string;
  // Só na primeira etapa (a forja acontece uma vez só e sempre tem dica).
  primeiraVez: boolean;
}

// Dono do tour na rodada. Fica montado desde o começo da F2 para que o seu
// ouvinte de teclas seja registrado antes dos da rodada e do dado: com o tour
// aberto, → avança o balão em vez de avançar a rodada ou rolar o dado.
export function Guia({ passo, primeiraVez }: GuiaProps) {
  const [aberto, setAberto] = useState<string | null>(null);
  const [indice, setIndice] = useState(0);
  const som = useSomDoJogo();
  const somRef = useRef(som);
  somRef.current = som;

  useEffect(() => {
    const config = GUIA[passo];
    if (!config || !(primeiraVez || passo === 'forja') || guiaVisto(passo)) return;
    const id = window.setTimeout(() => {
      setIndice(0);
      setAberto(passo);
    }, config.espera);
    return () => window.clearTimeout(id);
  }, [passo, primeiraVez]);

  const terminar = useCallback(() => {
    somRef.current?.calar(CORTE_FALA_MS);
    setAberto((atual) => {
      if (atual) marcarGuiaVisto(atual);
      return null;
    });
  }, []);

  const avancar = useCallback(() => {
    if (!aberto) return;
    if (indice < GUIA[aberto].passos.length - 1) {
      somRef.current?.calar(CORTE_FALA_MS);
      setIndice(indice + 1);
    } else terminar();
  }, [aberto, indice, terminar]);

  const estado = useRef({ aberto, avancar, terminar });
  estado.current = { aberto, avancar, terminar };

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const { aberto: estaAberto, avancar: avancarBalao, terminar: fechar } = estado.current;
      if (!estaAberto || evento.key === 'm' || evento.key === 'M') return;
      evento.preventDefault();
      if (evento.key === 'Escape') fechar();
      else if (TECLAS_AVANCAR.includes(evento.key)) avancarBalao();
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, []);

  // Se a rodada mudou de passo por baixo (clique), a dica antiga some, e a
  // fala dela junto.
  const visivel = !!aberto && aberto === passo;
  const estavaVisivel = useRef(false);
  useEffect(() => {
    if (estavaVisivel.current && !visivel) somRef.current?.calar(CORTE_FALA_MS);
    estavaVisivel.current = visivel;
  }, [visivel]);

  if (!aberto || aberto !== passo) return null;
  return <Tour passos={GUIA[aberto].passos} indice={indice} aoAvancar={avancar} aoTerminar={terminar} />;
}
