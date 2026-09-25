import { useEffect, useState } from 'react';

// Ajudas, dicas e explicações aparecem uma vez só por sessão: a turma leu,
// não precisa ler de novo na etapa seguinte. O tutorial do Taverneiro tem o
// seu próprio registro (data/tutorial.ts); este cobre o resto (dicas da
// trilha, palavras-chave das cartas, "clique para fechar"...).
const CHAVE = 'sa-ajudas-vistas';

function ler(): string[] {
  try {
    const lista = JSON.parse(sessionStorage.getItem(CHAVE) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function jaVisto(id: string): boolean {
  return ler().includes(id);
}

export function marcarVisto(...ids: string[]): void {
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify([...new Set([...ler(), ...ids])]));
  } catch {
    // Sem sessionStorage, a ajuda só volta depois de recarregar a página.
  }
}

// Dos itens, os que ainda não foram vistos (na ordem dada).
export function naoVistos<T>(itens: readonly T[], id: (item: T) => string, vistos: readonly string[] = ler()): T[] {
  return itens.filter((item) => !vistos.includes(id(item)));
}

// true só na primeira vez que `id` aparece na sessão. O valor fica fixo
// enquanto o id não muda (o componente não some no meio da leitura), e a
// ajuda é marcada como vista ao aparecer. id null: nada a mostrar.
export function usePrimeiraVez(id: string | null): boolean {
  const [estado, setEstado] = useState(() => ({ id, primeira: id !== null && !jaVisto(id) }));
  let atual = estado;
  if (estado.id !== id) {
    atual = { id, primeira: id !== null && !jaVisto(id) };
    setEstado(atual);
  }
  useEffect(() => {
    if (id !== null) marcarVisto(id);
  }, [id]);
  return atual.primeira;
}
