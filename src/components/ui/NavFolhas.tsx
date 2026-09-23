import type { Direcao } from '../../engine/folhas';
import { Botao } from './Botao';

interface NavFolhasProps {
  folha: number;
  total: number;
  ir: (direcao: Direcao) => void;
  rotulo: string;
  rotuloAvancar?: string;
  mostrarAvancar?: boolean;
}

// Voltar, bolinhas de progresso e Continuar, embaixo das fases com folhas.
export function NavFolhas({ folha, total, ir, rotulo, rotuloAvancar = 'Continuar', mostrarAvancar = true }: NavFolhasProps) {
  return (
    <nav className="flex items-center justify-between" aria-label={rotulo}>
      <Botao variante="fantasma" onClick={() => ir(-1)}>
        Voltar
      </Botao>
      <ol className="flex gap-4" aria-label={`Folha ${folha + 1} de ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={`h-5 w-5 rounded-full border-2 ${i === folha ? 'border-cera bg-cera' : 'border-pergaminho/40'}`} />
        ))}
      </ol>
      {/* Espaçador mantém as bolinhas no centro quando não há Continuar. */}
      {mostrarAvancar ? <Botao onClick={() => ir(1)}>{rotuloAvancar}</Botao> : <span className="w-[220px]" />}
    </nav>
  );
}
