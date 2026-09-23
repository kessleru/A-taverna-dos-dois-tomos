import { motion } from 'framer-motion';
import { mensagensCombinar } from '../../data/rodada';
import { Botao } from '../ui/Botao';

export function Desbloqueio({ desbloqueado, avancar }: { desbloqueado: boolean; avancar: () => void }) {
  return (
    <div className="relative flex flex-col items-center gap-6 text-center">
      {desbloqueado && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 14 }).map((_, indice) => (
            <motion.span
              key={indice}
              className="absolute left-1/2 top-16 text-ouro"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((indice / 14) * Math.PI * 2) * 90,
                y: Math.sin((indice / 14) * Math.PI * 2) * 90,
                opacity: 0,
              }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            >
              ✦
            </motion.span>
          ))}
        </div>
      )}

      <motion.div
        className="text-6xl"
        animate={desbloqueado ? { rotate: [0, -15, 15, -8, 8, 0], scale: [1, 1.3, 1] } : { x: [0, -4, 4, -4, 4, 0] }}
        transition={{ duration: desbloqueado ? 0.7 : 0.4, delay: desbloqueado ? 0.3 : 0 }}
      >
        {desbloqueado ? '🔓' : '🔒'}
      </motion.div>

      <p className={`max-w-md text-lg font-bold ${desbloqueado ? 'text-ouro' : 'text-pergaminho/70'}`}>
        {desbloqueado ? mensagensCombinar.desbloqueou : mensagensCombinar.trancada}
      </p>
      <Botao onClick={avancar}>Avançar →</Botao>
    </div>
  );
}
