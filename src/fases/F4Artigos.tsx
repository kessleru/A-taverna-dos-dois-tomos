import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { conteudo, rotulosAtributos, type Atributo } from '../data/conteudo';
import { briefing, comparacao } from '../data/rodada';
import { retratosNarradores } from '../data/artes';
import { useFolhas } from '../engine/useFolhas';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { NavFolhas } from '../components/ui/NavFolhas';
import { ArtePintada } from '../components/ui/ArtePintada';
import { mola } from '../styles/movimento';
import { useSonsEmSequencia } from '../engine/useSonsEmSequencia';
import { TREMOR, useTremorAoMontar } from '../components/ui/Tremor';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const ATRIBUTOS = Object.keys(rotulosAtributos) as Atributo[];
const PASSOS = ['veredito', 'semelhancas', 'diferencas', 'atributos', 'proposicao', 'tema'] as const;
type Passo = (typeof PASSOS)[number];
const TITULOS: Record<Passo, string> = {
  veredito: 'O veredito',
  semelhancas: 'Onde os tomos concordam',
  diferencas: 'Onde os tomos divergem',
  atributos: 'Atributos dos tomos',
  proposicao: 'A proposição do Tomo B',
  tema: 'Tema central',
};
const COR_TOMO = { A: 'var(--tomo-a)', B: 'var(--tomo-b)' } as const;
const PX_POR_PONTO = 34;

interface F4ArtigosProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

// F4 — Confronto dos Tomos (03-historia.md §7): os dois tomos frente a frente,
// com um item da comparação por folha.
export function F4Artigos({ som, avancar, voltar }: F4ArtigosProps) {
  const { tocar } = som;
  const aoVirar = useCallback(() => tocar('pagina'), [tocar]);
  const { folha, ir } = useFolhas({ total: PASSOS.length, chave: 'sa-f4-folha', avancar, voltar, aoVirar });
  const passo = PASSOS[folha];
  const juntos = passo === 'tema';
  const somRef = useRef(som);
  somRef.current = som;

  useEffect(() => {
    somRef.current.falar('confronto');
  }, []);

  return (
    <section className="flex h-full flex-col gap-4 px-16 pb-5 pt-6">
      <h1 className="titulo-ouro text-center font-titulo text-[56px] font-bold leading-none">Confronto dos Tomos</h1>

      <div className="flex min-h-0 flex-1 items-center gap-8">
        <Tomo id="A" juntos={juntos} />
        <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={passo}
              className="flex w-full flex-col items-center gap-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              {passo !== 'tema' && (
                <h2 className="filigrana font-titulo text-[40px] font-bold text-pergaminho [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]">{TITULOS[passo]}</h2>
              )}
              {passo === 'veredito' && <Veredito som={som} />}
              {passo === 'semelhancas' && <Semelhancas />}
              {passo === 'diferencas' && <Diferencas />}
              {passo === 'atributos' && <Atributos />}
              {passo === 'proposicao' && <Proposicao />}
              {passo === 'tema' && <TemaCentral />}
            </motion.div>
          </AnimatePresence>
        </div>
        <Tomo id="B" juntos={juntos} />
      </div>

      <NavFolhas folha={folha} total={PASSOS.length} ir={ir} rotulo="Itens do confronto" />
    </section>
  );
}

// Um tomo de cada lado; no tema central eles se inclinam um para o outro.
function Tomo({ id, juntos }: { id: 'A' | 'B'; juntos: boolean }) {
  const artigo = conteudo.artigos.find((a) => a.id === id)!;
  const narrador = briefing.tomos.narradores[id];
  const lado = id === 'A' ? 1 : -1;
  return (
    <motion.div
      className="flex w-[330px] shrink-0 flex-col items-center gap-3"
      animate={juntos ? { rotate: 7 * lado, x: 50 * lado, y: -10 } : { rotate: 0, x: 0, y: 0 }}
      transition={mola.suave}
    >
      <CartaArtigo artigo={artigo} tamanho="pequena" />
      <p className="font-titulo text-[28px] font-bold leading-none" style={{ color: COR_TOMO[id] }}>
        {narrador.nome}
      </p>
      <p className="font-texto text-[20px] italic leading-none text-pergaminho/75">{narrador.autores}</p>
    </motion.div>
  );
}

