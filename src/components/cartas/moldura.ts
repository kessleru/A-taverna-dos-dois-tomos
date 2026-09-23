import type { Raridade } from '../../data/artes';

// Molduras pintadas do pacote (docs/redesign/08-assets.md §7): o metal marca a
// raridade, como no Hearthstone.
const METAL: Record<Raridade, string> = { comum: 'bronze', rara: 'prata', lendaria: 'ouro' };

export function urlMoldura(raridade: Raridade): string {
  return `${import.meta.env.BASE_URL}assets/molduras/carta-${METAL[raridade]}.webp`;
}

export interface Slot {
  esquerda: number; // % da largura da carta
  topo: number; // % da altura
  largura: number;
  altura: number;
}

// Onde cada peça fica sobre a moldura, medido na imagem 1024×1440. As gemas
// são quadrados (largura em % da largura; a altura equivalente em % da altura).
const PROPORCAO = 1440 / 1024;
function gema(centroX: number, centroY: number, diametro: number): Slot {
  const altura = diametro / PROPORCAO;
  return { esquerda: centroX - diametro / 2, topo: centroY - altura / 2, largura: diametro, altura };
}

export const SLOTS_MOLDURA = {
  arte: { esquerda: 20, topo: 13.8, largura: 60.1, altura: 40.9 },
  nome: { esquerda: 13, topo: 58.5, largura: 74, altura: 6 },
  texto: { esquerda: 15.5, topo: 67.5, largura: 69, altura: 19.5 },
  gemaTopo: gema(16.6, 13, 17),
  gemaEsquerda: gema(16.6, 86.8, 15),
  gemaDireita: gema(83.5, 86.8, 15),
} satisfies Record<string, Slot>;
