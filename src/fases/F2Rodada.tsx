import { etapas } from '../data/rodada';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import type { FaseProps } from '../types';

// Placeholder textual da Iteração 1. O motor da rodada (votação, barras,
// dado, eventos) entra na Iteração 2 (src/engine/motor.ts + useRodada).
export function F2Rodada(props: FaseProps) {
  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">A Rodada</Titulo>
      <ol className="space-y-4">
        {etapas.map((etapa, indice) => (
          <li key={etapa.id} className="rounded-carta border border-papel/20 p-4">
            <div className="font-mono text-xs uppercase text-papel/50">{etapa.fase}</div>
            <div className="font-titulo text-xl">
              {indice + 1}. {etapa.titulo}
            </div>
            <p className="text-papel/80">{etapa.situacao}</p>
          </li>
        ))}
      </ol>
      <ControlesFase {...props} />
    </section>
  );
}
