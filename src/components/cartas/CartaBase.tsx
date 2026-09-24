import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ESPERA_AMPLIAR_MS } from '../../engine/ampliacao';
import { useAmpliacao } from './Ampliacao';
import { VersoCarta } from './VersoCarta';

// Altura das molduras antes da ESCALA_CARTA (largura 260 ou 170, proporção 5:7).
const ALTURA_BASE = { grande: 364, pequena: 238 };

interface CartaBaseProps {
  frente: ReactNode;
  corPrincipal: string;
  virada?: boolean;
  tamanho?: 'grande' | 'pequena';
  onClick?: () => void;
  layoutId?: string;
}

export function CartaBase({ frente, corPrincipal, virada = true, tamanho = 'grande', onClick, layoutId }: CartaBaseProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  // Onde o reflexo de vela bate na carta (em %), ou null sem o cursor em cima.
  const [reflexo, setReflexo] = useState<{ x: number; y: number } | null>(null);
  const { mostrar, esconder } = useAmpliacao();
  const espera = useRef<number | undefined>(undefined);
  const ampliada = useRef(false);

  // O giro decide qual face aparece, sem backface-visibility: quando o hover
  // (tilt, escala e o reflexo com mix-blend) achata o 3D, o navegador errava
  // a face de trás e a carta fechada mostrava a frente espelhada ou sumia.
  // O verso gira 180° dentro da carta virada 180°, então nunca fica espelhado.
  const giro = useSpring(virada ? 0 : 180, { stiffness: 300, damping: 26 });
  const visibilidadeFrente = useTransform(giro, (v) => (v < 90 ? 'visible' : 'hidden'));
  const visibilidadeVerso = useTransform(giro, (v) => (v < 90 ? 'hidden' : 'visible'));
  useEffect(() => giro.set(virada ? 0 : 180), [virada, giro]);

  function pararAmpliacao() {
    window.clearTimeout(espera.current);
    if (ampliada.current) {
      ampliada.current = false;
      esconder();
    }
  }

  // Segurar o cursor sobre a carta virada para cima amplia a carta no centro.
  function aoEntrar() {
    if (!virada) return;
    espera.current = window.setTimeout(() => {
      ampliada.current = true;
      mostrar(frente, ALTURA_BASE[tamanho]);
    }, ESPERA_AMPLIAR_MS);
  }

  // Se a carta sair da tela (troca de folha ou de passo) ampliada, fecha junto.
  useEffect(() => pararAmpliacao, []);

  function aoMoverMouse(evento: React.MouseEvent<HTMLDivElement>) {
    const caixa = evento.currentTarget.getBoundingClientRect();
    const px = (evento.clientX - caixa.left) / caixa.width - 0.5;
    const py = (evento.clientY - caixa.top) / caixa.height - 0.5;
    setTilt({ x: py * -12, y: px * 12 });
    setReflexo({ x: (px + 0.5) * 100, y: (py + 0.5) * 100 });
  }

  return (
    <motion.div
      layoutId={layoutId}
      className="cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={aoEntrar}
      onMouseMove={aoMoverMouse}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 });
        setReflexo(null);
        pararAmpliacao();
      }}
      onClick={() => {
        pararAmpliacao();
        onClick?.();
      }}
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}>
        <motion.div className="relative" style={{ rotateY: giro, transformStyle: 'preserve-3d' }}>
          <motion.div className="relative" style={{ visibility: visibilidadeFrente }}>
            {frente}
            {/* Reflexo de vela que acompanha o cursor pelo verniz da carta. */}
            <div
              className="pointer-events-none absolute inset-[4%] rounded-[12px] mix-blend-soft-light transition-opacity duration-300"
              style={{
                opacity: reflexo ? 1 : 0,
                background: reflexo
                  ? `radial-gradient(circle at ${reflexo.x}% ${reflexo.y}%, rgb(255 244 214 / 0.85), rgb(255 220 150 / 0.25) 30%, transparent 60%)`
                  : undefined,
              }}
              aria-hidden
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            style={{ rotateY: 180, visibility: visibilidadeVerso }}
          >
            <VersoCarta corPrincipal={corPrincipal} tamanho={tamanho} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
