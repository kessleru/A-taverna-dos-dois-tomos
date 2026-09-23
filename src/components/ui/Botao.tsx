import type { ButtonHTMLAttributes } from 'react';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'fantasma';
}

export function Botao({ variante = 'primario', className = '', ...props }: BotaoProps) {
  const base =
    'rounded-md px-10 py-4 font-titulo text-[36px] font-bold tracking-[0.04em] transition-transform active:scale-95';
  const estilos =
    variante === 'primario'
      ? 'border-2 border-ouro-claro bg-gradient-to-b from-ouro-claro via-ouro to-ouro-escuro text-tinta shadow-carta hover:brightness-110'
      : 'border-2 border-pergaminho/40 text-pergaminho hover:border-pergaminho';
  return <button className={`${base} ${estilos} ${className}`} {...props} />;
}
