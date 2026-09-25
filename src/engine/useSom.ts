import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import { CHAVE_MUDO, lerMudo } from './preferenciaSom';
import { FALAS, TODAS_AS_FALAS, escolherFala, type Momento } from './falas';
import type { Tarefa } from './carregamento';
import { Murmurio } from './murmurio';
import { parametrosBatida, tocarBatida } from './batida';

// Efeitos do Kenney Audio (CC0) e música de fundo em public/sfx/ (origem de
// cada arquivo em public/sfx/CREDITOS.md). Se algum arquivo faltar, o Howler
// apenas falha ao carregar aquele som e ignora o tocar().
export const EFEITOS = [
  'clique',
  'virar-carta',
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
  // Kenney, para os momentos que estavam mudos (resultado, livro, estandarte).
  'metal',
  'estandarte',
  'vitoria',
  'livro-abrir',
] as const;

export type Efeito = (typeof EFEITOS)[number];

// Efeitos que se repetem muito (cliques, cartas, páginas): cada vez tocam num
// tom um pouco diferente, para não soarem como a mesma gravação em série.
const VARIAM_TOM: ReadonlySet<Efeito> = new Set([
  'clique',
  'tic',
  'ping',
  'virar-carta',
  'carta-deslizar',
  'carta-bater',
  'pagina',
  'moedas',
  'dado',
  'selo',
  'metal',
]);
const VARIACAO_TOM = 0.06;

export interface OpcoesEfeito {
  // Fração do volume normal do efeito (o passar do cursor numa carta é baixinho).
  volume?: number;
}

// Promessa que resolve quando o Howl termina de baixar (ou falha), para a tela
// de carregamento esperar por ele.
function carregado(som: Howl): Promise<void> {
  if (som.state() === 'loaded') return Promise.resolve();
  return new Promise((resolve, reject) => {
    som.once('load', () => resolve());
    som.once('loaderror', () => reject(new Error('som não carregou')));
  });
}

// Caminho do som respeitando o base do build, como em artes.ts.
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

function silenciarAosPoucos(som: Howl, ms = SAIDA_FALA_MS) {
  if (!som.playing()) return;
  som.fade(som.volume(), 0, ms);
  som.once('fade', () => {
    som.stop();
    som.volume(VOLUME_FALA);
  });
}

