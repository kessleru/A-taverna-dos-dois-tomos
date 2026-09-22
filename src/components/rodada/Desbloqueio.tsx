import { mensagensCombinar } from '../../data/rodada';
import { Botao } from '../ui/Botao';

export function Desbloqueio({ desbloqueado, avancar }: { desbloqueado: boolean; avancar: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="text-6xl">{desbloqueado ? '🔓' : '🔒'}</div>
      <p className={`max-w-md text-lg font-bold ${desbloqueado ? 'text-moeda' : 'text-papel/70'}`}>
        {desbloqueado ? mensagensCombinar.desbloqueou : mensagensCombinar.trancada}
      </p>
      <Botao onClick={avancar}>Avançar →</Botao>
    </div>
  );
}
