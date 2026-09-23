import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { emAlerta, nivelLiquido } from '../../engine/indicador';
import { Icone } from '../ui/Icone';

const ORBE = `${import.meta.env.BASE_URL}assets/ui/orbe.webp`;
// Vidro do orbe pintado: círculo de raio 35,7% centrado na imagem.
const RAIO_VIDRO = 35.7;
const FUNDO_VIDRO = 50 + RAIO_VIDRO;
const ALTURA_VIDRO = RAIO_VIDRO * 2;

interface OrboIndicadorProps {
  rotulo: string;
  icone: string;
  valor: number;
  cor: string;
}

interface Flutuante {
  id: number;
  delta: number;
}

// Globo de vidro do HUD (01-tema-e-hud.md §7): o líquido na cor do indicador
// sobe e desce com o valor e ondula; ganhos e perdas saem flutuando do globo.
export function OrboIndicador({ rotulo, icone, valor, cor }: OrboIndicadorProps) {
  const clip = useId();
  const reduzido = useReducedMotion();
  const alerta = emAlerta(valor);
  const topoLiquido = FUNDO_VIDRO - nivelLiquido(valor) * ALTURA_VIDRO;

  const valorAnterior = useRef(valor);
  const proximoId = useRef(0);
  const [flutuantes, setFlutuantes] = useState<Flutuante[]>([]);

  useEffect(() => {
    const delta = valor - valorAnterior.current;
    valorAnterior.current = valor;
    if (delta === 0) return;
    const id = proximoId.current++;
    setFlutuantes((f) => [...f, { id, delta }]);
    const tempo = setTimeout(() => setFlutuantes((f) => f.filter((x) => x.id !== id)), 1500);
    return () => clearTimeout(tempo);
  }, [valor]);

  return (
    <div className="relative flex w-[136px] flex-col items-center" aria-label={`${rotulo}: ${valor}`}>
      <motion.div
        className="relative h-32 w-32 rounded-full"
        animate={
          alerta && !reduzido
            ? { boxShadow: ['0 0 0px 0px rgb(224 55 74 / 0)', '0 0 28px 6px rgb(224 55 74 / 0.8)', '0 0 0px 0px rgb(224 55 74 / 0)'] }
            : { boxShadow: '0 0 0px 0px rgb(224 55 74 / 0)' }
        }
        transition={alerta ? { duration: 1.2, repeat: Infinity } : { duration: 0.3 }}
      >
        <img src={ORBE} alt="" draggable={false} className="absolute inset-0 h-full w-full" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <clipPath id={clip}>
              <circle cx="50" cy="50" r={RAIO_VIDRO} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="100" height="100" style={{ fill: '#140d08' }} opacity="0.9" />
            <motion.g initial={false} animate={{ y: topoLiquido }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
              {/* Onda: um trecho de 200 de largura desliza 100 para a esquerda em loop. */}
              <motion.path
                d="M-50 0 Q -25 -4 0 0 T 50 0 T 100 0 T 150 0 V 100 H -50 Z"
                style={{ fill: alerta ? 'var(--dano)' : cor }}
                opacity="0.92"
                animate={reduzido ? undefined : { x: [0, -50] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
              />
            </motion.g>
            {/* Reflexo do vidro. */}
            <ellipse cx="40" cy="30" rx="17" ry="8" fill="#fff" opacity="0.28" transform="rotate(-25 40 30)" />
          </g>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-titulo text-[44px] font-bold tabular-nums text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.95),0_0_2px_rgb(0_0_0)]">
          {valor}
        </span>

        <AnimatePresence>
          {flutuantes.map((f) => (
            <motion.span
              key={f.id}
              className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 font-titulo text-[56px] font-bold [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]"
              style={{ color: f.delta > 0 ? 'var(--cura)' : 'var(--dano)' }}
              initial={{ opacity: 0, y: 0 }}
              animate={f.delta > 0 ? { opacity: [0, 1, 1, 0], y: -90 } : { opacity: [0, 1, 1, 0], y: 70, x: [0, -4, 4, 0] }}
              transition={{ duration: 1.5 }}
            >
              {f.delta > 0 ? `+${f.delta}` : f.delta}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mt-1 flex items-center gap-2 font-titulo text-[22px] font-bold text-pergaminho [text-shadow:0_2px_3px_rgb(0_0_0/0.9)]">
        <span style={{ color: cor }}>
          <Icone nome={icone} className="h-7 w-7" />
        </span>
        {rotulo}
      </div>
      {alerta && <p className="font-texto text-[20px] italic text-dano [text-shadow:0_1px_2px_rgb(0_0_0)]">Quase quebrou!</p>}
    </div>
  );
}
