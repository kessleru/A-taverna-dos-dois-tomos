// Ampliação de carta com o botão direito (docs/redesign/04-visibilidade.md §2.4).
// Antes ampliava ao segurar o cursor em cima, o que abria sem querer enquanto
// o apresentador só passava o mouse pela mesa.
export const ALTURA_AMPLIADA = 900; // px no palco de 1080p

// Zoom extra para a carta chegar à altura-alvo, descontando a escala que ela
// já tem. Nunca encolhe (mínimo 1) e ignora medidas inválidas.
export function fatorAmpliacao(alturaBase: number, escalaAtual: number, alturaAlvo: number): number {
  const alturaNaTela = alturaBase * escalaAtual;
  if (!(alturaNaTela > 0)) return 1;
  return Math.max(1, alturaAlvo / alturaNaTela);
}
