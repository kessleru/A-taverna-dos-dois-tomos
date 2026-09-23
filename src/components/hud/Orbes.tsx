import type { Indicadores } from '../../data/conteudo';
import { OrboIndicador } from './OrboIndicador';

// Os três indicadores da startup (01-tema-e-hud.md §7): Caixa dourada,
// Clientes violeta, Moral brasa, cada um com seu ícone.
export function Orbes({ ind }: { ind: Indicadores }) {
  return (
    <div className="flex gap-6">
      <OrboIndicador rotulo="Caixa" icone="shiny-purse" valor={ind.caixa} cor="var(--ouro)" />
      <OrboIndicador rotulo="Clientes" icone="flying-flag" valor={ind.clientes} cor="var(--clientes)" />
      <OrboIndicador rotulo="Moral" icone="flamer" valor={ind.moral} cor="var(--brasa)" />
    </div>
  );
}
