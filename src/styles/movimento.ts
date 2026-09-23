import type { Transition } from 'framer-motion';

// Molas e durações padronizadas (docs/redesign/06-animacoes.md §2).
export const mola = {
  carta: { type: 'spring', stiffness: 260, damping: 22 },
  impacto: { type: 'spring', stiffness: 500, damping: 18 },
  suave: { type: 'spring', stiffness: 120, damping: 20 },
} satisfies Record<string, Transition>;
