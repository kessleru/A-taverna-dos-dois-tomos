import { etapas } from '../../data/rodada';

const ICONE_POR_ESCOLHA = { planejar: '📋', adaptar: '🧭', combinar: '🔀' } as const;

export function TrilhaEtapas({ etapaAtual, escolhas }: { etapaAtual: number; escolhas: (keyof typeof ICONE_POR_ESCOLHA | undefined)[] }) {
  return (
    <div className="flex items-center gap-2">
      {etapas.map((etapa, indice) => {
        const concluida = escolhas[indice] !== undefined;
        const atual = indice === etapaAtual;
        return (
          <div key={etapa.id} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                atual ? 'border-moeda text-moeda' : concluida ? 'border-papel/60 text-papel' : 'border-papel/20 text-papel/40'
              } ${atual ? 'animate-pulse' : ''}`}
              title={etapa.fase}
            >
              {concluida ? ICONE_POR_ESCOLHA[escolhas[indice]!] : indice + 1}
            </div>
            {indice < etapas.length - 1 && <div className="h-px w-4 bg-papel/20" />}
          </div>
        );
      })}
    </div>
  );
}
