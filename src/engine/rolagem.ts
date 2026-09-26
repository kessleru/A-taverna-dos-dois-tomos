// Coreografia da rolagem do Dado do Destino (Consequencia/DadoRolando).
// O d20 é uma pintura 2D, então o "tombo" é uma soma de ilusões: ele chega
// voando do alto, cai com gravidade (desce acelerando, sobe freando), quica
// três vezes cada vez mais baixo, achata ao bater, gira no plano e "vira de
// lado" (a largura encolhe, como uma face passando de perfil). As faces
// trocam justamente quando ele está de perfil, e a última troca já mostra o
// resultado, antes dos quiques miúdos. Tudo em transform, no compositor.

export const DURACAO_ROLAGEM_S = 1.3;
// Micro-pausa depois de assentar antes de revelar (o "hit-stop" dos jogos de
// luta): o olho registra que o dado parou antes da festa.
export const PAUSA_IMPACTO_MS = 90;

// Voo: instantes (0–1) de cada ponto da trajetória. Quiques em 0,42, 0,68 e 0,86.
const TEMPOS_VOO = [0, 0.42, 0.56, 0.68, 0.78, 0.86, 0.93, 1];
export const QUIQUES = [
  { em: 0.42, forca: 1.7 },
  { em: 0.68, forca: 1.15 },
  { em: 0.86, forca: 0.7 },
];

export const voo = {
  x: [-360, -150, -95, -45, -20, -6, -2, 0],
  y: [-400, 0, -120, 0, -42, 0, -8, 0],
  rotate: [-760, -310, -200, -95, -42, -10, -3, 0],
  // Sombra na mesa: pequena e clara com o dado no alto, cheia no chão.
  sombraEscala: [0.3, 1, 0.66, 1, 0.86, 1, 0.97, 1],
  sombraOpacidade: [0.1, 0.6, 0.32, 0.6, 0.48, 0.6, 0.57, 0.6],
  tempos: TEMPOS_VOO,
  // Descendo acelera (easeIn), subindo freia (easeOut).
  easeY: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn'] as const,
};

// Achatamento a cada quique (origem embaixo): bate, espalha e volta.
export const achatar = {
  tempos: [0, 0.405, 0.42, 0.47, 0.665, 0.68, 0.72, 0.855, 0.86, 0.89, 1],
  scaleX: [1, 1, 1.18, 1, 1, 1.11, 1, 1, 1.05, 1, 1],
  scaleY: [1, 1, 0.78, 1, 1, 0.86, 1, 1, 0.93, 1, 1],
};

// "Virar de lado": a largura vai a quase nada (perfil) e volta, mais vezes
// no voo alto e cada vez menos nos quiques.
export const tombo = {
  tempos: [0, 0.1, 0.21, 0.31, 0.42, 0.49, 0.56, 0.62, 0.68, 0.73, 0.78, 1],
  scaleX: [1, 0.18, 1, 0.18, 1, 0.3, 1, 0.45, 1, 0.62, 1, 1],
};

// Quando trocar a face mostrada: nos perfis do tombo. A última troca é o resultado.
export const TROCAS_DE_FACE = [0.1, 0.31, 0.49, 0.62, 0.73];

// Faces que o dado mostra no caminho (sorteadas, sem repetir a vizinha nem
// o resultado antes da hora), terminando no resultado.
export function facesDoCaminho(resultado: number, sorteio: () => number): number[] {
  const faces: number[] = [];
  for (let i = 0; i < TROCAS_DE_FACE.length - 1; i++) {
    let face = resultado;
    while (face === resultado || face === faces[i - 1]) face = 1 + Math.floor(sorteio() * 20);
    faces.push(face);
  }
  faces.push(resultado);
  return faces;
}
