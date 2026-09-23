import { useEffect, useRef } from 'react';
import { Taverna } from './components/ui/Taverna';
import { Palco } from './components/ui/Palco';
import { GrimorioProvider, useGrimorio } from './components/ui/NotificacoesGrimorio';
import { TransicaoPagina } from './components/ui/TransicaoPagina';
import { AmpliacaoProvider } from './components/cartas/Ampliacao';
import { Hud } from './components/hud/Hud';
import { useNavegacao } from './engine/useNavegacao';
import { useRodada } from './engine/useRodada';
import { useSom } from './engine/useSom';
import { F0Abertura } from './fases/F0Abertura';
import { F1Briefing } from './fases/F1Briefing';
import { F2Rodada } from './fases/F2Rodada';
import { F3Resultado } from './fases/F3Resultado';
import { F4Artigos } from './fases/F4Artigos';
import { F5Fusao } from './fases/F5Fusao';
import { Vitrine } from './fases/Vitrine';

// Avisa no Grimório quando o som liga ou desliga (tecla M ou botão do HUD).
function AvisoDeSom({ mudo }: { mudo: boolean }) {
  const { notificar } = useGrimorio();
  const primeiro = useRef(true);
  useEffect(() => {
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    notificar(mudo ? 'Som desligado.' : 'Som ligado.');
  }, [mudo, notificar]);
  return null;
}

export default function App() {
  const { fase, avancar, voltar, primeiraFase, ultimaFase } = useNavegacao();
  const rodada = useRodada();
  const som = useSom();
  const faseProps = { avancar, voltar, primeiraFase, ultimaFase };

  // Falas de entrada de fase que não dependem do que acontece dentro dela.
  const falarRef = useRef(som.falar);
  falarRef.current = som.falar;
  const faseAnterior = useRef(fase);
  useEffect(() => {
    const anterior = faseAnterior.current;
    faseAnterior.current = fase;
    if (anterior === fase) return;
    // Só ao chegar vindo da abertura; voltar da rodada não repete a fala.
    if (fase === 'briefing' && anterior === 'abertura') {
      const id = window.setTimeout(() => falarRef.current('historia'), 2600);
      return () => window.clearTimeout(id);
    }
    if (fase === 'resultado') falarRef.current('resultado');
  }, [fase]);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.shiftKey && evento.key.toLowerCase() === 'r') rodada.reiniciar();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [rodada]);

  if (window.location.hash === '#vitrine') {
    return <Vitrine />;
  }

  return (
    <Palco>
      <GrimorioProvider aoNotificar={() => som.tocar('ping')}>
        <AvisoDeSom mudo={som.mudo} />
        <AmpliacaoProvider>
          <div className="relative h-full w-full">
            <Taverna />
            {fase !== 'abertura' && <Hud fase={fase} mudo={som.mudo} alternarMudo={som.alternarMudo} />}
            <TransicaoPagina chave={fase} aoVirar={() => som.tocar('pagina')}>
              <main className={fase === 'abertura' ? 'relative h-full' : 'relative h-full pt-14'}>
                {fase === 'abertura' && <F0Abertura {...faseProps} som={som} />}
                {fase === 'briefing' && <F1Briefing {...faseProps} som={som} />}
                {fase === 'rodada' && <F2Rodada {...faseProps} rodada={rodada} som={som} />}
                {fase === 'resultado' && <F3Resultado {...faseProps} estadoRodada={rodada.estado} />}
                {fase === 'artigos' && <F4Artigos {...faseProps} som={som} />}
                {fase === 'fusao' && <F5Fusao {...faseProps} som={som} />}
              </main>
            </TransicaoPagina>
          </div>
        </AmpliacaoProvider>
      </GrimorioProvider>
    </Palco>
  );
}
