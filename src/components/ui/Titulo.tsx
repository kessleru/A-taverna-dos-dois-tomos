import type { ReactNode } from 'react';

export function Titulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`font-titulo text-[clamp(2.5rem,6vw,5rem)] leading-tight text-papel ${className}`}>
      {children}
    </h1>
  );
}
