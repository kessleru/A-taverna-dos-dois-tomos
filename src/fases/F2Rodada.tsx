import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArtePintada } from '../components/ui/ArtePintada';
import { etapas, eventos, combinarDesbloqueado, type Escolha } from '../data/rodada';
import type { Indicadores } from '../data/conteudo';
import type { useRodada } from '../engine/useRodada';
import type { Faixa, Passo } from '../engine/motor';
import { Orbes } from '../components/hud/Orbes';
import { MapaJornada } from '../components/hud/MapaJornada';
import { Tapecaria } from '../components/hud/Tapecaria';
import { TrilhaPassos } from '../components/hud/TrilhaPassos';
import { CartaDesafio } from '../components/rodada/CartaDesafio';
import { AberturaCapitulo } from '../components/rodada/AberturaCapitulo';
import { PassagemDoTempo } from '../components/rodada/PassagemDoTempo';
import { ateAqui } from '../engine/historia';
import { Votacao } from '../components/rodada/Votacao';
import { DadoDestino } from '../components/rodada/DadoDestino';
import { Consequencia } from '../components/rodada/Consequencia';
import { Cronica } from '../components/rodada/Cronica';
import { Forja } from '../components/rodada/Forja';
import { CartaEvento, VIRA_EM } from '../components/cartas/CartaEvento';
import { RevelacaoBricolagem, VIRADA_BRICOLAGEM_MS } from '../components/rodada/RevelacaoBricolagem';
import { Botao } from '../components/ui/Botao';
import { Guia } from '../components/guia/Guia';
import { useGrimorio } from '../components/ui/NotificacoesGrimorio';
import { TRAVA_PADRAO_MS, travar } from '../engine/trava';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

interface F2RodadaProps extends FaseProps {
  rodada: ReturnType<typeof useRodada>;
  som: ReturnType<typeof useSom>;
}

const TECLAS_AVANCAR = ['ArrowRight', ' ', 'PageDown'];
// Shift+1/2/3 forçam a faixa do próximo dado (ensaio e emergências, 02 §4).
const FAIXA_POR_TECLA: Record<string, Faixa> = { Digit1: 'falha', Digit2: 'sucesso', Digit3: 'critico' };
// Quanto cada passo leva para entrar na mesa (distribuir cartas, virar o
// evento, forjar a Combinar): até lá, cliques e teclas ficam travados.
const TRAVA_PASSO_MS: Record<Passo, number> = {
  // A abertura do capítulo entra antes e o desafio cai na mesa em seguida.
  situacao: 1500,
  votacao: 1800,
  dado: 1000,
  consequencia: 700,
  bricolagem: 1200,
  cronica: 1300,
  evento: 1200,
  forja: 1800,
};
const TRAVA_FORJA_DESBLOQUEADA_MS = 2600;
// A Adaptar vira Bricolagem e o pergaminho entra depois.
const TRAVA_BRICOLAGEM_DESCOBERTA_MS = 2400;
// Depois que o dado para: números e orbes assentando.
const TRAVA_REVELACAO_MS = 900;
const TRAVA_FIM_MS = 1200;

const NOMES_INDICADOR: Record<keyof Indicadores, string> = { caixa: 'Caixa', clientes: 'Clientes', moral: 'Moral' };

function descreverMudanca(antes: Indicadores, depois: Indicadores): string {
  const partes = (Object.keys(NOMES_INDICADOR) as (keyof Indicadores)[])
    .filter((chave) => depois[chave] !== antes[chave])
    .map((chave) => {
      const delta = depois[chave] - antes[chave];
      return `${NOMES_INDICADOR[chave]} ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`;
    });
  return partes.length ? `${partes.join(', ')}.` : 'Nada mudou.';
}

