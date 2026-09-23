import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { CHAVE_MUDO, lerMudo } from './preferenciaSom';

// Efeitos do Kenney Audio (CC0) e música de fundo em public/sfx/ (origem de
// cada arquivo em public/sfx/CREDITOS.md). Se algum arquivo faltar, o Howler
// apenas falha ao carregar aquele som e ignora o tocar().
const EFEITOS = [
  'clique',
  'virar-carta',
  'escolha',
  'ganho',
  'perda',
  'dado',
  'evento',
  'cadeado',
  'fanfarra',
  // Sons do redesign (docs/redesign/06-animacoes.md), prontos para uso.
  'carta-deslizar',
  'carta-bater',
  'embaralhar',
  'tic',
  'ping',
  'pagina',
  'moedas',
  'correntes',
  'selo',
  // Gerados pela equipe (docs/redesign/08-assets.md §6).
  'tambor',
  'chama',
  'correntes-quebrando',
  'publico-comemora',
  'publico-lamenta',
] as const;

export type Efeito = (typeof EFEITOS)[number];

// Prefixa com o base path do build, como em artes.ts: em GitHub Pages o site
// fica sob /empreendedorismo/ e um caminho absoluto /sfx/ daria 404.
function caminhoSom(arquivo: string): string {
  return `${import.meta.env.BASE_URL}sfx/${arquivo}`;
}

const VOLUME_EFEITOS = 0.4;
const VOLUME_MUSICA = 0.12;
const VOLUME_AMBIENTE = 0.08;

export function useSom() {
  const [mudo, setMudo] = useState(() => lerMudo(sessionStorage.getItem(CHAVE_MUDO)));
  // O navegador só libera áudio depois do primeiro clique ou tecla.
  const [liberado, setLiberado] = useState(false);
  const sons = useRef<Partial<Record<Efeito, Howl>>>({});
  // Música e lareira: tocam em loop por baixo de tudo.
  const fundo = useRef<Howl[]>([]);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_MUDO, String(mudo));
  }, [mudo]);

  // Carrega tudo ao abrir: criar o Howl só no primeiro tocar() atrasava cada
  // efeito na primeira vez (download + decodificação na hora).
  useEffect(() => {
    for (const efeito of EFEITOS) {
      sons.current[efeito] = new Howl({ src: [caminhoSom(`${efeito}.ogg`)], volume: VOLUME_EFEITOS });
    }
    fundo.current = [
      new Howl({ src: [caminhoSom('musica-fundo.mp3')], volume: VOLUME_MUSICA, loop: true, html5: true }),
      new Howl({ src: [caminhoSom('ambiente-taverna.mp3')], volume: VOLUME_AMBIENTE, loop: true, html5: true }),
    ];
    return () => {
      for (const som of Object.values(sons.current)) som?.unload();
      for (const faixa of fundo.current) faixa.unload();
    };
  }, []);

  useEffect(() => {
    function liberar() {
      setLiberado(true);
    }
    // click (e não pointerdown): é no click que o Howler destrava o áudio.
    window.addEventListener('click', liberar, { once: true });
    window.addEventListener('keydown', liberar, { once: true });
    return () => {
      window.removeEventListener('click', liberar);
      window.removeEventListener('keydown', liberar);
    };
  }, []);

  // O mudo pausa em vez de parar, para música e lareira retomarem do mesmo ponto.
  useEffect(() => {
    for (const faixa of fundo.current) {
      if (mudo) {
        faixa.pause();
        continue;
      }
      if (!liberado || faixa.playing()) continue;
      // Se o navegador ainda recusar, tenta de novo quando o Howler destravar.
      faixa.once('playerror', () => faixa.once('unlock', () => faixa.play()));
      faixa.play();
    }
  }, [mudo, liberado]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key.toLowerCase() === 'm') setMudo((m) => !m);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  const tocar = useCallback(
    (efeito: Efeito) => {
      if (!mudo) sons.current[efeito]?.play();
    },
    [mudo],
  );

  return { mudo, alternarMudo: () => setMudo((m) => !m), tocar };
}
