import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { regras } from '../../data/rodada';

interface BarraIndicadorProps {
  icone: string;
  rotulo: string;
  valor: number;
  cor: string;
}

interface Flutuante {
  id: number;
  delta: number;
}

export function BarraIndicador({ icone, rotulo, valor, cor }: BarraIndicadorProps) {
  const percentual = ((valor - regras.minimo) / (regras.maximo - regras.minimo)) * 100;
  const emAlerta = valor <= regras.alertaQuaseQuebrou;

  const valorAnterior = useRef(valor);
  const proximoId = useRef(0);
  const [flutuantes, setFlutuantes] = useState<Flutuante[]>([]);

  useEffect(() => {
    const delta = valor - valorAnterior.current;
    valorAnterior.current = valor;
    if (delta === 0) return;
    const id = proximoId.current++;
    setFlutuantes((f) => [...f, { id, delta }]);
    const tempo = setTimeout(() => setFlutuantes((f) => f.filter((x) => x.id !== id)), 900);
    return () => clearTimeout(tempo);
  }, [valor]);

  return (
    <div
      className="relative flex items-center gap-2 rounded-full border border-papel/15 bg-noite-profunda/60 py-1 pl-1 pr-3"
      style={{ height: 28 }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
        style={{ backgroundColor: cor }}
        title={rotulo}
      >
        {icone}
      </span>
      <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-papel/10">
        <motion.div
          className={`h-full rounded-full ${emAlerta ? 'animate-pulse' : ''}`}
          animate={{ width: `${Math.max(0, Math.min(100, percentual))}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ backgroundColor: emAlerta ? 'var(--dano)' : cor }}
        />
      </div>
      <span className="font-titulo text-xs tabular-nums text-papel/90">{valor}</span>

      <AnimatePresence>
        {flutuantes.map((f) => (
          <motion.span
            key={f.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-none absolute -top-1 right-2 font-titulo text-xs font-bold"
            style={{ color: f.delta > 0 ? 'var(--adaptar)' : 'var(--dano)' }}
          >
            {f.delta > 0 ? `+${f.delta}` : f.delta}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
