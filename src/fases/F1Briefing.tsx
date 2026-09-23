import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFolhas } from '../engine/useFolhas';
import { NavFolhas } from '../components/ui/NavFolhas';
import { QuadroMadeira } from '../components/ui/QuadroMadeira';
import { FolhaMissao } from './briefing/FolhaMissao';
import { FolhaTomos } from './briefing/FolhaTomos';
import { FolhaDecisoes } from './briefing/FolhaDecisoes';
import { FolhaRegras } from './briefing/FolhaRegras';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

// O briefing é o quadro de missões da taverna, em quatro folhas
// (docs/redesign/10-briefing-quadro.md).
const TOTAL_FOLHAS = 4;

interface F1BriefingProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F1Briefing({ som, avancar, voltar }: F1BriefingProps) {
  const aoVirar = useCallback(() => som.tocar('pagina'), [som]);
  const { folha, ir } = useFolhas({ total: TOTAL_FOLHAS, chave: 'sa-f1-folha', avancar, voltar, aoVirar });

  return (
    <section className="flex h-full flex-col gap-5 px-24 pb-5 pt-8">
      <QuadroMadeira className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={folha} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            {folha === 0 && <FolhaMissao />}
            {folha === 1 && <FolhaTomos som={som} />}
            {folha === 2 && <FolhaDecisoes />}
            {folha === 3 && <FolhaRegras />}
          </motion.div>
        </AnimatePresence>
      </QuadroMadeira>

      <NavFolhas folha={folha} total={TOTAL_FOLHAS} ir={ir} rotulo="Folhas do briefing" />
    </section>
  );
}
