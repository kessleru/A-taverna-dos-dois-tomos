import confetti from 'canvas-confetti';

// Confete da taverna: em vez dos retângulos de festa, estrelinhas de quatro
// pontas (o ✦ dos títulos), losangos (o ◆ dos botões) e moedas. Formas por
// caminho SVG, e não por texto: o ✦ dependeria de uma fonte com o símbolo.
const ESTRELA = 'M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10 Z';
const LOSANGO = 'M0 -9 L6 0 L0 9 L-6 0 Z';

export const OURO = ['#E8B64A', '#FFE39A', '#F3E6C8', '#C8901C'];
export const OURO_E_BRASA = ['#E8B64A', '#FFE39A', '#F3E6C8', '#FF7A2F'];

let formas: confetti.Shape[] | null = null;

// Criadas na primeira festa (precisam de um canvas para medir o caminho).
function formasDaTaverna(): confetti.Shape[] {
  if (formas) return formas;
  try {
    formas = [confetti.shapeFromPath({ path: ESTRELA }), confetti.shapeFromPath({ path: LOSANGO }), 'circle'];
  } catch {
    formas = ['circle', 'square'];
  }
  return formas;
}

// Na tela de carregamento: cria as formas e o Worker do confete (o canvas-confetti
// monta os dois no primeiro disparo, que antes caía bem no crítico do dado).
export function aquecerConfete() {
  formasDaTaverna();
  confetti({ particleCount: 0 });
}

export function chuvaDeOuro(opcoes: confetti.Options) {
  return confetti({ shapes: formasDaTaverna(), scalar: 1.3, colors: OURO, ticks: 260, gravity: 0.9, ...opcoes });
}
