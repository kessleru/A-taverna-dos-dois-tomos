import { motion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { artesEtapas } from '../../data/artes';
import { CenaArte } from '../cartas/CenaArte';
import { mola } from '../../styles/movimento';
import { Baforada } from '../ui/Particulas';

// Carta de Desafio (01-tema-e-hud.md §8.2): horizontal, arte à esquerda e a
// situação da etapa à direita num pergaminho. É a mesa de madeira das
// decisões: bem diferente da Carta do Destino (vertical, noturna), que não é
// uma escolha. Cai na mesa logo depois da abertura do capítulo.
export function CartaDesafio({ etapa, atraso = 0 }: { etapa: Etapa; atraso?: number }) {
  const arte = artesEtapas[etapa.id];
  return (
    <motion.div
      className="quadro-madeira flex h-[440px] w-[1180px] gap-0 !p-5"
      initial={{ y: -80, rotate: -3, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ ...mola.impacto, delay: atraso }}
    >
      <div className="relative h-full w-[430px] shrink-0 overflow-hidden rounded-l-[4px]">
        {arte && <CenaArte arte={arte} nome={etapa.titulo} />}
        <span className="moldura-ilustracao pointer-events-none absolute inset-0" aria-hidden />
      </div>
      <div className="pergaminho flex flex-1 flex-col justify-center gap-3 !px-12 [clip-path:none]">
        <p className="font-titulo text-[24px] font-bold uppercase tracking-[0.08em] text-ouro-escuro">Desafio · a decisão é de vocês</p>
        <h2 className="font-titulo text-[46px] font-bold leading-[1.05]">{etapa.titulo}</h2>
        <p className="font-texto text-[31px] leading-snug">{etapa.situacao}</p>
      </div>
      <Baforada atraso={atraso + 0.22} largura={3} semente={etapa.situacao.length} />
    </motion.div>
  );
}
