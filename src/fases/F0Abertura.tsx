import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { conteudo } from '../data/conteudo';
import { Botao } from '../components/ui/Botao';
import { Grimorio } from '../components/ui/Grimorio';
import { Poeira } from '../components/ui/Poeira';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { mola } from '../styles/movimento';
import { travar } from '../engine/trava';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const BOOT = [
  'Abrindo as portas da taverna...',
  'Tomo A: 38 estudos em 21 anos.',
  'Tomo B: uma startup, 8 anos.',
  'Dois caminhos: planejar ou improvisar.',
  'Acendendo as velas.',
];
const BRASAO = `${import.meta.env.BASE_URL}favicon.png`;
// Pausa depois da última linha antes de o Grimório sair.
const ESPERA_SAIDA_MS = 700;

interface F0AberturaProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

// F0 (03-historia.md §3): o Grimório escreve a abertura e sai; depois entra a
// tela de título, com brasão, raios de luz, os dois tomos flutuando e poeira
// dourada. Clicar no Grimório pula direto para o título.
export function F0Abertura({ avancar, som }: F0AberturaProps) {
  const [etapa, setEtapa] = useState<'grimorio' | 'titulo'>('grimorio');
  const [escrito, setEscrito] = useState(false);

  useEffect(() => {
    if (!escrito) return;
    const id = window.setTimeout(() => setEtapa('titulo'), ESPERA_SAIDA_MS);
    return () => window.clearTimeout(id);
  }, [escrito]);

  function entrar() {
    som.falar('boas-vindas');
    avancar();
  }

  return (
    <section className="relative h-full">
      <AnimatePresence mode="wait">
        {etapa === 'grimorio' ? (
          <motion.div
            key="grimorio"
            className="absolute inset-0 flex cursor-pointer items-center justify-center"
            onClick={() => setEtapa('titulo')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60, scale: 0.92, filter: 'blur(6px)', transition: { duration: 0.7, ease: 'easeIn' } }}
          >
            <Grimorio linhas={BOOT} aoConcluir={() => setEscrito(true)} className="w-[980px] text-left" />
          </motion.div>
        ) : (
          <TelaTitulo key="titulo" aoEntrar={entrar} />
        )}
      </AnimatePresence>
    </section>
  );
}

// Atraso de entrada do botão "Entrar na taverna" (1,8 s).
const ENTRADA_TITULO_MS = 1800;

function TelaTitulo({ aoEntrar }: { aoEntrar: () => void }) {
  const reduzido = useReducedMotion();
  const [artigoA, artigoB] = conteudo.artigos;
  const entrada = (atraso: number) => ({ delay: reduzido ? 0 : atraso });

  // O botão só aparece depois do brasão e da faixa: até lá, nada de pular.
  useEffect(() => {
    if (!reduzido) travar(ENTRADA_TITULO_MS);
  }, [reduzido]);

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Poeira quantidade={36} semente={23} />

      {/* Os dois tomos flutuando dos lados. */}
      {[
        { artigo: artigoA, lado: -1, x: 'left-[110px]' },
        { artigo: artigoB, lado: 1, x: 'right-[110px]' },
      ].map(({ artigo, lado, x }) => (
        <motion.div
          key={artigo.id}
          className={`absolute top-[300px] ${x}`}
          initial={reduzido ? false : { opacity: 0, x: lado * 300, rotate: lado * 25 }}
          animate={{ opacity: 1, x: 0, rotate: lado * 9 }}
          transition={{ ...mola.suave, ...entrada(1.1) }}
        >
          <motion.div
            animate={reduzido ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 4 + lado * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CartaArtigo artigo={artigo} tamanho="pequena" />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Brasão com raios de luz girando atrás. */}
        <div className="relative flex h-[250px] w-[250px] items-center justify-center">
          {/* O giro é CSS; o motion só cuida da entrada (transform separado). */}
          <motion.div
            className="absolute flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ...entrada(0.3) }}
          >
            <div className="raios-luz h-[900px] w-[900px]" />
          </motion.div>
          <motion.img
            src={BRASAO}
            alt=""
            className="relative h-[230px] w-[230px] [filter:drop-shadow(0_0_30px_rgb(232_182_74/0.7))_drop-shadow(0_12px_18px_rgb(0_0_0/0.8))]"
            initial={reduzido ? false : { y: -260, scale: 1.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ ...mola.impacto, ...entrada(0.1) }}
          />
        </div>

        <motion.div
          className="mt-2 text-center"
          initial={reduzido ? false : { opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: 'easeOut', ...entrada(0.5) }}
        >
          <h1 className="titulo-ouro font-titulo text-[150px] font-bold leading-[0.95] tracking-[0.04em]">A Taverna</h1>
          <div className="mt-3 flex items-center justify-center gap-6">
            <Ornamento lado="esquerda" />
            <p className="titulo-ouro font-titulo text-[74px] font-bold leading-none tracking-[0.06em]">dos Dois Tomos</p>
            <Ornamento lado="direita" />
          </div>
        </motion.div>

        {/* Faixa vermelha com o subtítulo, desenrolando do centro. */}
        <motion.div
          className="mt-9 [filter:drop-shadow(0_8px_10px_rgb(0_0_0/0.7))]"
          initial={reduzido ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', ...entrada(1.2) }}
        >
          <p className="bg-gradient-to-b from-[#b3262f] to-cera px-24 py-4 font-texto text-[36px] font-bold italic text-[#f6e3c8] [clip-path:polygon(0_0,100%_0,96%_50%,100%_100%,0_100%,4%_50%)] [text-shadow:0_2px_0_#5c1119]">
            a crônica de uma startup real, jogada em cartas
          </p>
        </motion.div>

        <motion.p
          className="absolute bottom-8 right-10 font-texto text-[24px] italic text-pergaminho/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={entrada(2.6)}
        >
          <span className="font-titulo not-italic text-ouro/70">?</span> mostra os atalhos
        </motion.p>

        <motion.div className="mt-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={entrada(1.8)}>
          <motion.div
            className="rounded-md"
            animate={reduzido ? undefined : { boxShadow: ['0 0 0px rgb(232 182 74 / 0)', '0 0 36px rgb(232 182 74 / 0.75)', '0 0 0px rgb(232 182 74 / 0)'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Botao onClick={aoEntrar} className="!px-16 !text-[42px]">
              Entrar na taverna
            </Botao>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Filete dourado com losango, dos dois lados do subtítulo do título.
function Ornamento({ lado }: { lado: 'esquerda' | 'direita' }) {
  return (
    <span className={`flex items-center gap-2 ${lado === 'direita' ? 'flex-row-reverse' : ''}`} aria-hidden>
      <span
        className="h-[3px] w-[110px] rounded-full"
        style={{ background: `linear-gradient(${lado === 'esquerda' ? 'to right' : 'to left'}, transparent, var(--ouro))` }}
      />
      <span className="h-4 w-4 rotate-45 border-2 border-ouro bg-ouro-escuro" />
    </span>
  );
}
