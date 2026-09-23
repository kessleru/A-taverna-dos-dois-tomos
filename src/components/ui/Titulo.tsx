import type { ReactNode } from 'react';

interface TituloProps {
  children: ReactNode;
  // px no palco de 1080p. 80 é o tamanho que as fases antigas já usavam
  // (a classe de tamanho que elas passam nunca teve efeito); a abertura usa mais.
  tamanho?: number;
  className?: string;
}

export function Titulo({ children, tamanho = 80, className = '' }: TituloProps) {
  return (
    <h1
      className={`titulo-ouro font-titulo font-bold leading-[1.05] tracking-[0.04em] ${className}`}
      style={{ fontSize: tamanho }}
    >
      {children}
    </h1>
  );
}
