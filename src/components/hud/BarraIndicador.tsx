import { regras } from '../../data/rodada';

interface BarraIndicadorProps {
  icone: string;
  rotulo: string;
  valor: number;
  cor: string;
}

export function BarraIndicador({ icone, rotulo, valor, cor }: BarraIndicadorProps) {
  const percentual = ((valor - regras.minimo) / (regras.maximo - regras.minimo)) * 100;
  const emAlerta = valor <= regras.alertaQuaseQuebrou;

  return (
    <div className="flex items-center gap-2 rounded-full border border-papel/15 bg-noite-profunda/60 py-1 pl-1 pr-3" style={{ height: 28 }}>
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
        style={{ backgroundColor: cor }}
        title={rotulo}
      >
        {icone}
      </span>
      <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-papel/10">
        <div
          className={`h-full rounded-full transition-all ${emAlerta ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.max(0, Math.min(100, percentual))}%`, backgroundColor: emAlerta ? 'var(--dano)' : cor }}
        />
      </div>
      <span className="font-titulo text-xs tabular-nums text-papel/90">{valor}</span>
    </div>
  );
}
