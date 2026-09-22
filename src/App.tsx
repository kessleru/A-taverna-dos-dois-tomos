import { Fundo } from './components/ui/Fundo';
import { Hud } from './components/hud/Hud';
import { useNavegacao } from './engine/useNavegacao';
import { F0Abertura } from './fases/F0Abertura';
import { F1Briefing } from './fases/F1Briefing';
import { F2Rodada } from './fases/F2Rodada';
import { F3Resultado } from './fases/F3Resultado';
import { F4Artigos } from './fases/F4Artigos';
import { F5Fusao } from './fases/F5Fusao';
import type { FaseProps } from './types';

const fasesPorId: Record<string, (props: FaseProps) => JSX.Element> = {
  abertura: F0Abertura,
  briefing: F1Briefing,
  rodada: F2Rodada,
  resultado: F3Resultado,
  artigos: F4Artigos,
  fusao: F5Fusao,
};

export default function App() {
  const { fase, avancar, voltar, primeiraFase, ultimaFase } = useNavegacao();
  const Fase = fasesPorId[fase];

  return (
    <div className="relative h-screen w-screen">
      <Fundo />
      {fase !== 'abertura' && <Hud fase={fase} />}
      <main className={fase === 'abertura' ? 'h-full' : 'h-full pt-14'}>
        <Fase avancar={avancar} voltar={voltar} primeiraFase={primeiraFase} ultimaFase={ultimaFase} />
      </main>
    </div>
  );
}
