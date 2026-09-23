import type { ReactNode } from 'react';

// Quadro de tábuas com moldura e cantoneiras de ferro, onde os papéis são pregados.
export function QuadroMadeira({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`quadro-madeira ${className}`}>
      <div className="quadro-tabuas">{children}</div>
      <span className="quadro-cantoneira quadro-cantoneira-no" aria-hidden />
      <span className="quadro-cantoneira quadro-cantoneira-ne" aria-hidden />
      <span className="quadro-cantoneira quadro-cantoneira-se" aria-hidden />
      <span className="quadro-cantoneira quadro-cantoneira-so" aria-hidden />
    </div>
  );
}
