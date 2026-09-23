import { motion, useReducedMotion } from 'framer-motion';

interface FaiscasProps {
  cor?: string;
  quantidade?: number;
  raio?: number;
}

// Estouro de faíscas com uma onda de luz, no centro do elemento pai
// (que precisa ser relative). Para momentos de impacto: carta escolhida, forja.
export function Faiscas({ cor = 'var(--ouro)', quantidade = 14, raio = 320 }: FaiscasProps) {
  const reduzido = useReducedMotion();
  if (reduzido) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden>
      <motion.span
        className="absolute h-[200px] w-[200px] rounded-full border-[6px]"
        style={{ borderColor: cor, boxShadow: `0 0 30px ${cor}, inset 0 0 30px ${cor}` }}
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {Array.from({ length: quantidade }, (_, i) => {
        const angulo = (i / quantidade) * Math.PI * 2 + (i % 2) * 0.2;
        const distancia = raio * (0.7 + (i % 3) * 0.15);
        return (
          <motion.span
            key={i}
            className="absolute h-3 w-3 rounded-full"
            style={{ background: 'var(--ouro-claro)', boxShadow: `0 0 10px 3px ${cor}` }}
            initial={{ x: 0, y: 0, scale: 1.4, opacity: 1 }}
            animate={{ x: Math.cos(angulo) * distancia, y: Math.sin(angulo) * distancia, scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.9 + (i % 3) * 0.15, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
