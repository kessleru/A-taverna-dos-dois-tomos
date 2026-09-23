import { createContext, useContext } from 'react';
import type { useSom } from './useSom';

export type Som = ReturnType<typeof useSom>;

// O som do jogo para quem não o recebe por prop (botões, resultado, crônica).
export const SomContexto = createContext<Som | null>(null);

export function useSomDoJogo(): Som | null {
  return useContext(SomContexto);
}
