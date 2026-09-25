// Tremor de câmera por "trauma" (Squirrel Eiserloh, GDC 2016, "Math for Game
// Programmers: Juicing Your Cameras With Math"): cada impacto soma trauma
// (0 a 1), o trauma cai sozinho com o tempo e o deslocamento cresce com o
// quadrado dele, então tremores pequenos quase não aparecem e os grandes
// assentam rápido. O ruído é suave (soma de senos), sem pulos de quadro.

export const DESLOCAMENTO_MAX_PX = 16;
export const GIRO_MAX_GRAUS = 0.8;
// Trauma perdido por segundo: um tremor cheio (1) some em ~0,6 s.
export const QUEDA_POR_SEGUNDO = 1.7;

export function somarTrauma(atual: number, impacto: number): number {
  return Math.min(1, Math.max(0, atual) + Math.max(0, impacto));
}

export function decairTrauma(atual: number, segundos: number): number {
  return Math.max(0, atual - QUEDA_POR_SEGUNDO * Math.max(0, segundos));
}

// Ruído suave entre -1 e 1: senos de frequências que não se repetem juntas.
function ruido(t: number, fase: number): number {
  return (Math.sin(t * 41 + fase) + Math.sin(t * 67 + fase * 1.7) * 0.6 + Math.sin(t * 97 + fase * 2.3) * 0.3) / 1.9;
}

export interface Deslocamento {
  x: number;
  y: number;
  giro: number;
  // Leve zoom para as bordas do palco não aparecerem durante o tremor.
  escala: number;
}

export function deslocamentoTremor(trauma: number, t: number): Deslocamento {
  const forca = Math.min(1, Math.max(0, trauma)) ** 2;
  return {
    x: DESLOCAMENTO_MAX_PX * forca * ruido(t, 0),
    y: DESLOCAMENTO_MAX_PX * forca * ruido(t, 11),
    giro: GIRO_MAX_GRAUS * forca * ruido(t, 23),
    escala: 1 + forca * 0.02,
  };
}
