// Navegação entre as folhas de uma fase (ex.: as 4 folhas do briefing,
// docs/redesign/10-briefing-quadro.md §6): as setas percorrem as folhas e só
// nas pontas passam a fase adiante ou para trás.
export type Direcao = 1 | -1;

export type Navegacao = { tipo: 'folha'; folha: number } | { tipo: 'sair'; direcao: Direcao };

export function navegarFolha(atual: number, total: number, direcao: Direcao): Navegacao {
  const corrigida = Math.min(Math.max(atual, 0), total - 1);
  const proxima = corrigida + direcao;
  if (proxima < 0 || proxima >= total) return { tipo: 'sair', direcao };
  return { tipo: 'folha', folha: proxima };
}
