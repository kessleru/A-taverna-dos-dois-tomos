import { motion } from 'framer-motion';
import type { Retangulo } from '../../engine/guia';
import { ALTURA_PALCO, LARGURA_PALCO } from '../../engine/palco';

const FOLGA = 16;
const CANTO = 44;

// Tracejado que desenha só os cantos de um retângulo (começa no canto de cima à esquerda).
function cantos(largura: number, altura: number): string {
  const l = Math.min(CANTO, largura / 2);
  const a = Math.min(CANTO, altura / 2);
  return [l, largura - 2 * l, l, 0, a, altura - 2 * a, a, 0, l, largura - 2 * l, l, 0, a, altura - 2 * a, a, 0].join(' ');
}

// Palco escurecido com um buraco arredondado em volta do alvo; o buraco
// desliza de um alvo para o outro, com halo de vela e cantoneiras douradas.
// O halo pulsa numa camada HTML à parte (só opacidade, no compositor): dentro
// do SVG, com blur, ele repintava a máscara do palco inteiro a cada quadro.
export function Holofote({ alvo, reduzido }: { alvo: Retangulo | null; reduzido: boolean }) {
  const buraco = alvo
    ? { x: alvo.x - FOLGA, y: alvo.y - FOLGA, width: alvo.largura + FOLGA * 2, height: alvo.altura + FOLGA * 2 }
    : { x: LARGURA_PALCO / 2, y: ALTURA_PALCO / 2, width: 0, height: 0 };
  const transicao = reduzido ? { duration: 0 } : { type: 'spring' as const, stiffness: 140, damping: 22 };

  return (
    <>
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
          // Cantoneiras douradas de manuscrito: só os quatro cantos do retângulo.
          <motion.rect
            fill="none"
            stroke="var(--ouro)"
            strokeWidth={5}
            strokeLinecap="square"
            initial={false}
            animate={{ ...buraco, strokeDasharray: cantos(buraco.width, buraco.height) }}
            transition={transicao}
            style={{ filter: 'drop-shadow(0 0 6px var(--ouro)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.8))' }}
          />
        )}
      </svg>
      {/* Luz de vela em volta do alvo: um halo quente, sem contorno chapado. */}
      {alvo && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0"
          initial={false}
          animate={{ x: buraco.x, y: buraco.y, width: buraco.width, height: buraco.height }}
          transition={transicao}
          aria-hidden
        >
          <span className="holofote-halo" />
        </motion.div>
      )}
    </>
  );
}
