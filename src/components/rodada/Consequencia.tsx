import type { Indicadores } from '../../data/conteudo';
import { BarraIndicador } from '../hud/BarraIndicador';
import { Botao } from '../ui/Botao';

export function Consequencia({ resultado, ind, avancar }: { resultado: string; ind: Indicadores; avancar: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-titulo text-2xl text-moeda">Consequência</h2>
      <p className="text-lg text-papel/90">{resultado}</p>
      <div className="flex gap-3">
        <BarraIndicador icone="💰" rotulo="Caixa" valor={ind.caixa} cor="var(--moeda)" />
        <BarraIndicador icone="👥" rotulo="Clientes" valor={ind.clientes} cor="var(--adaptar)" />
        <BarraIndicador icone="🔥" rotulo="Moral" valor={ind.moral} cor="var(--dano)" />
      </div>
      <div>
        <Botao onClick={avancar}>Avançar →</Botao>
      </div>
    </div>
  );
}
