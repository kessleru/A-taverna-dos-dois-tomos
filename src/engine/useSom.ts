import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { CHAVE_MUDO, lerMudo } from './preferenciaSom';
import { FALAS, TODAS_AS_FALAS, escolherFala, type Momento } from './falas';
import type { Tarefa } from './carregamento';

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
// Promessa que resolve quando o Howl termina de baixar (ou falha), para a tela
// de carregamento esperar por ele.
function carregado(som: Howl): Promise<void> {
  if (som.state() === 'loaded') return Promise.resolve();
  return new Promise((resolve, reject) => {
    som.once('load', () => resolve());
    som.once('loaderror', () => reject(new Error('som não carregou')));
  });
}

function caminhoSom(arquivo: string): string {
  return `${import.meta.env.BASE_URL}sfx/${arquivo}`;
}

const VOLUME_EFEITOS = 0.4;
const VOLUME_MUSICA = 0.12;
const VOLUME_AMBIENTE = 0.08;
const VOLUME_FALA = 0.9;
// A música abaixa enquanto o Taverneiro fala, para a voz ficar clara.
const VOLUME_MUSICA_SOB_FALA = 0.04;
// Uma fala interrompida (por outra fala ou pelo mudo) some aos poucos em vez de cortar.
const SAIDA_FALA_MS = 350;

function silenciarAosPoucos(som: Howl) {
  if (!som.playing()) return;
  som.fade(som.volume(), 0, SAIDA_FALA_MS);
  som.once('fade', () => {
    som.stop();
    som.volume(VOLUME_FALA);
  });
}

export function useSom() {
  const [mudo, setMudo] = useState(() => lerMudo(sessionStorage.getItem(CHAVE_MUDO)));
  // O navegador só libera áudio depois do primeiro clique ou tecla.
  const [liberado, setLiberado] = useState(false);
  const sons = useRef<Partial<Record<Efeito, Howl>>>({});
  // Música e lareira: tocam em loop por baixo de tudo.
  const fundo = useRef<Howl[]>([]);
  const falas = useRef<Record<string, Howl>>({});
  const falaAtual = useRef<{ id: string; som: Howl } | null>(null);
  // Até quando a fala interrompida ainda está sumindo (a próxima espera).
  const fimDaSaida = useRef(0);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_MUDO, String(mudo));
  }, [mudo]);

  // Carrega tudo ao abrir: criar o Howl só no primeiro tocar() atrasava cada
  // efeito na primeira vez (download + decodificação na hora).
  useEffect(() => {
    for (const efeito of EFEITOS) {
      sons.current[efeito] = new Howl({ src: [caminhoSom(`${efeito}.ogg`)], volume: VOLUME_EFEITOS });
    }
    for (const id of TODAS_AS_FALAS) {
      falas.current[id] = new Howl({ src: [caminhoSom(`falas/${id}.mp3`)], volume: VOLUME_FALA });
    }
    fundo.current = [
      new Howl({ src: [caminhoSom('musica-fundo.mp3')], volume: VOLUME_MUSICA, loop: true, html5: true }),
      new Howl({ src: [caminhoSom('ambiente-taverna.mp3')], volume: VOLUME_AMBIENTE, loop: true, html5: true }),
    ];
    return () => {
      for (const som of Object.values(sons.current)) som?.unload();
      for (const faixa of fundo.current) faixa.unload();
      for (const fala of Object.values(falas.current)) fala.unload();
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
    if (mudo && falaAtual.current) {
      silenciarAosPoucos(falaAtual.current.som);
      falaAtual.current = null;
      fundo.current[0]?.volume(VOLUME_MUSICA);
    }
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
      if (!evento.defaultPrevented && evento.key.toLowerCase() === 'm') setMudo((m) => !m);
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

  // Uma fala do Taverneiro para o momento (sorteada no grupo, sem repetir a
  // última). Uma fala nova interrompe a anterior.
  const falar = useCallback(
    (momento: Momento) => {
      // Antes do primeiro clique o navegador seguraria a fala e a soltaria
      // depois, por cima da próxima; melhor não falar.
      if (mudo || !liberado) return;
      const id = escolherFala(FALAS[momento], Math.random(), falaAtual.current?.id);
      const som = id ? falas.current[id] : undefined;
      // Arquivo que não carregou: não fala (e não abaixa a música à toa).
      if (!id || !som || som.state() !== 'loaded') return;
      // A mesma fala já está tocando (grupo de uma fala só): deixa terminar.
      if (som.playing()) return;
      const anterior = falaAtual.current?.som;
      falaAtual.current = { id, som };
      const musica = fundo.current[0];
      const devolverMusica = () => {
        if (falaAtual.current?.som === som) musica?.fade(VOLUME_MUSICA_SOB_FALA, VOLUME_MUSICA, 600);
      };
      musica?.volume(VOLUME_MUSICA_SOB_FALA);
      som.once('end', devolverMusica);
      som.once('playerror', devolverMusica);
      som.volume(VOLUME_FALA);
      if (anterior && !anterior.playing()) anterior.stop(); // estava na fila: descarta
      if (anterior?.playing()) {
        silenciarAosPoucos(anterior);
        fimDaSaida.current = Date.now() + SAIDA_FALA_MS;
      }
      // Espera a fala interrompida terminar de sumir, mesmo que ela tenha
      // sido interrompida por uma fala anterior que nem chegou a tocar.
      const espera = Math.max(0, fimDaSaida.current - Date.now());
      if (espera > 0) {
        window.setTimeout(() => {
          if (falaAtual.current?.som === som) som.play();
        }, espera);
      } else {
        som.play();
      }
    },
    [mudo, liberado],
  );

  // Uma tarefa por arquivo de som, para a tela de carregamento. Lê os Howls na
  // hora da chamada: o App chama depois que o efeito de pré-carga já rodou.
  const tarefasDeCarga = useCallback(
    (): Tarefa[] =>
      [...Object.values(sons.current), ...Object.values(falas.current), ...fundo.current].flatMap((som) =>
        som ? [() => carregado(som)] : [],
      ),
    [],
  );

  return { mudo, alternarMudo: () => setMudo((m) => !m), tocar, falar, tarefasDeCarga };
}
