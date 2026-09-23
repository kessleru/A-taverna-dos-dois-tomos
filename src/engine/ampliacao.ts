// Ampliação de carta ao segurar o cursor sobre ela (docs/redesign/04-visibilidade.md §2.4).
export const ALTURA_AMPLIADA = 900; // px no palco de 1080p
export const ESPERA_AMPLIAR_MS = 550; // tempo parado sobre a carta até ampliar

// Zoom extra para a carta chegar à altura-alvo, descontando a escala que ela
// já tem. Nunca encolhe (mínimo 1) e ignora medidas inválidas.
export function fatorAmpliacao(alturaBase: number, escalaAtual: number, alturaAlvo: number): number {
  const alturaNaTela = alturaBase * escalaAtual;
  if (!(alturaNaTela > 0)) return 1;
  return Math.max(1, alturaAlvo / alturaNaTela);
}
