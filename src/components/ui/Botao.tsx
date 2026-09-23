import type { ButtonHTMLAttributes } from 'react';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'fantasma';
}

export function Botao({ variante = 'primario', className = '', ...props }: BotaoProps) {
  const base = 'rounded-full px-8 py-3 text-lg font-bold font-texto transition-transform active:scale-95';
  const estilos =
    variante === 'primario'
      ? 'bg-ouro text-tinta shadow-carta hover:brightness-110'
      : 'border-2 border-pergaminho/40 text-pergaminho hover:border-pergaminho';
  return <button className={`${base} ${estilos} ${className}`} {...props} />;
}
