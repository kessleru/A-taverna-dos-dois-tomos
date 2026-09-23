import { useState } from 'react';
import { motion } from 'framer-motion';
import { Titulo } from '../components/ui/Titulo';
import { Botao } from '../components/ui/Botao';
import { Grimorio } from '../components/ui/Grimorio';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const BOOT = [
  'abrindo a taverna...',
  'tomo A: 38 estudos · 21 anos',
  'tomo B: 1 startup · 8 anos',
  '2 caminhos: planejar ou improvisar',
  'acendendo as velas',
];

interface F0AberturaProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F0Abertura({ avancar, som }: F0AberturaProps) {
  const [pronto, setPronto] = useState(false);

  function entrar() {
    som.tocar('clique');
    avancar();
  }

  return (
    <section className="flex h-full flex-col items-center justify-center gap-14 text-center">
      <Grimorio linhas={BOOT} aoConcluir={() => setPronto(true)} className="w-[980px] text-left" />
      {/* Altura fixa: o Grimório não pula quando o título aparece. */}
      <div className="flex h-[340px] flex-col items-center gap-8">
        {pronto && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <Titulo tamanho={104}>A Taverna dos Dois Tomos</Titulo>
              <p className="mt-4 font-texto text-[36px] italic text-pergaminho/85">
                a crônica de uma startup real, jogada em cartas
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Botao onClick={entrar}>Entrar na taverna</Botao>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
