import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
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
  const { mostrar, esconder } = useAmpliacao();
  const espera = useRef<number | undefined>(undefined);
  const ampliada = useRef(false);

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
        <motion.div
          className="relative"
          animate={{ rotateY: virada ? 0 : 180 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div style={{ backfaceVisibility: 'hidden' }}>{frente}</div>
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <VersoCarta corPrincipal={corPrincipal} tamanho={tamanho} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
