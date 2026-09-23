import { Botao } from '../ui/Botao';

// Os orbes do topo animam a mudança; aqui fica só o que aconteceu.
export function Consequencia({ resultado, avancar }: { resultado: string; avancar: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-titulo text-2xl text-ouro">Consequência</h2>
      <p className="text-lg text-pergaminho/90">{resultado}</p>
      <div>
        <Botao onClick={avancar}>Avançar →</Botao>
      </div>
    </div>
  );
}
