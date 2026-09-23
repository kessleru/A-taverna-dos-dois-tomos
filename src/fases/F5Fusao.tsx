import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { conteudo } from '../data/conteudo';
import { useFolhas } from '../engine/useFolhas';
import { CartaLendaria } from '../components/cartas/CartaLendaria';
import { NavFolhas } from '../components/ui/NavFolhas';
import { Icone } from '../components/ui/Icone';
import { mola } from '../styles/movimento';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const TAVERNEIRO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro.webp`;
// Uma folha por aprendizado e a última com os créditos.
const TOTAL = conteudo.aprendizados.length + 1;

interface F5FusaoProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

// F5 — Aprendizados (03-historia.md §8): a lendária Aprendizados em destaque e
// os cinco aprendizados escritos a pena, um por folha, com a tinta brilhando
// em ouro. No fim, o Taverneiro se despede e os créditos sobem.
// A fusão animada dos dois tomos ficou para depois (00-visao-geral.md §7).
export function F5Fusao({ som, avancar, voltar, ultimaFase }: F5FusaoProps) {
  const aoVirar = useCallback(() => som.tocar('pagina'), [som]);
  const { folha, ir } = useFolhas({ total: TOTAL, chave: 'sa-f5-folha', avancar, voltar, aoVirar });
  const creditos = folha === TOTAL - 1;

  return (
    <section className="flex h-full flex-col gap-4 px-20 pb-5 pt-6">
      <div className="flex min-h-0 flex-1 items-center gap-16">
        <motion.div
          className="relative shrink-0"
          initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={mola.impacto}
        >
          {/* Halo dourado atrás da lendária. */}
          <motion.div
            className="pointer-events-none absolute -inset-24 rounded-full bg-[radial-gradient(circle,rgb(232_182_74/0.45),transparent_65%)]"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <CartaLendaria />
        </motion.div>

        <div className="flex h-full min-w-0 flex-1 flex-col justify-center">
          {creditos ? <Creditos som={som} /> : <Aprendizados ate={folha} />}
        </div>
      </div>

      <NavFolhas
        folha={folha}
        total={TOTAL}
        ir={ir}
        rotulo="Aprendizados"
        rotuloAvancar={folha === TOTAL - 2 ? 'Créditos' : 'Continuar'}
        mostrarAvancar={!(creditos && ultimaFase)}
      />
    </section>
  );
}

function Aprendizados({ ate }: { ate: number }) {
  return (
    <div className="pergaminho-sombra">
      <div className="pergaminho pergaminho-aviso flex flex-col gap-5">
        <h1 className="font-titulo text-[52px] font-bold leading-none">Aprendizados</h1>
        <ol className="flex flex-col gap-4">
          {conteudo.aprendizados.slice(0, ate + 1).map((item, i) => (
            <Linha key={item} numero={i + 1} texto={item} nova={i === ate} />
          ))}
        </ol>
      </div>
    </div>
  );
}

// Escrita a pena: o texto se revela da esquerda para a direita e a tinta
// esfria de ouro para marrom.
function Linha({ numero, texto, nova }: { numero: number; texto: string; nova: boolean }) {
  const reduzido = useReducedMotion();
  const animar = nova && !reduzido;
  return (
    <li className="flex items-start gap-4 font-texto text-[32px] leading-snug">
      <span className="w-10 shrink-0 font-titulo font-bold text-cera">{numero}.</span>
      <motion.span
        initial={animar ? { clipPath: 'inset(0 100% 0 0)', color: '#c8901c', textShadow: '0 0 14px rgb(232 182 74 / 0.9)' } : false}
        animate={{ clipPath: 'inset(0 0% 0 0)', color: 'var(--tinta)', textShadow: '0 0 0px rgb(232 182 74 / 0)' }}
        transition={{ clipPath: { duration: 1.4, ease: 'easeInOut' }, color: { delay: 1.2, duration: 1.2 }, textShadow: { delay: 1.2, duration: 1.2 } }}
      >
        {texto}
      </motion.span>
      {animar && (
        <motion.span
          className="shrink-0 text-tinta/70"
          initial={{ opacity: 1, x: -40 }}
          animate={{ opacity: 0, x: 0 }}
          transition={{ duration: 1.6 }}
          aria-hidden
        >
          <Icone nome="quill-ink" className="h-10 w-10" />
        </motion.span>
      )}
    </li>
  );
}

function Creditos({ som }: { som: ReturnType<typeof useSom> }) {
  const reduzido = useReducedMotion();
  const falou = useRef(false);

  useEffect(() => {
    if (falou.current) return;
    falou.current = true;
    som.falar('despedida');
    som.tocar('fanfarra');
    som.tocar('publico-comemora');
    if (!reduzido) confetti({ particleCount: 150, spread: 100, origin: { x: 0.65, y: 0.4 }, colors: ['#E8B64A', '#F3E6C8', '#FF7A2F'] });
  }, [som, reduzido]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-6">
        <img src={TAVERNEIRO} alt="" className="h-[140px] w-[140px] shrink-0 rounded-full border-4 border-ouro object-cover object-top shadow-carta" />
        <p className="font-texto text-[40px] font-bold italic leading-tight text-ouro [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]">
          “A lenda continua. Obrigado por puxarem uma cadeira.”
        </p>
      </div>
      {/* Os créditos sobem como um pergaminho. */}
      <div className="pergaminho-sombra min-h-0 flex-1">
        <div className="pergaminho relative h-full overflow-hidden px-14">
          <motion.div
            className="flex flex-col gap-8 py-10 text-center"
            initial={reduzido ? false : { y: '60%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 6, ease: 'easeOut' }}
          >
            <Bloco titulo="Equipe">{conteudo.equipe.membros.join(' · ')}</Bloco>
            <Bloco titulo="Referências">
              {conteudo.artigos.map((artigo) => (
                <p key={artigo.id} className="mb-3 text-[22px]">
                  {artigo.referenciaABNT}
                </p>
              ))}
            </Bloco>
            <Bloco titulo="Arte e som">
              Ícones de game-icons.net (CC BY 3.0). Ilustrações, molduras, texturas, música e efeitos: créditos completos em
              public/assets/CREDITOS.md.
            </Bloco>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-titulo text-[30px] font-bold text-cera">{titulo}</p>
      <div className="font-texto text-[24px] leading-snug">{children}</div>
    </div>
  );
}