function Veredito({ som }: { som: ReturnType<typeof useSom> }) {
  const reduzido = useReducedMotion();
  useTremorAoMontar(TREMOR.leve, 350);
  const { tocar, falar } = som;
  useEffect(() => {
    const id = window.setTimeout(() => tocar('selo'), reduzido ? 0 : 350);
    // Depois do "frente a frente" da entrada da fase.
    // Espera a vez: se o "frente a frente" ainda estiver sendo dito, não corta.
    let cancelarFala = () => {};
    const fala = window.setTimeout(() => (cancelarFala = falar('veredito', { esperarVez: true })), 6400);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(fala);
      cancelarFala();
    };
    // Só as funções (estáveis): ligar/desligar o som não repete o selo.
  }, [tocar, falar, reduzido]);

  return (
    <>
      {/* Selo de cera batendo na mesa. */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={reduzido ? false : { scale: 3, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 1, rotate: -6 }}
        transition={{ ...mola.impacto, delay: 0.1 }}
      >
        <span className="selo-pintado">
          <ArtePintada nome="selo" className="h-[220px] w-[220px]" />
        </span>
        {/* Fita de cera atravessando o selo com o veredito. */}
        <span className="fita-sombra absolute">
          <span className="fita block font-titulo text-[30px] font-bold uppercase tracking-[0.12em]">Complementares</span>
        </span>
      </motion.div>
      <div className="pergaminho-sombra max-w-[980px]">
        <p className="pergaminho pergaminho-nota font-texto text-[30px] leading-snug">{conteudo.vereditoTexto}</p>
      </div>
    </>
  );
}

// Um fio de ouro sai de cada tomo e se encontra em cada semelhança.
function Semelhancas() {
  useSonsEmSequencia(comparacao.semelhancas.map((_, i) => ['ping', 650 + i * 350]));
  return (
    <div className="flex w-full flex-col gap-7">
      {comparacao.semelhancas.map((item, i) => (
        <div key={item} className="flex items-center">
          <Fio lado="esquerda" atraso={0.2 + i * 0.35} />
          <motion.div
            className="pergaminho-sombra shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.35 }}
          >
            <p className="pergaminho pergaminho-etiqueta w-[600px] text-center font-texto text-[30px] font-medium leading-snug">{item}</p>
          </motion.div>
          <Fio lado="direita" atraso={0.2 + i * 0.35} />
        </div>
      ))}
    </div>
  );
}

function Fio({ lado, atraso }: { lado: 'esquerda' | 'direita'; atraso: number }) {
  return (
    <motion.span
      className="h-1.5 flex-1 rounded-full bg-ouro shadow-[0_0_12px_var(--ouro)]"
      style={{ transformOrigin: lado === 'esquerda' ? 'left center' : 'right center' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: atraso, duration: 0.5, ease: 'easeOut' }}
    />
  );
}

// Cada lado da diferença sai do seu tomo.
function Diferencas() {
  // Um deslizar só para as quatro linhas; um por linha soava como puxar carta sem parar.
  useSonsEmSequencia([['carta-deslizar', 150]]);
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-5 gap-y-4">
      {comparacao.diferencas.map((linha, i) => (
        <LinhaDiferenca key={linha.tema} tema={linha.tema} a={linha.A} b={linha.B} atraso={0.15 + i * 0.3} />
      ))}
    </div>
  );
}

function LinhaDiferenca({ tema, a, b, atraso }: { tema: string; a: string; b: string; atraso: number }) {
  // Placas de ferro com o filete na cor de cada tomo.
  const placa = 'placa-ferro px-6 py-3 font-texto text-[26px] leading-snug text-pergaminho';
  return (
    <>
      <motion.p
        className={`${placa} text-right`}
        style={{ '--acento': COR_TOMO.A } as CSSProperties}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: atraso, ...mola.carta }}
      >
        {a}
      </motion.p>
      <motion.p
        className="w-[150px] text-center font-titulo text-[26px] font-bold text-ouro [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: atraso }}
      >
        {tema}
      </motion.p>
      <motion.p
        className={placa}
        style={{ '--acento': COR_TOMO.B } as CSSProperties}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: atraso, ...mola.carta }}
      >
        {b}
      </motion.p>
    </>
  );
}

