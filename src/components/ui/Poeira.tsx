import { useMemo, type CSSProperties } from 'react';
import { gerarBrasas } from '../../engine/brasas';

interface PoeiraProps {
  quantidade?: number;
  semente?: number;
  className?: string;
}

// Poeira dourada flutuando na luz das velas: pontos pequenos que sobem um pouco
// e piscam. Decoração discreta para momentos grandiosos (título, lendária).
export function Poeira({ quantidade = 28, semente = 11, className = '' }: PoeiraProps) {
  const pontos = useMemo(() => gerarBrasas(quantidade, semente), [quantidade, semente]);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {pontos.map((ponto, i) => (
        <span
          key={i}
          className="poeira-dourada"
          style={
            {
              left: `${ponto.x}%`,
              top: `${(ponto.atraso / ponto.duracao) * 100}%`,
              width: ponto.tamanho - 1,
              height: ponto.tamanho - 1,
              animationDuration: `${ponto.duracao * 0.7}s`,
              animationDelay: `-${ponto.atraso * 0.7}s`,
              '--deriva': `${ponto.deriva / 4}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