// A rodada na mesa da taverna (01-tema-e-hud.md §6, 02-jogabilidade.md §2):
// HUD no alto (mapa da jornada e orbes), a Tapeçaria no canto e, no centro,
// o passo da etapa. → avança os passos; o dado rola com → ou clique.
export function F2Rodada({ avancar: avancarFase, voltar: voltarFase, rodada, som }: F2RodadaProps) {
  const { estado, avancar, escolher, rolarDado, forcarFaixa } = rodada;
  const { notificar } = useGrimorio();
  // Valores de antes do dado: os orbes só mudam quando o dado para de girar.
  const [indAntes, setIndAntes] = useState<Indicadores | null>(null);
  const [revelado, setRevelado] = useState(false);

  // Passagem do tempo: quando a rodada entra num capítulo novo, os anos
  // folheiam antes do primeiro passo dele. Detectada no render (e não num
  // efeito) para o passo novo nem chegar a montar, tocar som ou falar antes.
  const [etapaVista, setEtapaVista] = useState(estado.etapa);
  const [passagem, setPassagem] = useState<number | null>(null);
  if (estado.etapa !== etapaVista) {
    setPassagem(estado.etapa === etapaVista + 1 ? estado.etapa : null);
    setEtapaVista(estado.etapa);
  }
  const emPassagem = passagem !== null && passagem === estado.etapa && !estado.terminou;
  // O passo que está de fato na mesa (nenhum durante a passagem).
  const passoVisivel = emPassagem ? null : estado.passo;

  const etapa = etapas[estado.etapa];
  const escolhaAtual = estado.escolhas[estado.etapa];
  const opcaoAtual = escolhaAtual ? (escolhaAtual === 'combinar' ? etapa?.combinar : etapa?.[escolhaAtual]) : undefined;
  const desbloqueado = combinarDesbloqueado(estado.escolhas);

  function aoEscolher(escolha: Escolha) {
    som.tocar('carta-bater');
    escolher(escolha);
  }

  function aoRolarDado() {
    som.tocar('dado');
    setIndAntes(estado.ind);
    setRevelado(false);
    rolarDado();
  }

  function aoRevelarDado() {
    travar(TRAVA_REVELACAO_MS);
    setRevelado(true);
    const faixa = estado.ultimoDado?.faixa;
    if (faixa === 'critico') {
      som.tocar('fanfarra');
      som.tocar('publico-comemora');
      som.falar('critico');
    } else if (faixa === 'falha') {
      som.tocar('perda');
      som.tocar('publico-lamenta');
      som.falar('falha');
    } else {
      som.tocar('ganho');
      if (escolhaAtual === etapa?.ideal) som.falar('acerto');
    }
    if (indAntes && estado.ind.caixa > indAntes.caixa) som.tocar('moedas');
    if (indAntes) notificar(descreverMudanca(indAntes, estado.ind));
    setIndAntes(null);
  }

  // Passos que o → (ou o botão) avança; votação e dado têm ação própria.
  const podeAvancar =
    estado.terminou ||
    estado.passo === 'situacao' ||
    estado.passo === 'bricolagem' ||
    estado.passo === 'cronica' ||
    estado.passo === 'evento' ||
    estado.passo === 'forja' ||
    (estado.passo === 'consequencia' && revelado);

  const avancarRef = useRef(() => {});
  avancarRef.current = () => {
    if (emPassagem) setPassagem(null);
    else if (estado.terminou) avancarFase();
    else if (podeAvancar) avancar();
  };

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.defaultPrevented) return;
      if (evento.shiftKey && FAIXA_POR_TECLA[evento.code]) {
        evento.preventDefault();
        const faixa = FAIXA_POR_TECLA[evento.code];
        forcarFaixa(faixa);
        notificar(`Próximo dado: ${faixa === 'critico' ? 'crítico' : faixa}.`);
        return;
      }
      // No passo do dado a seta rola o dado: quem trata é o DadoDestino. Ele
      // registra o ouvinte de novo a cada render, depois deste, então aqui a
      // tecla precisa passar sem ser consumida.
      if (TECLAS_AVANCAR.includes(evento.key) && estado.passo === 'dado') return;
      if (TECLAS_AVANCAR.includes(evento.key)) {
        // Na rodada a seta avança os passos, não a fase.
        evento.preventDefault();
        avancarRef.current();
      } else if (evento.key === 'ArrowLeft' || evento.key === 'PageUp') {
        evento.preventDefault();
        if (estado.etapa === 0 && estado.passo === 'situacao') voltarFase();
      }
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [estado.etapa, estado.passo, forcarFaixa, notificar, voltarFase]);

  useEffect(() => {
    // Durante a passagem do tempo, nada: o passo toca e fala quando aparecer.
    if (!passoVisivel) return;
    if (estado.passo === 'evento') som.tocar('evento');
    if (estado.passo === 'forja' && !desbloqueado) {
      som.tocar('cadeado');
      som.tocar('correntes');
    }

    // Falas do Taverneiro (src/engine/falas.ts) em cada passo da etapa.
    if (estado.passo === 'situacao') som.falar(estado.etapa === 0 ? 'inicio-rodada' : 'desafio');
    if (estado.passo === 'votacao') som.falar('votacao');
    // As cartas são distribuídas na mesa logo depois da Leitura do Mapa.
    const distribuir = estado.passo === 'votacao' ? window.setTimeout(() => som.tocar('embaralhar'), 1100) : undefined;
    if (estado.passo === 'dado') som.falar('dado');
    if (estado.passo === 'cronica') som.falar('cronica');
    // Depois das correntes: libertada comenta a fusão, presa lamenta.
    const forja =
      estado.passo === 'forja' ? window.setTimeout(() => som.falar(desbloqueado ? 'forja-livre' : 'forja-presa'), desbloqueado ? 1600 : 900) : undefined;
    if (estado.passo === 'evento') {
      const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa);
      const sucesso = evento?.condicao(estado.escolhas, estado.ind);
      // Destino bom cintila quando a carta termina de virar; o Taverneiro
      // comenta depois.
      const brilho = sucesso ? window.setTimeout(() => som.tocar('brilho', { volume: 0.7 }), VIRA_EM * 1000 + 650) : undefined;
      const id = window.setTimeout(() => som.falar(sucesso ? 'evento-bom' : 'evento-ruim'), 1200);
      return () => {
        window.clearTimeout(id);
        window.clearTimeout(brilho);
      };
    }
    return () => {
      window.clearTimeout(distribuir);
      window.clearTimeout(forja);
    };
    // Só quando o passo visível muda: som é estável, mas o efeito não deve
    // repetir falas se outra coisa da rodada mudar.
  }, [passoVisivel]);

  // Na descoberta da Bricolagem, orbes e tapeçaria seguram o estado de antes e
  // só mudam quando a carta termina de virar. As refs guardam o último passo
  // antes dela (o bônus e a nova cor entram junto com o passo).
  const indForaDaBricolagem = useRef(estado.ind);
  const canvasForaDaBricolagem = useRef(estado.canvas);
  if (estado.passo !== 'bricolagem') {
    indForaDaBricolagem.current = estado.ind;
    canvasForaDaBricolagem.current = estado.canvas;
  }
  const [bonusBricolagemVisivel, setBonusBricolagemVisivel] = useState(false);
  useEffect(() => {
    setBonusBricolagemVisivel(false);
    if (estado.passo !== 'bricolagem' || !estado.bricolagem) return;
    const id = window.setTimeout(() => setBonusBricolagemVisivel(true), VIRADA_BRICOLAGEM_MS + 500);
    return () => window.clearTimeout(id);
  }, [estado.passo, estado.bricolagem]);
  const segurandoBonus = estado.passo === 'bricolagem' && estado.bricolagem && !bonusBricolagemVisivel;
  const indNosOrbes = indAntes ?? (segurandoBonus ? indForaDaBricolagem.current : estado.ind);
  const canvasNaTapecaria = segurandoBonus ? canvasForaDaBricolagem.current : estado.canvas;

  useEffect(() => {
    // Na passagem, um instante sem aceitar →, para um toque duplo não pular os anos sem querer.
    if (emPassagem) travar(TRAVA_PADRAO_MS);
    else if (estado.terminou) travar(TRAVA_FIM_MS);
    else if (estado.passo === 'forja' && desbloqueado) travar(TRAVA_FORJA_DESBLOQUEADA_MS);
    else if (estado.passo === 'bricolagem' && estado.bricolagem && !segurandoBonus) travar(TRAVA_BRICOLAGEM_DESCOBERTA_MS);
    else travar(TRAVA_PASSO_MS[estado.passo]);
  }, [estado.etapa, estado.passo, estado.terminou, emPassagem]);

  // Fim da rodada: o Taverneiro chama para ver o resultado.
  useEffect(() => {
    if (estado.terminou) som.falar('resultado');
    // som omitido pelo mesmo motivo do efeito acima.
  }, [estado.terminou]);

  if (estado.terminou) {
    return (
      <section className="flex h-full flex-col items-center justify-center gap-8 text-center">
        {/* O tomo da crônica se fecha com o selo da guilda. */}
        <motion.div
          className="relative text-ouro drop-shadow-[0_12px_20px_rgb(0_0_0/0.8)]"
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        >
          <ArtePintada nome="pergaminho" className="h-[170px] w-[190px]" />
          <motion.span
            className="selo-pintado absolute -bottom-3 -right-6"
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.6 }}
          >
            <ArtePintada nome="selo" className="h-20 w-20" />
          </motion.span>
        </motion.div>
        <h2 className="titulo-ouro font-titulo text-[96px] font-bold leading-none">A crônica terminou</h2>
        <div className="filigrana text-[26px] text-ouro" aria-hidden>
          ✦
        </div>
        <p className="font-texto text-[36px] italic text-pergaminho/85">Quatro decisões escritas. Vamos ver o que a guilda construiu.</p>
        <Botao onClick={avancarFase}>Ver o resultado</Botao>
      </section>
    );
  }

  const blocosAcesos =
    (estado.passo === 'consequencia' && revelado) || (estado.passo === 'bricolagem' && estado.bricolagem)
      ? (opcaoAtual?.blocos ?? [])
      : [];

  return (
    <section className="flex h-full flex-col px-16 pb-6 pt-4">
      <header className="flex items-start justify-between">
        <div data-guia="jornada">
          <MapaJornada etapaAtual={estado.etapa} escolhas={estado.escolhas} />
        </div>
        <div className="pt-3">
          <TrilhaPassos passo={estado.passo} etapa={estado.etapa} opcoes={etapa?.combinar && desbloqueado ? 3 : 2} />
        </div>
        <div data-guia="orbes">
          <Orbes ind={indNosOrbes} />
        </div>
      </header>

      <div className="mt-2 flex min-h-0 flex-1 gap-10">
        <aside className="flex w-[440px] shrink-0 flex-col justify-end pb-4">
          <div data-guia="tapecaria">
            <Tapecaria canvas={canvasNaTapecaria} destaque={blocosAcesos} />
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center">
          {emPassagem && (
            <PassagemDoTempo key={`passagem-${estado.etapa}`} de={etapas[estado.etapa - 1]} para={etapa} aoTerminar={() => setPassagem(null)} />
          )}

          {passoVisivel === 'situacao' && (
            <div className="flex flex-col items-center gap-5">
              <AberturaCapitulo etapa={etapa} ateAqui={ateAqui(estado.etapa, estado.escolhas, estado.bricolagem, estado.ultimoEvento?.titulo)} />
              <div data-guia="desafio">
                <CartaDesafio etapa={etapa} atraso={0.7} />
              </div>
            </div>
          )}

          {passoVisivel === 'votacao' && (
            <Votacao etapa={etapa} combinarLiberado={desbloqueado} onEscolher={aoEscolher} aoSelecionar={() => {
                som.tocar('tambor');
                som.tocar('chama');
              }} />
          )}

          {passoVisivel === 'dado' && escolhaAtual && (
            <DadoDestino etapa={etapa} etapaIndice={estado.etapa} escolha={escolhaAtual} onRolar={aoRolarDado} />
          )}

          {passoVisivel === 'consequencia' && opcaoAtual && estado.ultimoDado && (
            <Consequencia dado={estado.ultimoDado} resultado={opcaoAtual.resultado} aoRevelar={aoRevelarDado} aoGirar={() => som.tocar('tic')} />
          )}

          {passoVisivel === 'bricolagem' && <RevelacaoBricolagem descoberta={estado.bricolagem} />}

          {passoVisivel === 'cronica' && escolhaAtual && <Cronica etapa={etapa} escolha={escolhaAtual} />}

          {passoVisivel === 'evento' &&
            (() => {
              const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa)!;
              const sucesso = evento.condicao(estado.escolhas, estado.ind);
              const desfecho = sucesso ? evento.seSim : evento.seNao;
              return (
                <div className="flex items-center gap-14">
                  <CartaEvento depoisDaEtapa={evento.depoisDaEtapa} nome={evento.nome} desfecho={desfecho} sucesso={sucesso} />
                  {/* O porquê: o destino é consequência do que a turma fez, não sorte. */}
                  <motion.div
                    className="flex w-[560px] flex-col gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="placa-ferro px-8 py-6">
                      <p className="font-titulo text-[22px] font-bold uppercase tracking-[0.14em] text-ouro">Por causa de</p>
                      <p className="mt-2 font-texto text-[30px] leading-snug text-pergaminho">{evento.causa(estado.escolhas, estado.ind)}</p>
                    </div>
                    <p className="font-texto text-[26px] italic leading-snug text-pergaminho/85 [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">{evento.conceito}</p>
                  </motion.div>
                </div>
              );
            })()}

          {passoVisivel === 'forja' && (
            <Forja
              desbloqueado={desbloqueado}
              aoFundir={() => {
                som.tocar('correntes-quebrando');
                som.tocar('fanfarra');
                som.tocar('publico-comemora');
              }}
            />
          )}

          {podeAvancar && !emPassagem && (
            <div className="absolute bottom-0 right-0">
              <Botao onClick={() => avancarRef.current()}>Continuar</Botao>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial do Taverneiro na primeira vez de cada passo (05-tutorial.md). */}
      <Guia passo={passoVisivel ?? 'passagem'} primeiraVez={estado.etapa === 0} />
    </section>
  );
}
