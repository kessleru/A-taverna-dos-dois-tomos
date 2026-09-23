import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

// Efeitos do Kenney Audio (CC0) e música de fundo em public/sfx/ (origem de
// cada arquivo em public/sfx/CREDITOS.md). Se algum arquivo faltar, o Howler
// apenas falha ao carregar aquele som e ignora o tocar().
export type Efeito =
  | 'clique'
  | 'virar-carta'
  | 'escolha'
  | 'ganho'
  | 'perda'
  | 'dado'
  | 'evento'
  | 'cadeado'
  | 'fanfarra'
  // Sons do redesign (docs/redesign/06-animacoes.md), prontos para uso.
  | 'carta-deslizar'
  | 'carta-bater'
  | 'embaralhar'
  | 'tic'
  | 'ping'
  | 'pagina'
  | 'moedas'
  | 'correntes'
  | 'selo';

// Prefixa com o base path do build, como em artes.ts: em GitHub Pages o site
// fica sob /empreendedorismo/ e um caminho absoluto /sfx/ daria 404.
function caminhoSom(arquivo: string): string {
  return `${import.meta.env.BASE_URL}sfx/${arquivo}`;
}

const VOLUME_EFEITOS = 0.4;
const VOLUME_MUSICA = 0.12;
const CHAVE_SESSAO = 'sa-mudo';

export function useSom() {
  const [mudo, setMudo] = useState(() => sessionStorage.getItem(CHAVE_SESSAO) !== 'false');
  const sons = useRef<Partial<Record<Efeito, Howl>>>({});
  const musica = useRef<Howl | null>(null);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_SESSAO, String(mudo));
  }, [mudo]);

  // Música só é criada na primeira vez que o som é ligado (arquivo de ~2,2 MB),
  // e o mudo pausa em vez de parar para retomar do mesmo ponto.
  useEffect(() => {
    if (mudo) {
      musica.current?.pause();
      return;
    }
    if (!musica.current) {
      musica.current = new Howl({ src: [caminhoSom('musica-fundo.mp3')], volume: VOLUME_MUSICA, loop: true, html5: true });
    }
    if (!musica.current.playing()) musica.current.play();
  }, [mudo]);

  useEffect(() => () => void musica.current?.unload(), []);

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
        som = new Howl({ src: [caminhoSom(`${efeito}.ogg`)], volume: VOLUME_EFEITOS });
        sons.current[efeito] = som;
      }
      som.play();
    },
    [mudo],
  );

  return { mudo, alternarMudo: () => setMudo((m) => !m), tocar };
}
