import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

// Os arquivos de public/sfx/ não vieram no pacote do projeto (ver
// public/sfx/CREDITOS.md). O hook funciona normalmente sem eles: o Howler
// apenas falha ao carregar aquele efeito específico e ignora o tocar().
export type Efeito =
  | 'clique'
  | 'virar-carta'
  | 'escolha'
  | 'ganho'
  | 'perda'
  | 'dado'
  | 'evento'
  | 'cadeado'
  | 'fanfarra';

const ARQUIVOS: Record<Efeito, string> = {
  clique: '/sfx/clique.ogg',
  'virar-carta': '/sfx/virar-carta.ogg',
  escolha: '/sfx/escolha.ogg',
  ganho: '/sfx/ganho.ogg',
  perda: '/sfx/perda.ogg',
  dado: '/sfx/dado.ogg',
  evento: '/sfx/evento.ogg',
  cadeado: '/sfx/cadeado.ogg',
  fanfarra: '/sfx/fanfarra.ogg',
};

const VOLUME_EFEITOS = 0.4;
const CHAVE_SESSAO = 'sa-mudo';

export function useSom() {
  const [mudo, setMudo] = useState(() => sessionStorage.getItem(CHAVE_SESSAO) !== 'false');
  const sons = useRef<Partial<Record<Efeito, Howl>>>({});

  useEffect(() => {
    sessionStorage.setItem(CHAVE_SESSAO, String(mudo));
  }, [mudo]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key.toLowerCase() === 'm') setMudo((m) => !m);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  const tocar = useCallback(
    (efeito: Efeito) => {
      if (mudo) return;
      let som = sons.current[efeito];
      if (!som) {
        som = new Howl({ src: [ARQUIVOS[efeito]], volume: VOLUME_EFEITOS });
        sons.current[efeito] = som;
      }
      som.play();
    },
    [mudo],
  );

  return { mudo, alternarMudo: () => setMudo((m) => !m), tocar };
}
