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
      {/* Selo de cera na folha atual; cravos de ferro nas outras. */}
      <ol className="flex items-center gap-5" aria-label={`Folha ${folha + 1} de ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className="flex h-7 w-7 items-center justify-center">
            <span className={i === folha ? 'selo-progresso' : i < folha ? 'cravo-progresso opacity-100' : 'cravo-progresso opacity-50'} />
          </li>
        ))}
      </ol>
      {/* Espaçador mantém as bolinhas no centro quando não há Continuar. */}
      {mostrarAvancar ? <Botao onClick={() => ir(1)}>{rotuloAvancar}</Botao> : <span className="w-[220px]" />}
    </nav>
  );
}
