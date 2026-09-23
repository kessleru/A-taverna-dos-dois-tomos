import { regras } from '../data/rodada';

// Quanto do orbe do HUD fica cheio de líquido (0 a 1) para um indicador.
export function nivelLiquido(valor: number): number {
  const nivel = (valor - regras.minimo) / (regras.maximo - regras.minimo);
  return Math.min(1, Math.max(0, nivel));
}

// Abaixo do limite de "quase quebrou", o orbe pulsa em vermelho.
export function emAlerta(valor: number): boolean {
  return valor <= regras.alertaQuaseQuebrou;
}
