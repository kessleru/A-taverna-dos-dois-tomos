import { motion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { artesEtapas } from '../../data/artes';
import { CenaArte } from '../cartas/CenaArte';
import { mola } from '../../styles/movimento';

// Carta de Desafio (01-tema-e-hud.md §8.2): horizontal, arte à esquerda e a
// situação da etapa à direita num pergaminho. Cai na mesa ao aparecer.
export function CartaDesafio({ etapa }: { etapa: Etapa }) {
  const arte = artesEtapas[etapa.id];
  return (
    <motion.div
      className="quadro-madeira flex h-[440px] w-[1180px] gap-0 !p-5"
      initial={{ y: -80, rotate: -3, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={mola.impacto}
    >
      <div className="h-full w-[430px] shrink-0 overflow-hidden rounded-l-[4px] border-2 border-ouro-escuro">
        {arte && <CenaArte arte={arte} nome={etapa.titulo} />}
      </div>
      <div className="pergaminho flex flex-1 flex-col justify-center gap-4 !px-12 [clip-path:none]">
        <p className="font-titulo text-[26px] font-bold uppercase tracking-[0.08em] text-ouro-escuro">{etapa.fase.replace(/^\d+\s*·\s*/, '')}</p>
        <h2 className="font-titulo text-[52px] font-bold leading-[1.05]">{etapa.titulo}</h2>
        <p className="font-texto text-[34px] leading-snug">{etapa.situacao}</p>
      </div>
    </motion.div>
  );
}
