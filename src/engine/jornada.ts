import type { Escolha } from '../data/rodada';

// Marcos do mapa da jornada no HUD (01-tema-e-hud.md §7): cada etapa é
// futura, atual ou feita; as feitas mostram a carta jogada e um selo quando
// ela bateu com o que a startup real fez.
export type Marco =
  | { estado: 'futuro' }
  | { estado: 'atual' }
  | { estado: 'feito'; escolha: Escolha; bateuReal: boolean };

export function marcosDaJornada(
  etapaAtual: number,
  escolhas: readonly (Escolha | undefined)[],
  ideais: readonly Escolha[],
): Marco[] {
  return ideais.map((ideal, i) => {
    const escolha = escolhas[i];
    if (escolha) return { estado: 'feito', escolha, bateuReal: escolha === ideal };
    return i === etapaAtual ? { estado: 'atual' } : { estado: 'futuro' };
  });
}
