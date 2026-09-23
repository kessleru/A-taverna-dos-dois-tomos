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
                atual ? 'border-ouro text-ouro' : concluida ? 'border-pergaminho/60 text-pergaminho' : 'border-pergaminho/20 text-pergaminho/40'
              } ${atual ? 'animate-pulse' : ''}`}
              title={etapa.fase}
            >
              {concluida ? ICONE_POR_ESCOLHA[escolhas[indice]!] : indice + 1}
            </div>
            {indice < etapas.length - 1 && <div className="h-px w-4 bg-pergaminho/20" />}
          </div>
        );
      })}
    </div>
  );
}
