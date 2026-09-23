// Todo o jogo é desenhado num palco fixo de 1920×1080 e escalado para caber
// na janela (docs/redesign/04-visibilidade.md §2.1): o que se vê no notebook é
// exatamente o que se vê no projetor.
export const LARGURA_PALCO = 1920;
export const ALTURA_PALCO = 1080;

export interface Enquadramento {
  escala: number;
  x: number;
  y: number;
}

export function enquadrarPalco(largura: number, altura: number): Enquadramento {
  if (!(largura > 0) || !(altura > 0)) return { escala: 0, x: 0, y: 0 };
  const escala = Math.min(largura / LARGURA_PALCO, altura / ALTURA_PALCO);
  return {
    escala,
    x: (largura - LARGURA_PALCO * escala) / 2,
    y: (altura - ALTURA_PALCO * escala) / 2,
  };
}
