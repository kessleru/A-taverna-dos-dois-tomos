import { motion } from 'framer-motion';
import { ALTURA_PALCO, LARGURA_PALCO } from '../../engine/palco';

interface SetaGuiaProps {
  d: string;
  fim: { x: number; y: number };
  angulo: number;
  reduzido: boolean;
}

// Seta dourada desenhada do balão até o alvo; a ponta salta no fim do traço.
export function SetaGuia({ d, fim, angulo, reduzido }: SetaGuiaProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={LARGURA_PALCO}
      height={ALTURA_PALCO}
      style={{ filter: 'drop-shadow(0 0 8px var(--ouro)) drop-shadow(0 3px 3px rgb(0 0 0 / 0.8))' }}
      aria-hidden
    >
      <motion.path
        d={d}
        fill="none"
        stroke="var(--ouro)"
        strokeWidth={6}
        strokeLinecap="round"
        initial={reduzido ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <g transform={`translate(${fim.x} ${fim.y}) rotate(${angulo})`}>
        <motion.path
          d="M 6 0 L -20 -14 L -14 0 L -20 14 Z"
          fill="var(--ouro)"
          initial={reduzido ? false : { scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ delay: 0.35, duration: 0.3 }}
        />
      </g>
    </svg>
  );
}
