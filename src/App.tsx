import { Fundo } from './components/ui/Fundo';
import { Hud } from './components/hud/Hud';
import { useNavegacao } from './engine/useNavegacao';
import { useRodada } from './engine/useRodada';
import { F0Abertura } from './fases/F0Abertura';
import { F1Briefing } from './fases/F1Briefing';
import { F2Rodada } from './fases/F2Rodada';
import { F3Resultado } from './fases/F3Resultado';
import { F4Artigos } from './fases/F4Artigos';
import { F5Fusao } from './fases/F5Fusao';

export default function App() {
  const { fase, avancar, voltar, primeiraFase, ultimaFase } = useNavegacao();
  const rodada = useRodada();
  const faseProps = { avancar, voltar, primeiraFase, ultimaFase };

  return (
    <div className="relative h-screen w-screen">
      <Fundo />
      {fase !== 'abertura' && <Hud fase={fase} />}
      <main className={fase === 'abertura' ? 'h-full' : 'h-full pt-14'}>
        {fase === 'abertura' && <F0Abertura {...faseProps} />}
        {fase === 'briefing' && <F1Briefing {...faseProps} />}
        {fase === 'rodada' && <F2Rodada {...faseProps} rodada={rodada} />}
        {fase === 'resultado' && <F3Resultado {...faseProps} estadoRodada={rodada.estado} />}
        {fase === 'artigos' && <F4Artigos {...faseProps} />}
        {fase === 'fusao' && <F5Fusao {...faseProps} />}
      </main>
    </div>
  );
}
