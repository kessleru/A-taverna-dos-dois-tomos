import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { briefing } from '../../data/rodada';
import { conteudo } from '../../data/conteudo';
import { proximoEstadoTomo, type EstadoTomo } from '../../engine/tomos';
import { CARACTERES_POR_SEGUNDO } from '../../engine/digitacao';
import { TRAVA_PADRAO_MS, travar } from '../../engine/trava';
import { CartaArtigo } from '../../components/cartas/CartaArtigo';
import { Pergaminho } from '../../components/ui/Pergaminho';
import { useGrimorio } from '../../components/ui/NotificacoesGrimorio';
import type { useSom } from '../../engine/useSom';
import { usePrimeiraVez } from '../../engine/vistos';

type IdTomo = 'A' | 'B';

// Folga para o aviso do Grimório entrar antes de começar a ser escrito.
const ENTRADA_AVISO_MS = 300;

// Cartas nas pontas do quadro e a fala de cada narrador ao lado, espelhadas.
// As cartas ficam um pouco menores que o padrão (zoom 0,8 sobre o 1,8 geral)
// para caberem as duas com as falas na largura do quadro.
const LAYOUT: Record<IdTomo, { carta: number; nota: number; anguloNota: number }> = {
  A: { carta: 70, nota: 480, anguloNota: -1.5 },
  B: { carta: 1228, nota: 850, anguloNota: 1.2 },
};

export function FolhaTomos({ som }: { som: ReturnType<typeof useSom> }) {
  const { tomos } = briefing;
  const { notificar } = useGrimorio();
  const [estados, setEstados] = useState<Record<IdTomo, EstadoTomo>>({ A: 'fechado', B: 'fechado' });
  // Como abrir os tomos: só na primeira visita à folha, e some quando a
  // turma já chegou aos detalhes de um deles.
  const primeiraVisita = usePrimeiraVez('briefing:tomos');
  const viuDetalhes = useRef(false);
  if (estados.A === 'detalhes' || estados.B === 'detalhes') viuDetalhes.current = true;

  const clicar = useCallback(
    (id: IdTomo) => {
      const atual = estados[id];
      const proximo = proximoEstadoTomo(atual);
      if (atual === 'fechado') {
        som.tocar('virar-carta');
        const artigo = conteudo.artigos.find((a) => a.id === id);
        if (artigo) {
          const [primeiro, segundo] = artigo.numeros;
          const aviso = `Tomo ${id}: ${primeiro.valor} ${primeiro.rotulo}; ${segundo.valor} ${segundo.rotulo}.`;
          notificar(aviso);
          // A outra carta só abre depois que o Grimório termina de escrever
          // este aviso, senão os dois se atropelam no canto.
          travar(Math.max(TRAVA_PADRAO_MS, ENTRADA_AVISO_MS + (aviso.length / CARACTERES_POR_SEGUNDO) * 1000));
        }
      } else {
        som.tocar('pagina');
      }
      // Só um tomo mostra os detalhes por vez: eles ocupam o centro do quadro.
      setEstados((e) => {
        const novo = { ...e, [id]: proximo };
        const outro: IdTomo = id === 'A' ? 'B' : 'A';
        if (proximo === 'detalhes' && novo[outro] === 'detalhes') novo[outro] = 'aberto';
        return novo;
      });
    },
    [estados, som, notificar],
  );

  // Teclas 1 e 2 fazem o mesmo que clicar no tomo A e no B.
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === '1') clicar('A');
      else if (evento.key === '2') clicar('B');
      else if (evento.key === 'Escape') setEstados((e) => ({ A: e.A === 'detalhes' ? 'aberto' : e.A, B: e.B === 'detalhes' ? 'aberto' : e.B }));
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [clicar]);

  const emDetalhe = (['A', 'B'] as IdTomo[]).find((id) => estados[id] === 'detalhes');

  return (
    <>
      <Pergaminho variante="etiqueta" angulo={-2} className="absolute" style={{ left: 60, top: 26 }}>
        <h2 className="font-titulo text-[40px] font-bold leading-none">{tomos.titulo}</h2>
      </Pergaminho>

      {conteudo.artigos.map((artigo) => {
        const id = artigo.id as IdTomo;
        const narrador = tomos.narradores[id];
        const posicao = LAYOUT[id];
        return (
          <div key={id}>
            {/* O zoom fica num div interno: no mesmo elemento ele também escalaria o left/top. */}
            <div className="absolute" style={{ left: posicao.carta, top: 150 }}>
              <div style={{ zoom: 0.8 }}>
                <CartaArtigo artigo={artigo} virada={estados[id] !== 'fechado'} onClick={() => clicar(id)} />
              </div>
            </div>
            <AnimatePresence>
              {estados[id] !== 'fechado' && (
                <Pergaminho
                  key="fala"
                  angulo={posicao.anguloNota}
                  className="absolute"
                  style={{ left: posicao.nota, top: 190, width: 360 }}
                >
                  <p className="font-texto text-[30px] italic leading-snug">“{narrador.fala}”</p>
                  <p className="mt-4 font-titulo text-[26px] font-bold leading-tight">{narrador.nome}</p>
                  <p className="font-texto text-[22px] leading-tight">{narrador.autores}</p>
                </Pergaminho>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <p className="absolute bottom-6 left-0 right-0 text-center font-texto text-[24px] italic text-pergaminho/70">
        {primeiraVisita && !viuDetalhes.current && tomos.dica}
      </p>

      <AnimatePresence>
        {emDetalhe && <DetalhesTomo key={emDetalhe} id={emDetalhe} aoFechar={() => clicar(emDetalhe)} />}
      </AnimatePresence>
    </>
  );
}

// Estratégia e solução do artigo num aviso grande sobre o centro do quadro.
function DetalhesTomo({ id, aoFechar }: { id: IdTomo; aoFechar: () => void }) {
  const artigo = conteudo.artigos.find((a) => a.id === id);
  if (!artigo) return null;
  return (
    <div className="absolute inset-0 z-20 cursor-pointer bg-madeira-profunda/60" onClick={aoFechar}>
      <Pergaminho variante="aviso" angulo={-0.5} className="absolute" style={{ left: 150, top: 60, width: 1370 }}>
        <h2 className="font-titulo text-[44px] font-bold leading-tight">
          Tomo {id}: {artigo.tituloCurto}
        </h2>
        <div className="ornamento my-4" aria-hidden>
          ❦
        </div>
        <div className="grid grid-cols-2 gap-12">
          <section>
            <h3 className="font-titulo text-[32px] font-bold">Estratégia</h3>
            <p className="mt-2 font-texto text-[28px] leading-snug">{artigo.estrategia}</p>
          </section>
          <section>
            <h3 className="font-titulo text-[32px] font-bold">Solução</h3>
            <p className="mt-2 font-texto text-[28px] leading-snug">{artigo.solucao}</p>
          </section>
        </div>
      </Pergaminho>
    </div>
  );
}
