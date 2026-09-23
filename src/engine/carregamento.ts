// Carregamento inicial: o jogo só abre depois de imagens, sons e fontes
// prontos, para nada aparecer pela metade no projetor. Um arquivo que falha
// ou demora demais conta como feito, para a tela de carregamento nunca travar.
export type Tarefa = () => Promise<unknown>;

export const LIMITE_POR_ARQUIVO_MS = 15000;

export interface ResultadoCarga {
  total: number;
  falhas: number;
}

function comLimite(tarefa: Tarefa, limiteMs: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('tempo esgotado')), limiteMs);
    tarefa().then(
      (valor) => {
        clearTimeout(id);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(id);
        reject(erro);
      },
    );
  });
}

export async function carregarTudo(
  tarefas: Tarefa[],
  aoProgredir: (feitos: number, total: number) => void,
  limiteMs = LIMITE_POR_ARQUIVO_MS,
): Promise<ResultadoCarga> {
  const total = tarefas.length;
  let feitos = 0;
  let falhas = 0;
  aoProgredir(0, total);
  await Promise.all(
    tarefas.map((tarefa) =>
      comLimite(tarefa, limiteMs)
        .catch(() => {
          falhas++;
        })
        .finally(() => {
          feitos++;
          aoProgredir(feitos, total);
        }),
    ),
  );
  return { total, falhas };
}
