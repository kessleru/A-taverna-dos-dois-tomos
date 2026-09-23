// Brasas que sobem da lareira no cenário (01-tema-e-hud.md §4). Posições
// geradas com semente fixa para a tela ser igual em todo ensaio.
export interface Brasa {
  x: number; // % da largura
  tamanho: number; // px
  duracao: number; // s para subir a tela inteira
  atraso: number; // s já percorridos ao abrir, para não nascerem todas juntas
  deriva: number; // px de desvio lateral até o topo
}

// mulberry32: gerador pequeno e determinístico, suficiente para decoração.
function aleatorio(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarBrasas(quantidade: number, semente: number): Brasa[] {
  const sorte = aleatorio(semente);
  return Array.from({ length: quantidade }, () => {
    const duracao = 7 + sorte() * 7;
    return {
      x: sorte() * 100,
      tamanho: 3 + sorte() * 4,
      duracao,
      atraso: sorte() * duracao,
      deriva: (sorte() * 2 - 1) * 60,
    };
  });
}
