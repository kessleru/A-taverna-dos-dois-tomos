import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { PassoGuia } from '../../data/tutorial';
import { caminhoSeta, posicionarBalao, type Retangulo } from '../../engine/guia';
import { useEscalaPalco } from '../ui/Palco';
import { Holofote } from './Holofote';
import { SetaGuia } from './SetaGuia';
import { BalaoGuia } from './BalaoGuia';

const LARGURA_BALAO = 760;
const ALTURA_BALAO = 300;

interface TourProps {
  passos: PassoGuia[];
  indice: number;
  aoAvancar: () => void;
  aoTerminar: () => void;
}

// Tour do Taverneiro sobre a mesa (05-tutorial.md): holofote no alvo, seta
// desenhada e balão. As teclas ficam com o Guia, que o controla.
export function Tour({ passos, indice, aoAvancar, aoTerminar }: TourProps) {
  const escala = useEscalaPalco();
  const reduzido = !!useReducedMotion();
  const [alvo, setAlvo] = useState<Retangulo | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const passo = passos[indice];

  // Mede o alvo em coordenadas do palco e segue se ele se mexer (cartas entrando).
  useLayoutEffect(() => {
    function medir() {
      const elemento = document.querySelector(`[data-guia="${passo.alvo}"]`);
      const origem = raiz.current?.getBoundingClientRect();
      if (!elemento || !origem) return setAlvo(null);
      const r = elemento.getBoundingClientRect();
      const novo = {
        x: (r.left - origem.left) / escala,
        y: (r.top - origem.top) / escala,
        largura: r.width / escala,
        altura: r.height / escala,
      };
      setAlvo((atual) =>
        atual && Math.abs(atual.x - novo.x) < 1 && Math.abs(atual.y - novo.y) < 1 && Math.abs(atual.largura - novo.largura) < 1 ? atual : novo,
      );
    }
    medir();
    const id = window.setInterval(medir, 250);
    return () => window.clearInterval(id);
  }, [passo.alvo, escala]);

  const balao = alvo ? posicionarBalao(alvo, LARGURA_BALAO, ALTURA_BALAO) : null;
  const seta = alvo && balao ? caminhoSeta(balao, alvo) : null;

  return (
    <div ref={raiz} className="absolute inset-0 z-40" onClick={aoAvancar}>
      <Holofote alvo={alvo} reduzido={reduzido} />
      {seta && <SetaGuia key={`${indice}-${balao?.lado}`} {...seta} reduzido={reduzido} />}
      {balao && (
        <BalaoGuia
          key={indice}
          texto={passo.texto}
          x={balao.x}
          y={balao.y}
          largura={LARGURA_BALAO}
          ultimo={indice === passos.length - 1}
          reduzido={reduzido}
        />
      )}
      {/* Pular o tour inteiro. */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-texto text-[24px] italic text-pergaminho/70 underline-offset-4 hover:text-pergaminho hover:underline"
        onClick={(evento) => {
          evento.stopPropagation();
          aoTerminar();
        }}
      >
        Pular o tutorial
      </motion.button>
    </div>
  );
}
