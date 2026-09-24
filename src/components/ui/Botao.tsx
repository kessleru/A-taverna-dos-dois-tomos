import type { ButtonHTMLAttributes } from 'react';
import { useSomDoJogo } from '../../engine/SomContexto';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'fantasma';
}

// Placa dourada chanfrada (principal) ou tábua escura com fio de ouro
// (secundário), em src/styles/medieval.css. A sombra fica no invólucro
// porque o chanfro (clip-path) a cortaria.
export function Botao({ variante = 'primario', className = '', onClick, children, ...props }: BotaoProps) {
  const som = useSomDoJogo();
  const primario = variante === 'primario';
  return (
    <span className="botao-sombra">
      <button
        className={`${primario ? 'botao-placa' : 'botao-tabua'} px-12 py-4 font-titulo text-[36px] font-bold tracking-[0.05em] transition-[transform,filter] hover:brightness-110 active:scale-95 ${className}`}
        onClick={(evento) => {
          som?.tocar('clique');
          onClick?.(evento);
        }}
        {...props}
      >
        {primario && <span className="botao-brilho" aria-hidden />}
        <span className="relative z-[2] flex items-center gap-4">
          <span className="text-[0.45em] opacity-70" aria-hidden>
            ◆
          </span>
          {children}
          <span className="text-[0.45em] opacity-70" aria-hidden>
            ◆
          </span>
        </span>
      </button>
    </span>
  );
}
