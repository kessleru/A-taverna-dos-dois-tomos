import { motion } from 'framer-motion';
import type { Retangulo } from '../../engine/guia';
import { ALTURA_PALCO, LARGURA_PALCO } from '../../engine/palco';

const FOLGA = 16;

// Palco escurecido com um buraco arredondado em volta do alvo; o buraco
// desliza de um alvo para o outro e ganha um anel dourado pulsando.
export function Holofote({ alvo, reduzido }: { alvo: Retangulo | null; reduzido: boolean }) {
  const buraco = alvo
    ? { x: alvo.x - FOLGA, y: alvo.y - FOLGA, width: alvo.largura + FOLGA * 2, height: alvo.altura + FOLGA * 2 }
    : { x: LARGURA_PALCO / 2, y: ALTURA_PALCO / 2, width: 0, height: 0 };
  const transicao = reduzido ? { duration: 0 } : { type: 'spring' as const, stiffness: 140, damping: 22 };

  return (
    <svg className="pointer-events-none absolute inset-0" width={LARGURA_PALCO} height={ALTURA_PALCO} aria-hidden>
      <defs>
        <mask id="holofote-mascara">
          <rect width={LARGURA_PALCO} height={ALTURA_PALCO} fill="white" />
          <motion.rect rx={18} fill="black" initial={false} animate={buraco} transition={transicao} />
        </mask>
      </defs>
      <motion.rect
        width={LARGURA_PALCO}
        height={ALTURA_PALCO}
        fill="rgb(8 5 3 / 0.72)"
        mask="url(#holofote-mascara)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {alvo && (
        <motion.rect
          rx={18}
          fill="none"
          stroke="var(--ouro)"
          strokeWidth={4}
          initial={false}
          animate={{ ...buraco, opacity: reduzido ? 0.9 : [0.95, 0.35, 0.95] }}
          transition={{ ...transicao, opacity: { duration: 1.2, repeat: Infinity } }}
          style={{ filter: 'drop-shadow(0 0 10px var(--ouro))' }}
        />
      )}
    </svg>
  );
}
