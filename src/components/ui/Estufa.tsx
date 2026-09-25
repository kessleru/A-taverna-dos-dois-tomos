import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { briefing, etapas, eventos } from '../../data/rodada';
import { conteudo } from '../../data/conteudo';
import { retratosNarradores } from '../../data/artes';
import { CartaDecisao } from '../cartas/CartaDecisao';
import { CartaArtigo } from '../cartas/CartaArtigo';
import { CartaLendaria } from '../cartas/CartaLendaria';
import { CartaEvento } from '../cartas/CartaEvento';
import { VersoCarta } from '../cartas/VersoCarta';
import { CartaDesafio } from '../rodada/CartaDesafio';
import { LeituraMapa } from '../rodada/LeituraMapa';
import { Orbes } from '../hud/Orbes';
import { Tapecaria } from '../hud/Tapecaria';
import { QuadroMadeira } from './QuadroMadeira';
import { Pergaminho } from './Pergaminho';

const TAVERNEIRO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro.webp`;
const TAVERNEIRO_PORTA = `${import.meta.env.BASE_URL}assets/personagens/taverneiro-porta.webp`;
const QUADROS_DE_FOLGA = 4;

type IdDecisao = 'planejar' | 'adaptar' | 'bricolagem' | 'combinar';

// Espera `n` quadros: o bastante para o navegador pintar e rasterizar a estufa.
export function esperarQuadros(n: number): Promise<void> {
  return new Promise((resolve) => {
    const passo = (restantes: number) => (restantes <= 0 ? resolve() : requestAnimationFrame(() => passo(restantes - 1)));
    passo(n);
  });
}

// Estufa de aquecimento: enquanto a tela de carregamento cobre o palco, cada
// carta, arte, retrato e textura do jogo é montada uma vez, no tamanho em que
// aparece. O navegador decodifica as imagens na escala certa, rasteriza
// molduras e sombras e compila o código dos componentes aqui, e não no meio da
// partida (a primeira votação, o primeiro evento...). Fica sob a tela de
// carregamento, que é opaca, e sai antes de ela começar a sumir.
export function Estufa({ aoAquecer }: { aoAquecer: () => void }) {
  useEffect(() => {
    let ativo = true;
    esperarQuadros(QUADROS_DE_FOLGA).then(() => {
      if (ativo) aoAquecer();
    });
    return () => {
      ativo = false;
    };
    // Um aquecimento só, ao montar.
  }, []);

  return (
    // Sem animação de entrada: tudo já no estado final, que é o que vai para a tela.
    <MotionConfig reducedMotion="always">
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        {/* Tudo empilhado no canto do palco: fora da área visível o navegador
            não rasterizaria nada. */}
        <div className="grid [&>*]:[grid-area:1/1]">
          {briefing.jeitosDeDecidir.cartas.map((carta) =>
            (['grande', 'pequena'] as const).map((tamanho) => (
              <CartaDecisao
                key={`${carta.id}-${tamanho}`}
                id={carta.id as IdDecisao}
                nome={carta.nome}
                teoria={carta.teoria}
                resumo={carta.resumo}
                tamanho={tamanho}
                trancada={carta.id === 'combinar' && tamanho === 'pequena'}
              />
            )),
          )}
          {conteudo.artigos.map((artigo) =>
            (['grande', 'pequena'] as const).map((tamanho) => <CartaArtigo key={`${artigo.id}-${tamanho}`} artigo={artigo} tamanho={tamanho} />),
          )}
          <CartaLendaria />
          <VersoCarta corPrincipal="var(--tomo-a)" />
          {etapas.map((etapa) => (
            <CartaDesafio key={etapa.id} etapa={etapa} />
          ))}
          {etapas.map((etapa) => (
            <LeituraMapa key={`leitura-${etapa.id}`} etapa={etapa} opcoes={['planejar', 'adaptar']} />
          ))}
          {eventos.flatMap((evento) =>
            [true, false].map((sucesso) => (
              <CartaEvento
                key={`${evento.nome}-${sucesso}`}
                depoisDaEtapa={evento.depoisDaEtapa}
                nome={evento.nome}
                desfecho={sucesso ? evento.seSim : evento.seNao}
                sucesso={sucesso}
              />
            )),
          )}
          <Orbes ind={{ caixa: 50, clientes: 50, moral: 12 }} />
          <Tapecaria canvas={{}} />
          <QuadroMadeira className="h-[300px] w-[600px]">
            <Pergaminho variante="aviso">Estufa</Pergaminho>
          </QuadroMadeira>
          {/* Retratos nos tamanhos do balão, da Crônica, do Confronto, das regras e da despedida. */}
          {[104, 132, 170, 400].map((lado) => (
            <img key={lado} src={TAVERNEIRO} alt="" className="object-cover" style={{ width: lado, height: lado }} />
          ))}
          {(['A', 'B'] as const).flatMap((id) =>
            [132, 170].map((lado) => <img key={`${id}-${lado}`} src={retratosNarradores[id]} alt="" className="object-cover" style={{ width: lado, height: lado }} />),
          )}
          <img src={TAVERNEIRO_PORTA} alt="" className="h-[270px] w-[180px] object-cover" />
        </div>
      </div>
    </MotionConfig>
  );
}
