import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icone } from '../components/ui/Icone';
import { etapas, eventos, combinarDesbloqueado, type Escolha } from '../data/rodada';
import type { Indicadores } from '../data/conteudo';
import type { useRodada } from '../engine/useRodada';
import type { Faixa } from '../engine/motor';
import { Orbes } from '../components/hud/Orbes';
import { MapaJornada } from '../components/hud/MapaJornada';
import { Tapecaria } from '../components/hud/Tapecaria';
import { TrilhaPassos } from '../components/hud/TrilhaPassos';
import { CartaDesafio } from '../components/rodada/CartaDesafio';
import { Votacao } from '../components/rodada/Votacao';
import { DadoDestino } from '../components/rodada/DadoDestino';
import { Consequencia } from '../components/rodada/Consequencia';
import { Cronica } from '../components/rodada/Cronica';
import { Forja } from '../components/rodada/Forja';
import { CartaEvento } from '../components/cartas/CartaEvento';
import { Botao } from '../components/ui/Botao';
import { Guia } from '../components/guia/Guia';
import { useGrimorio } from '../components/ui/NotificacoesGrimorio';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

interface F2RodadaProps extends FaseProps {
  rodada: ReturnType<typeof useRodada>;
  som: ReturnType<typeof useSom>;
}

const TECLAS_AVANCAR = ['ArrowRight', ' ', 'PageDown'];
// Shift+1/2/3 forçam a faixa do próximo dado (ensaio e emergências, 02 §4).
const FAIXA_POR_TECLA: Record<string, Faixa> = { Digit1: 'falha', Digit2: 'sucesso', Digit3: 'critico' };
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
    setRevelado(true);
    const faixa = estado.ultimoDado?.faixa;
    if (faixa === 'critico') {
      som.tocar('fanfarra');
      som.tocar('publico-comemora');
    } else if (faixa === 'falha') {
      som.tocar('perda');
      som.tocar('publico-lamenta');
    } else {
      som.tocar('ganho');
    }
    if (indAntes && estado.ind.caixa > indAntes.caixa) som.tocar('moedas');
    if (indAntes) notificar(descreverMudanca(indAntes, estado.ind));
    setIndAntes(null);
  }

  // Passos que o → (ou o botão) avança; votação e dado têm ação própria.
  const podeAvancar =
    estado.terminou ||
    estado.passo === 'situacao' ||
    estado.passo === 'cronica' ||
    estado.passo === 'evento' ||
    estado.passo === 'forja' ||
    (estado.passo === 'consequencia' && revelado);

  const avancarRef = useRef(() => {});
  avancarRef.current = () => {
    if (estado.terminou) avancarFase();
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
    if (estado.passo === 'consequencia' && estado.escolhas[estado.etapa] === etapa?.ideal) som.falar('acerto');
    if (estado.passo === 'evento') {
      const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa);
      const sucesso = evento?.condicao(estado.escolhas, estado.ind);
      // Espera a carta do destino virar antes de comentar.
      const id = window.setTimeout(() => som.falar(sucesso ? 'evento-bom' : 'evento-ruim'), 1200);
      return () => window.clearTimeout(id);
    }
    return () => window.clearTimeout(distribuir);
    // som é intencionalmente omitido: o objeto retornado por useSom muda de
    // identidade a cada render e recolocaria esse efeito em loop.
  }, [estado.passo]);

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
          <Icone nome="scroll-quill" className="h-[170px] w-[170px]" />
          <motion.span
            className="selo-cera absolute -bottom-3 -right-6"
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.6 }}
          >
            <Icone nome="wax-seal" className="h-20 w-20" />
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

  const blocosAcesos = estado.passo === 'consequencia' && revelado && opcaoAtual ? opcaoAtual.blocos : [];

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
          <Orbes ind={indAntes ?? estado.ind} />
        </div>
      </header>

      <div className="mt-2 flex min-h-0 flex-1 gap-10">
        <aside className="flex w-[440px] shrink-0 flex-col justify-end pb-4">
          <div data-guia="tapecaria">
            <Tapecaria canvas={estado.canvas} destaque={blocosAcesos} />
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center">
          {estado.passo === 'situacao' && (
            <div data-guia="desafio">
              <CartaDesafio etapa={etapa} />
            </div>
          )}

          {estado.passo === 'votacao' && (
            <Votacao etapa={etapa} combinarLiberado={desbloqueado} onEscolher={aoEscolher} aoSelecionar={() => {
                som.tocar('tambor');
                som.tocar('chama');
              }} />
          )}

          {estado.passo === 'dado' && escolhaAtual && (
            <DadoDestino etapa={etapa} etapaIndice={estado.etapa} escolha={escolhaAtual} onRolar={aoRolarDado} />
          )}

          {estado.passo === 'consequencia' && opcaoAtual && estado.ultimoDado && (
            <Consequencia dado={estado.ultimoDado} resultado={opcaoAtual.resultado} aoRevelar={aoRevelarDado} aoGirar={() => som.tocar('tic')} />
          )}

          {estado.passo === 'cronica' && escolhaAtual && <Cronica etapa={etapa} escolha={escolhaAtual} />}

          {estado.passo === 'evento' &&
            (() => {
              const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa)!;
              const sucesso = evento.condicao(estado.escolhas, estado.ind);
              const desfecho = sucesso ? evento.seSim : evento.seNao;
              return (
                <div className="flex flex-col items-center gap-8">
                  <CartaEvento depoisDaEtapa={evento.depoisDaEtapa} nome={evento.nome} desfecho={desfecho} sucesso={sucesso} />
                  <p className="max-w-[1000px] text-center font-texto text-[30px] italic leading-snug text-pergaminho/85 [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
                    {evento.conceito}
                  </p>
                </div>
              );
            })()}

          {estado.passo === 'forja' && (
            <Forja
              desbloqueado={desbloqueado}
              aoFundir={() => {
                som.tocar('correntes-quebrando');
                som.tocar('fanfarra');
                som.tocar('publico-comemora');
              }}
            />
          )}

          {podeAvancar && (
            <div className="absolute bottom-0 right-0">
              <Botao onClick={() => avancarRef.current()}>Continuar</Botao>
            </div>
          )}
        </div>
      </div>

      {/* Tutorial do Taverneiro na primeira vez de cada passo (05-tutorial.md). */}
      <Guia passo={estado.passo} primeiraVez={estado.etapa === 0} />
    </section>
  );
}
