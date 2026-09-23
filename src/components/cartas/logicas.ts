import type { Escolha } from '../../data/rodada';

// Cada lógica tem cor e sigilo (01-tema-e-hud.md §2): a cor nunca aparece sozinha.
export type Logica = Escolha | 'bricolagem';

export const SIGILO: Record<Logica, string> = {
  planejar: 'scroll-quill',
  adaptar: 'compass',
  combinar: 'crossed-swords',
  bricolagem: 'hammer-drop',
};

export const COR: Record<Logica, string> = {
  planejar: 'var(--planejar)',
  adaptar: 'var(--adaptar)',
  combinar: 'var(--ouro)',
  bricolagem: 'var(--bricolagem)',
};
