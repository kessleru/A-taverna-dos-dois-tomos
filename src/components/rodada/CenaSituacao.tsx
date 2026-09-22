import type { Etapa } from '../../data/rodada';
import { Botao } from '../ui/Botao';

export function CenaSituacao({ etapa, avancar }: { etapa: Etapa; avancar: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="font-mono text-sm uppercase tracking-wide text-moeda">{etapa.fase}</span>
      <h2 className="font-titulo text-4xl">{etapa.titulo}</h2>
      <p className="text-lg text-papel/85">{etapa.situacao}</p>
      <div>
        <Botao onClick={avancar}>Avançar →</Botao>
      </div>
    </div>
  );
}