export function useSom() {
  const [mudo, setMudo] = useState(() => lerMudo(sessionStorage.getItem(CHAVE_MUDO)));
  // O navegador só libera áudio depois do primeiro clique ou tecla.
  const [liberado, setLiberado] = useState(false);
  // As funções devolvidas leem mudo e liberado por ref: assim tocar, falar e
  // companhia têm identidade fixa, e quem as usa em efeitos (Veredito,
  // folhas, rodada) não roda de novo só porque o som foi ligado/desligado.
  const mudoRef = useRef(mudo);
  mudoRef.current = mudo;
  const liberadoRef = useRef(liberado);
  liberadoRef.current = liberado;
  const sons = useRef<Partial<Record<Efeito, Howl>>>({});
  // Música e lareira: tocam em loop por baixo de tudo.
  const fundo = useRef<Howl[]>([]);
  // Murmúrio do público da taverna, por baixo da lareira.
  const murmurio = useRef<Murmurio | null>(null);
  const falas = useRef<Record<string, Howl>>({});
  const falaAtual = useRef<{ id: string; som: Howl } | null>(null);
  // Até quando a fala interrompida ainda está sumindo (a próxima espera).
  const fimDaSaida = useRef(0);
  // Música, lareira e murmúrio só começam a baixar depois do carregamento
  // (prepararFundo): são 4,5 MB que disputavam a banda com as cartas e as
  // falas, e tocam em streaming, então não precisam segurar a tela de carga.
  const [fundoPronto, setFundoPronto] = useState(false);

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
    return () => {
      murmurio.current?.descarregar();
      for (const som of Object.values(sons.current)) som?.unload();
      for (const faixa of fundo.current) faixa.unload();
      for (const fala of Object.values(falas.current)) fala.unload();
    };
  }, []);

  const prepararFundo = useCallback(() => {
    if (fundo.current.length > 0) return;
    fundo.current = [
      new Howl({ src: [caminhoSom('musica-fundo.mp3')], volume: VOLUME_MUSICA, loop: true, html5: true }),
      new Howl({ src: [caminhoSom('ambiente-taverna.mp3')], volume: VOLUME_AMBIENTE, loop: true, html5: true }),
    ];
    murmurio.current = new Murmurio([1, 2, 3].map((n) => caminhoSom(`murmurio-${n}.mp3`)));
    setFundoPronto(true);
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
    if (mudo) murmurio.current?.parar();
    else if (liberado) murmurio.current?.iniciar();
  }, [mudo, liberado, fundoPronto]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (!evento.defaultPrevented && evento.key.toLowerCase() === 'm') setMudo((m) => !m);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);

  const tocar = useCallback(
    (efeito: Efeito, opcoes?: OpcoesEfeito) => {
      const som = sons.current[efeito];
      if (mudoRef.current || !som) return;
      const id = som.play();
      if (VARIAM_TOM.has(efeito)) som.rate(1 - VARIACAO_TOM / 2 + Math.random() * VARIACAO_TOM, id);
      som.volume(VOLUME_EFEITOS * (opcoes?.volume ?? 1), id);
    },
    [],
  );

  // Toque na mesa ao clicar no palco (src/engine/batida.ts). Força 1 é um
  // clique comum; cliques seguidos no mesmo lugar chegam perto de 2.
  const batida = useCallback(
    (forca = 1) => {
      const ctx = Howler.ctx;
      if (mudoRef.current || !liberadoRef.current || !ctx || ctx.state !== 'running') return;
      tocarBatida(ctx, Howler.masterGain ?? ctx.destination, parametrosBatida(forca, Math.random));
    },
    [],
  );

  // Cala o Taverneiro (fala some em `ms`) e devolve a música. O tutorial usa
  // ao passar de balão: a fala do passo anterior não fica por cima do próximo.
  const calar = useCallback((ms = SAIDA_FALA_MS) => {
    const atual = falaAtual.current;
    if (!atual) return;
    falaAtual.current = null;
    if (atual.som.playing()) {
      silenciarAosPoucos(atual.som, ms);
      fimDaSaida.current = Date.now() + ms;
    } else {
      // Ainda esperando a anterior sumir: nem começa.
      atual.som.stop();
    }
    const musica = fundo.current[0];
    if (musica && !mudoRef.current) musica.fade(musica.volume(), VOLUME_MUSICA, 600);
  }, []);

  // Uma fala do Taverneiro para o momento (sorteada no grupo, sem repetir a
  // última). Uma fala nova interrompe a anterior.
  const falar = useCallback(
    (momento: Momento) => {
      // Antes do primeiro clique o navegador seguraria a fala e a soltaria
      // depois, por cima da próxima; melhor não falar.
      if (mudoRef.current || !liberadoRef.current) return;
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
    [],
  );

  // Uma tarefa por arquivo de som, para a tela de carregamento. Lê os Howls na
  // hora da chamada: o App chama depois que o efeito de pré-carga já rodou.
  const tarefasDeCarga = useCallback(
    (): Tarefa[] =>
      [...Object.values(sons.current), ...Object.values(falas.current)].flatMap((som) => (som ? [() => carregado(som)] : [])),
    [],
  );

  const alternarMudo = useCallback(() => setMudo((m) => !m), []);

  // Mesmo objeto enquanto o mudo não muda (useMemo): antes era um objeto novo
  // a cada render do App.
  return useMemo(
    () => ({ mudo, alternarMudo, tocar, falar, calar, batida, tarefasDeCarga, prepararFundo }),
    [mudo, alternarMudo, tocar, falar, calar, batida, tarefasDeCarga, prepararFundo],
  );
}
