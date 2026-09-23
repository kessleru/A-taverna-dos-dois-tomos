import type { ReactNode } from 'react';

export function Titulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`titulo-ouro font-titulo text-[104px] font-bold leading-[1.05] tracking-[0.04em] ${className}`}>
      {children}
    </h1>
  );
}
