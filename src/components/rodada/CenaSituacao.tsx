import { motion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { artesEtapas } from '../../data/artes';
import { CenaArte } from '../cartas/CenaArte';
import { Botao } from '../ui/Botao';

export function CenaSituacao({ etapa, avancar }: { etapa: Etapa; avancar: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <motion.div
        className="h-56 w-full max-w-sm shrink-0 overflow-hidden rounded-carta border-2 border-ouro/50 shadow-carta sm:w-72"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <CenaArte arte={artesEtapas[etapa.id]} nome={etapa.titulo} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <span className="font-texto text-sm uppercase tracking-wide text-ouro">{etapa.fase}</span>
        <h2 className="font-titulo text-4xl">{etapa.titulo}</h2>
        <p className="text-lg text-pergaminho/85">{etapa.situacao}</p>
        <div>
          <Botao onClick={avancar}>Avançar →</Botao>
        </div>
      </div>
    </div>
  );
}
