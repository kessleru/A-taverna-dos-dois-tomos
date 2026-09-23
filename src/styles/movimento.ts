import type { Transition } from 'framer-motion';

// Molas e durações padronizadas (docs/redesign/06-animacoes.md §2).
export const mola = {
  carta: { type: 'spring', stiffness: 260, damping: 22 },
  impacto: { type: 'spring', stiffness: 500, damping: 18 },
  suave: { type: 'spring', stiffness: 120, damping: 20 },
} satisfies Record<string, Transition>;

export const DURACAO_PAGINA_S = 0.9;
export const DURACAO_FADE_S = 0.3;

// Página de tomo virando (01-tema-e-hud.md §9): a fase que sai gira 180° em
// volta da lombada e revela a próxima. Com movimento reduzido, só um fade.
export function temposTransicao(reduzido: boolean) {
  return reduzido
    ? { saida: DURACAO_FADE_S / 2, entrada: DURACAO_FADE_S / 2, folha: 0 }
    : { saida: DURACAO_PAGINA_S / 2, entrada: 0, folha: DURACAO_PAGINA_S };
}
