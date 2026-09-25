import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Taverna } from './components/ui/Taverna';
import { Palco } from './components/ui/Palco';
import { GrimorioProvider, useGrimorio } from './components/ui/NotificacoesGrimorio';
import { TransicaoPagina } from './components/ui/TransicaoPagina';
import { SomContexto } from './engine/SomContexto';
import { pontuacao } from './engine/motor';
import { AmpliacaoProvider } from './components/cartas/Ampliacao';
import { TelaCarregamento } from './components/ui/TelaCarregamento';
import { Tremor } from './components/ui/Tremor';
import { PoeiraClique } from './components/ui/PoeiraClique';
import { Ajuda } from './components/ui/Ajuda';
import { Estufa } from './components/ui/Estufa';
import { aquecerConfete } from './components/ui/confete';
import { carregarTudo, type Tarefa } from './engine/carregamento';
import { IMAGENS } from './data/assets';
import { Hud } from './components/hud/Hud';
import { useNavegacao } from './engine/useNavegacao';
import { useRodada } from './engine/useRodada';
import { useSom } from './engine/useSom';
import { F0Abertura } from './fases/F0Abertura';
import { F1Briefing } from './fases/F1Briefing';
import { F2Rodada } from './fases/F2Rodada';
import { F3Resultado } from './fases/F3Resultado';
import { F4Artigos } from './fases/F4Artigos';
import { F5Fusao } from './fases/F5Fusao';
// Rota de revisão (#vitrine): só baixa quem abrir.
const Vitrine = lazy(() => import('./fases/Vitrine').then((m) => ({ default: m.Vitrine })));

// Avisa no Grimório quando o som liga ou desliga (tecla M ou botão do HUD).
function AvisoDeSom({ mudo }: { mudo: boolean }) {
  const { notificar } = useGrimorio();
  const primeiro = useRef(true);
  useEffect(() => {
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    notificar(mudo ? 'Som desligado.' : 'Som ligado.');
  }, [mudo, notificar]);
  return null;
}

// Fontes usadas no jogo, nos pesos importados em global.css.
const FONTES = ['700 64px Cinzel', '600 36px Cinzel', '500 36px Alegreya', '700 36px Alegreya', 'italic 500 36px Alegreya'];

// As imagens decodificadas ficam guardadas aqui pelo jogo inteiro: sem uma
// referência, o navegador pode descartar a versão decodificada e decodificar
// de novo na hora em que a carta aparece (o engasgo da primeira vez).
const imagensProntas: HTMLImageElement[] = [];

function carregarImagem(url: string): Promise<void> {
  const imagem = new Image();
  imagem.decoding = 'async';
  imagem.src = url;
  return imagem.decode().then(() => {
    imagensProntas.push(imagem);
  });
}

export default function App() {
  const { fase, avancar, voltar, primeiraFase, ultimaFase } = useNavegacao();
  const rodada = useRodada();
  const som = useSom();
  const faseProps = { avancar, voltar, primeiraFase, ultimaFase };

  // O jogo só aparece depois de imagens, fontes e sons carregados e de tudo
  // passar uma vez pela estufa (components/ui/Estufa.tsx). A tela de
  // carregamento pode demorar: o que pesa acontece nela, não na partida.
  const [etapaCarga, setEtapaCarga] = useState<'arquivos' | 'aquecendo' | 'pronto'>('arquivos');
  const carregado = etapaCarga === 'pronto';
  const [progresso, setProgresso] = useState(0);
  const tarefasDeSom = som.tarefasDeCarga;
  useEffect(() => {
    let ativo = true;
    const tarefas: Tarefa[] = [
      ...IMAGENS.map((url) => () => carregarImagem(url)),
      ...FONTES.map((fonte) => () => document.fonts.load(fonte)),
      ...tarefasDeSom(),
    ];
    carregarTudo(tarefas, (feitos, total) => {
      if (ativo) setProgresso(total ? feitos / total : 1);
    }).then(() => {
      if (ativo) setEtapaCarga('aquecendo');
    });
    return () => {
      ativo = false;
    };
  }, [tarefasDeSom]);

  // Falas de entrada de fase que não dependem do que acontece dentro dela.
  const falarRef = useRef(som.falar);
  falarRef.current = som.falar;
  const rodadaRef = useRef(rodada);
  rodadaRef.current = rodada;
  const faseAnterior = useRef(fase);
  useEffect(() => {
    const anterior = faseAnterior.current;
    faseAnterior.current = fase;
    if (anterior === fase) return;
    // Só ao chegar vindo da abertura; voltar da rodada não repete a fala.
    if (fase === 'briefing' && anterior === 'abertura') {
      const id = window.setTimeout(() => falarRef.current('historia'), 2600);
      return () => window.clearTimeout(id);
    }
    if (fase === 'resultado') {
      const { estrelas } = pontuacao(rodadaRef.current.estado.ind);
      const momento = estrelas === 3 ? 'rank-grao-mestre' : estrelas === 2 ? 'rank-mestre' : 'rank-aprendiz';
      const id = window.setTimeout(() => falarRef.current(momento), 1800);
      return () => window.clearTimeout(id);
    }
  }, [fase]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (!evento.defaultPrevented && evento.shiftKey && evento.key.toLowerCase() === 'r') rodada.reiniciar();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [rodada]);

  if (window.location.hash === '#vitrine') {
    return (
      <Suspense fallback={null}>
        <Vitrine />
      </Suspense>
    );
  }

  return (
    <Palco>
      {etapaCarga === 'aquecendo' && (
        <Estufa
          aoAquecer={() => {
            aquecerConfete();
            setEtapaCarga('pronto');
          }}
        />
      )}
      <AnimatePresence>{!carregado && <TelaCarregamento key="carregando" progresso={progresso} aquecendo={etapaCarga === 'aquecendo'} />}</AnimatePresence>
      {carregado && (
        <SomContexto.Provider value={som}>
          <GrimorioProvider aoNotificar={() => som.tocar('ping')}>
            <AvisoDeSom mudo={som.mudo} />
            <AmpliacaoProvider>
              <Tremor>
                <Taverna />
                {fase !== 'abertura' && <Hud fase={fase} mudo={som.mudo} alternarMudo={som.alternarMudo} />}
                <TransicaoPagina chave={fase} fundo={<Taverna />} aoVirar={() => som.tocar('pagina')}>
                  <main className={fase === 'abertura' ? 'relative h-full' : 'relative h-full pt-14'}>
                    {fase === 'abertura' && <F0Abertura {...faseProps} som={som} />}
                    {fase === 'briefing' && <F1Briefing {...faseProps} som={som} />}
                    {fase === 'rodada' && <F2Rodada {...faseProps} rodada={rodada} som={som} />}
                    {fase === 'resultado' && <F3Resultado {...faseProps} estadoRodada={rodada.estado} />}
                    {fase === 'artigos' && <F4Artigos {...faseProps} som={som} />}
                    {fase === 'fusao' && <F5Fusao {...faseProps} som={som} />}
                  </main>
                </TransicaoPagina>
                <PoeiraClique />
              </Tremor>
            </AmpliacaoProvider>
            <Ajuda />
          </GrimorioProvider>
        </SomContexto.Provider>
      )}
    </Palco>
  );
}
