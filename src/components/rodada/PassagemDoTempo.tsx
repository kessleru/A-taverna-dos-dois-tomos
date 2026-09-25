import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { anosEntre } from '../../engine/historia';
import { useSomDoJogo } from '../../engine/SomContexto';
import { mola } from '../../styles/movimento';
import { Icone } from '../ui/Icone';

// Tempos da passagem: a ampulheta vira, os anos folheiam um a um e o último
// fica um instante na mesa antes do capítulo novo abrir.
const ENTRADA_MS = 800;
const POR_ANO_MS = 850;
const PAUSA_FINAL_MS = 1500;
const REDUZIDO_MS = 1600;

// Duração total, para quem precisa esperar por ela (e para os testes).
export function duracaoPassagem(quantidadeDeAnos: number, reduzido = false): number {
  if (reduzido) return REDUZIDO_MS;
  return ENTRADA_MS + Math.max(0, quantidadeDeAnos - 2) * POR_ANO_MS + PAUSA_FINAL_MS;
}

// Passagem do tempo entre dois capítulos: uma ampulheta que vira e o ano
// avançando como um calendário folheado (2017 → 2018 → 2019), com uma frase
// do que aconteceu no meio-tempo. É curta e some sozinha; clique ou → pulam.
// O que o capítulo novo tem de som e fala só começa depois dela.
export function PassagemDoTempo({ de, para, aoTerminar }: { de: Etapa; para: Etapa; aoTerminar: () => void }) {
  const reduzido = !!useReducedMotion();
  const anos = anosEntre(de.capitulo.ano, para.capitulo.ano);
  const [indice, setIndice] = useState(reduzido ? anos.length - 1 : 0);
  const som = useSomDoJogo();
  const somRef = useRef(som);
  somRef.current = som;
  const aoTerminarRef = useRef(aoTerminar);
  aoTerminarRef.current = aoTerminar;

  useEffect(() => {
    const ids: number[] = [];
    if (!reduzido) {
      somRef.current?.tocar('tic');
      for (let i = 1; i < anos.length; i++) {
        ids.push(
          window.setTimeout(() => {
            setIndice(i);
            somRef.current?.tocar('pagina');
          }, ENTRADA_MS + (i - 1) * POR_ANO_MS),
        );
      }
    }
    ids.push(window.setTimeout(() => aoTerminarRef.current(), duracaoPassagem(anos.length, reduzido)));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // Uma passagem por montagem.
  }, []);

  return (
    <motion.div
      className="flex cursor-pointer flex-col items-center gap-2 text-center"
      onClick={aoTerminar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      aria-live="polite"
    >
      {/* A ampulheta vira no começo, como quem diz "o tempo passou". */}
      <motion.span
        className="text-ouro [filter:drop-shadow(0_0_18px_rgb(232_182_74/0.55))_drop-shadow(0_8px_10px_rgb(0_0_0/0.8))]"
        initial={false}
        animate={reduzido ? undefined : { rotate: [0, 180] }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.6, 0, 0.3, 1] }}
      >
        <Icone nome="hourglass" className="h-[150px] w-[150px]" />
      </motion.span>
      {/* O ano, folheado como um calendário: o velho sobe, o novo chega de baixo. */}
      <div className="relative h-[170px] w-[640px] overflow-hidden" aria-label={`Ano ${anos[indice]}`}>
        <AnimatePresence initial={false}>
          <motion.p
            key={anos[indice]}
            className="titulo-ouro absolute inset-0 font-titulo text-[150px] font-bold leading-[170px]"
            initial={{ y: 130, opacity: 0, rotateX: -60 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -130, opacity: 0, rotateX: 60 }}
            transition={mola.carta}
          >
            {anos[indice]}
          </motion.p>
        </AnimatePresence>
      </div>
      {para.capitulo.passagem && (
        <motion.p
          className="max-w-[1000px] font-texto text-[34px] italic leading-snug text-pergaminho/90 [text-shadow:0_2px_4px_rgb(0_0_0/0.95)]"
          initial={reduzido ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduzido ? 0 : 0.5, duration: 0.5 }}
        >
          {para.capitulo.passagem}
        </motion.p>
      )}
    </motion.div>
  );
}
