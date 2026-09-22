export type Fase = 'abertura' | 'briefing' | 'rodada' | 'resultado' | 'artigos' | 'fusao';

export const ordemFases: Fase[] = ['abertura', 'briefing', 'rodada', 'resultado', 'artigos', 'fusao'];

export interface FaseProps {
  avancar: () => void;
  voltar: () => void;
  primeiraFase: boolean;
  ultimaFase: boolean;
}
