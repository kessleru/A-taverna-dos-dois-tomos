import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { briefing, revelacaoBricolagem } from '../../data/rodada';
import { conteudo } from '../../data/conteudo';
import { CartaDecisao } from '../cartas/CartaDecisao';
import { Impacto } from '../ui/Particulas';
import { mola } from '../../styles/movimento';
import { useSonsEmSequencia } from '../../engine/useSonsEmSequencia';

// Quando a carta Adaptar vira do avesso e mostra a Bricolagem.
export const VIRADA_BRICOLAGEM_MS = 1100;

const cartaDe = (id: 'adaptar' | 'bricolagem') => briefing.jeitosDeDecidir.cartas.find((c) => c.id === id)!;

// Revelação da Bricolagem na fundação (Artigo B): jogando Adaptar, a carta
// vira e mostra a Bricolagem escondida nela; planejando, a turma vê a carta
// que a Healthy Skin jogou ali e que ficou na mesa.
export function RevelacaoBricolagem({ descoberta }: { descoberta: boolean }) {
  const reduzido = useReducedMotion();
  const [virou, setVirou] = useState(!descoberta || !!reduzido);
  const texto = descoberta ? revelacaoBricolagem.descoberta : revelacaoBricolagem.perdida;
  const carta = cartaDe(virou ? 'bricolagem' : 'adaptar');
  const surpresa = conteudo.cartaSurpresa;

  useSonsEmSequencia(
    descoberta
      ? [
          ['carta-deslizar', 0],
          ['virar-carta', VIRADA_BRICOLAGEM_MS - 150],
          ['fanfarra', VIRADA_BRICOLAGEM_MS],
          ['moedas', VIRADA_BRICOLAGEM_MS + 700],
        ]
      : [
          ['carta-deslizar', 0],
          ['pagina', 600],
        ],
  );

  useEffect(() => {
    if (virou) return;
    const id = window.setTimeout(() => setVirou(true), VIRADA_BRICOLAGEM_MS);
    return () => window.clearTimeout(id);
  }, [virou]);

  return (
    // pb-24: o pergaminho não desce até o botão Continuar, no canto de baixo.
    <div className="flex w-full max-w-[1320px] items-center justify-center gap-14 pb-24">
      {/* A carta: Adaptar virando Bricolagem, ou a Bricolagem esquecida na mesa. */}
      <div className="relative shrink-0" style={{ perspective: 1400 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={carta.id}
            initial={{ rotateY: -90, scale: 1.08 }}
            animate={{ rotateY: 0, scale: 1 }}
            exit={{ rotateY: 90, transition: { duration: 0.25, ease: 'easeIn' } }}
            transition={mola.impacto}
            className={descoberta ? undefined : 'opacity-70 grayscale-[0.6]'}
            style={{ rotate: descoberta ? 0 : -5 }}
          >
            <CartaDecisao id={carta.id as 'adaptar' | 'bricolagem'} nome={carta.nome} teoria={carta.teoria} resumo={carta.id === 'bricolagem' ? surpresa.subtitulo : carta.resumo} tamanho="grande" emDestaque={descoberta && virou} />
          </motion.div>
        </AnimatePresence>
        {descoberta && virou && <Impacto cor="var(--bricolagem)" onda={260} raio={220} quantidade={14} />}
      </div>

      {/* O que a carta significa, na voz da Cronista. */}
      <motion.div
        className="pergaminho-sombra w-[640px]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...mola.suave, delay: descoberta ? VIRADA_BRICOLAGEM_MS / 1000 + 0.2 : 0.3 }}
      >
        <div className="pergaminho pergaminho-nota border-l-8 [border-color:var(--bricolagem)]">
          <h2 className="font-titulo text-[36px] font-bold leading-tight">{texto.titulo}</h2>
          <p className="mt-2 font-texto text-[26px] leading-snug">{texto.texto}</p>
          <p className="mt-2 font-texto text-[22px] italic leading-snug text-tinta/85">{surpresa.descricao}</p>
          {descoberta && (
            <ul className="mt-3 space-y-1 font-texto text-[24px] leading-snug">
              <li>
                <strong className="font-titulo">{revelacaoBricolagem.descoberta.ganho}</strong>
              </li>
              <li>{revelacaoBricolagem.descoberta.tapecaria}</li>
            </ul>
          )}
          <p className="mt-3 font-titulo text-[24px] font-bold leading-tight [color:var(--bricolagem)]">
            “{revelacaoBricolagem.licao}”
          </p>
          <p className="font-texto text-[20px] italic text-tinta/70">
            {briefing.tomos.narradores.B.nome} · {surpresa.origem}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
