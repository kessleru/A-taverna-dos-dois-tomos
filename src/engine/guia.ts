import { ALTURA_PALCO, LARGURA_PALCO } from './palco';

export interface Retangulo {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export type Lado = 'acima' | 'abaixo' | 'esquerda' | 'direita';

const MARGEM = 32;
// Distância entre o balão e o alvo, onde a seta é desenhada.
const VAO = 110;

// Põe o balão do lado do alvo com mais espaço livre, sem sair do palco.
export function posicionarBalao(alvo: Retangulo, largura: number, altura: number): Retangulo & { lado: Lado } {
  const espacos: Record<Lado, number> = {
    acima: alvo.y - altura,
    abaixo: ALTURA_PALCO - (alvo.y + alvo.altura) - altura,
    esquerda: alvo.x - largura,
    direita: LARGURA_PALCO - (alvo.x + alvo.largura) - largura,
  };
  // Acima e abaixo têm preferência: a seta fica mais curta e legível.
  const lado = (['abaixo', 'acima', 'direita', 'esquerda'] as Lado[]).reduce((melhor, l) =>
    espacos[l] > espacos[melhor] + (l === 'direita' || l === 'esquerda' ? 200 : 0) ? l : melhor,
  );
  const centroX = alvo.x + alvo.largura / 2 - largura / 2;
  const centroY = alvo.y + alvo.altura / 2 - altura / 2;
  const posicoes: Record<Lado, { x: number; y: number }> = {
    acima: { x: centroX, y: alvo.y - VAO - altura },
    abaixo: { x: centroX, y: alvo.y + alvo.altura + VAO },
    esquerda: { x: alvo.x - VAO - largura, y: centroY },
    direita: { x: alvo.x + alvo.largura + VAO, y: centroY },
  };
  const { x, y } = posicoes[lado];
  return {
    x: limitar(x, MARGEM, LARGURA_PALCO - MARGEM - largura),
    y: limitar(y, MARGEM, ALTURA_PALCO - MARGEM - altura),
    largura,
    altura,
    lado,
  };
}

// Seta curva do balão até a borda do alvo (Bézier quadrática), com o ângulo
// da ponta em graus.
export function caminhoSeta(balao: Retangulo & { lado: Lado }, alvo: Retangulo): { d: string; fim: { x: number; y: number }; angulo: number } {
  const meioBalao = { x: balao.x + balao.largura / 2, y: balao.y + balao.altura / 2 };
  const meioAlvo = { x: alvo.x + alvo.largura / 2, y: alvo.y + alvo.altura / 2 };
  const vertical = balao.lado === 'acima' || balao.lado === 'abaixo';
  const inicio = vertical
    ? { x: limitar(meioAlvo.x, balao.x + 60, balao.x + balao.largura - 60), y: balao.lado === 'abaixo' ? balao.y : balao.y + balao.altura }
    : { x: balao.lado === 'direita' ? balao.x : balao.x + balao.largura, y: meioBalao.y };
  const fim = vertical
    ? { x: limitar(inicio.x, alvo.x + 20, alvo.x + alvo.largura - 20), y: balao.lado === 'abaixo' ? alvo.y + alvo.altura + 12 : alvo.y - 12 }
    : { x: balao.lado === 'direita' ? alvo.x + alvo.largura + 12 : alvo.x - 12, y: limitar(inicio.y, alvo.y + 20, alvo.y + alvo.altura - 20) };
  // Curva para o lado de fora, como um traço feito à mão.
  const controle = vertical ? { x: (inicio.x + fim.x) / 2 + 70, y: (inicio.y + fim.y) / 2 } : { x: (inicio.x + fim.x) / 2, y: (inicio.y + fim.y) / 2 - 70 };
  const angulo = (Math.atan2(fim.y - controle.y, fim.x - controle.x) * 180) / Math.PI;
  return { d: `M ${inicio.x} ${inicio.y} Q ${controle.x} ${controle.y} ${fim.x} ${fim.y}`, fim, angulo };
}

function limitar(valor: number, min: number, max: number): number {
  return Math.min(Math.max(valor, min), Math.max(min, max));
}
