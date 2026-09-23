// Tutorial do Taverneiro (docs/redesign/05-tutorial.md): cada peça da mesa é
// apresentada na primeira vez que aparece na rodada, com holofote, seta e
// balão. Os alvos são marcados no JSX com data-guia="...".
export interface PassoGuia {
  alvo: string;
  texto: string;
}

// Chave: o passo da rodada em que as dicas aparecem.
export const GUIA: Record<string, { espera: number; passos: PassoGuia[] }> = {
  situacao: {
    espera: 900,
    passos: [
      { alvo: 'desafio', texto: 'Toda etapa começa com um desafio que aconteceu de verdade.' },
      { alvo: 'jornada', texto: 'São quatro etapas, da fundação aos anos recentes da empresa.' },
      { alvo: 'orbes', texto: 'Caixa, Clientes e Moral. Não deixem nenhum secar!' },
      {
        alvo: 'tapecaria',
        texto: 'Esta é a Tapeçaria da Guilda, o modelo de negócio de vocês. Cada escolha pinta com a sua cor os blocos que construiu.',
      },
    ],
  },
  votacao: {
    espera: 2000,
    passos: [
      {
        alvo: 'leitura',
        texto: 'O Cartógrafo lê o momento: quem decide, a fase da empresa e o mercado. As setas mostram a quem o contexto ajuda.',
      },
      { alvo: 'cartas', texto: 'Vocês votam levantando a mão: carta 1 ou carta 2. Não enxergou? Deixem o cursor em cima da carta que ela amplia.' },
    ],
  },
  dado: {
    espera: 600,
    passos: [{ alvo: 'dado', texto: 'Depois do voto, o destino rola. O contexto dá bônus ou atrapalha.' }],
  },
  cronica: {
    espera: 1200,
    passos: [{ alvo: 'narradores', texto: 'Depois de cada decisão, os dois tomos contam o que aconteceu de verdade. Boa sorte, fundadoras!' }],
  },
  forja: {
    espera: 1800,
    passos: [{ alvo: 'combinar', texto: 'A Combinar é uma carta presa: só quem já viveu as duas lógicas consegue forjá-la.' }],
  },
};

const CHAVE_VISTOS = 'sa-guia-vistos';

export function guiaVisto(passo: string): boolean {
  try {
    return (JSON.parse(sessionStorage.getItem(CHAVE_VISTOS) ?? '[]') as string[]).includes(passo);
  } catch {
    return false;
  }
}

export function marcarGuiaVisto(passo: string): void {
  try {
    const vistos = JSON.parse(sessionStorage.getItem(CHAVE_VISTOS) ?? '[]') as string[];
    sessionStorage.setItem(CHAVE_VISTOS, JSON.stringify([...new Set([...vistos, passo])]));
  } catch {
    // Sem sessionStorage o tutorial só volta a aparecer depois de recarregar.
  }
}