// As gemas de atributo crescem em barras espelhadas: A para a esquerda, B para a direita.
function Atributos() {
  useSonsEmSequencia(ATRIBUTOS.map((_, i) => ['tic', 250 + i * 150]));
  const [artigoA, artigoB] = conteudo.artigos;
  return (
    <div className="flex w-full flex-col gap-4">
      {ATRIBUTOS.map((atributo, i) => {
        const a = artigoA.atributos[atributo].valor;
        const b = artigoB.atributos[atributo].valor;
        return (
          <div key={atributo} className="grid grid-cols-[1fr_210px_1fr] items-center gap-3">
            <div className="flex items-center justify-end gap-3">
              <Valor valor={a} id="A" />
              <Barra valor={a} id="A" atraso={0.2 + i * 0.15} />
            </div>
            <span className="text-center font-titulo text-[24px] font-bold text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]">
              {rotulosAtributos[atributo]}
            </span>
            <div className="flex items-center gap-3">
              <Barra valor={b} id="B" atraso={0.2 + i * 0.15} />
              <Valor valor={b} id="B" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Barra({ valor, id, atraso }: { valor: number; id: 'A' | 'B'; atraso: number }) {
  return (
    <motion.span
      className={`barra-forjada h-7 ${id === 'A' ? '[clip-path:polygon(14px_0,100%_0,100%_100%,14px_100%,0_50%)]' : '[clip-path:polygon(0_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,0_100%)]'}`}
      style={{
        width: valor * PX_POR_PONTO,
        background: `linear-gradient(180deg, color-mix(in srgb, ${COR_TOMO[id]} 70%, white), ${COR_TOMO[id]} 50%, color-mix(in srgb, ${COR_TOMO[id]} 60%, black))`,
        transformOrigin: id === 'A' ? 'right center' : 'left center',
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: atraso, type: 'spring', stiffness: 90, damping: 18 }}
    />
  );
}

function Valor({ valor, id }: { valor: number; id: 'A' | 'B' }) {
  return (
    <span
      className="medalhao m-1 flex h-12 w-12 shrink-0 items-center justify-center bg-madeira-profunda font-titulo text-[24px] font-bold text-pergaminho"
      style={{ '--gema': COR_TOMO[id] } as CSSProperties}
    >
      {valor}
    </span>
  );
}

// A Cronista lembra a etapa 1: o que estava à mão virou identidade.
function Proposicao() {
  useSonsEmSequencia([['livro-abrir', 0]]);
  const { citacao, lembranca } = conteudo.proposicaoB;
  return (
    <div className="flex max-w-[1000px] flex-col items-center gap-7">
      <div className="flex items-center gap-8">
        <img
          src={retratosNarradores.B}
          alt=""
          className="medalhao m-2 h-[170px] w-[170px] shrink-0 object-cover"
          style={{ '--gema': COR_TOMO.B } as CSSProperties}
        />
        <blockquote className="font-texto text-[46px] font-bold italic leading-tight text-ouro [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]">
          “{citacao}”
          <footer className="mt-2 font-titulo text-[24px] not-italic text-pergaminho/80">{briefing.tomos.narradores.B.nome}</footer>
        </blockquote>
      </div>
      <motion.div className="pergaminho-sombra" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <p className="pergaminho pergaminho-nota font-texto text-[30px] leading-snug">{lembranca}</p>
      </motion.div>
    </div>
  );
}

function TemaCentral() {
  useSonsEmSequencia([['vitoria', 300]]);
  return (
    <motion.p
      className="titulo-ouro max-w-[1000px] text-center font-titulo text-[58px] font-bold leading-tight"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, ...mola.suave }}
    >
      {conteudo.temaCentral}
    </motion.p>
  );
}
