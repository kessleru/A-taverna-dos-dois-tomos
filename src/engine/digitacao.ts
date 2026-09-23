// Efeito de digitação do Grimório: dado quantos caracteres já foram
// digitados, quanto de cada linha aparece (linhas digitadas em sequência).
export const CARACTERES_POR_SEGUNDO = 40;

export interface Digitacao {
  linhas: string[];
  completo: boolean;
}

export function digitar(linhas: string[], caracteres: number): Digitacao {
  let restante = Math.max(0, Math.floor(caracteres));
  const total = linhas.reduce((soma, linha) => soma + linha.length, 0);
  const visiveis: string[] = [];
  for (const linha of linhas) {
    if (restante <= 0) break;
    visiveis.push(linha.slice(0, restante));
    restante -= linha.length;
  }
  return { linhas: visiveis, completo: Math.max(0, caracteres) >= total };
}
