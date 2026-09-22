import type { Escolha } from '../../data/rodada';

const NOMES: Record<Escolha, string> = { planejar: 'Planejar', adaptar: 'Adaptar', combinar: 'Combinar' };

export function SeloRealidade({ igualAoReal, escolhaReal }: { igualAoReal: boolean; escolhaReal: Escolha }) {
  if (igualAoReal) {
    return (
      <p className="w-fit rounded-full bg-adaptar/20 px-4 py-2 font-bold text-adaptar">✓ Como na vida real</p>
    );
  }
  return (
    <p className="w-fit rounded-full bg-dano/20 px-4 py-2 font-bold text-dano">
      A startup real fez diferente: {NOMES[escolhaReal]}
    </p>
  );
}
