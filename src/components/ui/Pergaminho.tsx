import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PergaminhoProps {
  children: ReactNode;
  variante?: 'aviso' | 'nota' | 'etiqueta';
  // Graus: os papéis ficam levemente tortos, cada um de um jeito.
  angulo?: number;
  cravo?: boolean;
  // Segundos até o papel cair no quadro (entrada em sequência).
  atraso?: number;
  className?: string;
  style?: CSSProperties;
}

// Papel pregado no quadro. Entra caindo de leve até o ângulo final;
// com movimento reduzido aparece direto.
export function Pergaminho({
  children,
  variante = 'nota',
  angulo = 0,
  cravo = true,
  atraso = 0,
  className = '',
  style,
}: PergaminhoProps) {
  const reduzido = useReducedMotion();
  return (
    <motion.div
      className={`pergaminho-sombra ${className}`}
      style={style}
      initial={reduzido ? false : { opacity: 0, scale: 1.06, rotate: angulo + 2, y: -18 }}
      animate={{ opacity: 1, scale: 1, rotate: angulo, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 320, damping: 24, delay: atraso }}
    >
      <div className={`pergaminho pergaminho-${variante}`}>{children}</div>
      {cravo && <span className="cravo" aria-hidden />}
    </motion.div>
  );
}
