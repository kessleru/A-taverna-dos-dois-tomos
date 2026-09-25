import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { conteudo, preenchido } from '../data/conteudo';
import { useFolhas } from '../engine/useFolhas';
import { CartaLendaria } from '../components/cartas/CartaLendaria';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { Faiscas } from '../components/ui/Faiscas';
import { Poeira } from '../components/ui/Poeira';
import { Chuva } from '../components/ui/Particulas';
import { NavFolhas } from '../components/ui/NavFolhas';
import { Icone } from '../components/ui/Icone';
import { OURO_E_BRASA, chuvaDeOuro } from '../components/ui/confete';
import { mola } from '../styles/movimento';
import { TREMOR, useTremor } from '../components/ui/Tremor';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

// O Taverneiro acenando na porta da taverna, na neve: a despedida.
const TAVERNEIRO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro-porta.webp`;
// Uma folha por aprendizado e a última com os créditos.
const TOTAL = conteudo.aprendizados.length + 1;

interface F5FusaoProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

// F5 — Aprendizados (03-historia.md §8): a lendária Aprendizados em destaque e
// os cinco aprendizados escritos a pena, um por folha, com a tinta brilhando
// em ouro. No fim, o Taverneiro se despede e os créditos sobem.
// Ao chegar na primeira folha, os dois tomos se fundem na lendária antes.
export function F5Fusao({ som, avancar, voltar, ultimaFase }: F5FusaoProps) {
  const { tocar } = som;
  const aoVirar = useCallback(() => tocar('pagina'), [tocar]);
  const { folha, ir } = useFolhas({ total: TOTAL, chave: 'sa-f5-folha', avancar, voltar, aoVirar });
  const creditos = folha === TOTAL - 1;
  const reduzido = useReducedMotion();
  const [fundindo, setFundindo] = useState(() => folha === 0 && !reduzido);
  const [veioDaFusao, setVeioDaFusao] = useState(false);
  const somRef = useRef(som);
  somRef.current = som;
  const falouAprendizados = useRef(false);

  // Ao aparecer o primeiro aprendizado (depois da fusão, se houver).
  useEffect(() => {
    if (fundindo || folha !== 0 || falouAprendizados.current) return;
    falouAprendizados.current = true;
    let cancelarFala = () => {};
    const id = window.setTimeout(() => (cancelarFala = somRef.current.falar('aprendizados', { esperarVez: true })), 600);
    return () => {
      window.clearTimeout(id);
      cancelarFala();
    };
  }, [fundindo, folha]);

  return (
    <section className="flex h-full flex-col gap-4 px-20 pb-5 pt-6">
      <div className="relative flex min-h-0 flex-1 items-center gap-16">
        {fundindo && (
          <Fusao
            som={som}
            aoTerminar={() => {
              setVeioDaFusao(true);
              setFundindo(false);
            }}
          />
        )}
        {/* A lendária da coluna só existe depois da fusão: antes, quem aparece é a
            do centro, que desliza até aqui. Um espaço vazio guarda o lugar dela. */}
        {fundindo ? (
          <div className="h-[655px] w-[468px] shrink-0" aria-hidden />
        ) : (
          <motion.div
            className="relative shrink-0"
            initial={veioDaFusao ? false : { scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={mola.impacto}
          >
            {/* Halo dourado atrás da lendária. */}
            <motion.div
              className="pointer-events-none absolute -inset-24 rounded-full bg-[radial-gradient(circle,rgb(232_182_74/0.45),transparent_65%)]"
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Poeira quantidade={18} semente={5} className="-inset-24" />
            <CartaLendaria />
          </motion.div>
        )}

        {!fundindo && (
          <motion.div className="flex h-full min-w-0 flex-1 flex-col justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {creditos ? <Creditos som={som} /> : <Aprendizados ate={folha} />}
          </motion.div>
        )}
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

// Distância do centro da área até o lugar da lendária na coluna da esquerda:
// metade da área (1760 / 2) menos metade da carta grande (468 / 2).
const DESLOCAMENTO_LENDARIA = -(880 - 234);

// Os dois tomos orbitam cada vez mais rápido e se fundem num clarão; a
// lendária nasce no centro e desliza para o seu lugar.
function Fusao({ som, aoTerminar }: { som: ReturnType<typeof useSom>; aoTerminar: () => void }) {
  const [fase, setFase] = useState<'orbita' | 'clarao' | 'assenta'>('orbita');
  const [artigoA, artigoB] = conteudo.artigos;
  const somRef = useRef(som);
  somRef.current = som;
  const aoTerminarRef = useRef(aoTerminar);
  aoTerminarRef.current = aoTerminar;
  const tremer = useTremor();
  const tremerRef = useRef(tremer);
  tremerRef.current = tremer;

  useEffect(() => {
    somRef.current.tocar('embaralhar');
    somRef.current.falar('fusao');
    const ids = [
      window.setTimeout(() => {
        setFase('clarao');
        tremerRef.current(TREMOR.forte);
        somRef.current.tocar('fanfarra');
        somRef.current.tocar('correntes-quebrando');
      }, 2300),
      window.setTimeout(() => setFase('assenta'), 3600),
      window.setTimeout(() => aoTerminarRef.current(), 4400),
    ];
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {fase === 'orbita' && (
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: 1080 }}
          transition={{ duration: 2.3, ease: [0.55, 0, 0.9, 0.6] }}
        >
          {[
            { artigo: artigoA, lado: -1 },
            { artigo: artigoB, lado: 1 },
          ].map(({ artigo, lado }) => (
            <motion.div
              key={artigo.id}
              className="absolute left-0 top-0"
              initial={{ x: lado * 460, scale: 1 }}
              animate={{ x: 0, scale: 0.35 }}
              transition={{ duration: 2.3, ease: 'easeIn' }}
            >
              {/* Centro da carta no eixo da órbita. */}
              <div className="-translate-x-1/2 -translate-y-1/2">
                <CartaArtigo artigo={artigo} tamanho="pequena" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {fase !== 'orbita' && (
        <>
          {fase === 'clarao' && (
            <>
              <motion.div
                className="absolute inset-[-200px] bg-[radial-gradient(circle,rgb(255_244_214),rgb(232_182_74/0.6)_30%,transparent_65%)]"
                initial={{ opacity: 1, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
              <Faiscas quantidade={20} raio={520} />
            </>
          )}
          <motion.div
            initial={{ scale: 0.3, rotate: -20, x: 0 }}
            animate={fase === 'assenta' ? { scale: 1, rotate: 0, x: DESLOCAMENTO_LENDARIA } : { scale: 1.1, rotate: 0, x: 0 }}
            transition={fase === 'assenta' ? { duration: 0.8, ease: 'easeInOut' } : mola.impacto}
            style={{ filter: 'drop-shadow(0 0 40px var(--ouro))' }}
          >
            <CartaLendaria />
          </motion.div>
        </>
      )}
    </div>
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
    <li className="relative flex items-start gap-4 font-texto text-[32px] leading-snug">
      {animar && <Chuva tipo="ouro" quantidade={10} janela={1.3} semente={numero * 7} />}
      <span className="w-10 shrink-0 font-titulo font-bold text-cera">{numero}.</span>
      <motion.span
        initial={animar ? { clipPath: 'inset(0 100% 0 0)', color: '#c8901c', textShadow: '0 0 14px rgb(232 182 74 / 0.9)' } : false}
        animate={{ clipPath: 'inset(0 0% 0 0)', color: 'var(--tinta)', textShadow: '0 0 0px rgb(232 182 74 / 0)' }}
        transition={{
          clipPath: { duration: 1.4, ease: 'easeInOut' },
          color: { delay: 1.2, duration: 1.2 },
          textShadow: { delay: 1.2, duration: 1.2 },
        }}
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
  const membros = conteudo.equipe.membros.filter(preenchido);
  const falou = useRef(false);

  useEffect(() => {
    if (falou.current) return;
    falou.current = true;
    som.falar('despedida');
    som.tocar('fanfarra');
    som.tocar('publico-comemora');
    if (!reduzido) chuvaDeOuro({ particleCount: 150, spread: 100, origin: { x: 0.65, y: 0.4 }, colors: OURO_E_BRASA });
  }, [som, reduzido]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-6">
        <img
          src={TAVERNEIRO}
          alt=""
          className="h-[270px] w-[180px] shrink-0 rounded-md border-4 border-ouro object-cover shadow-carta"
        />
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
            {membros.length > 0 && <Bloco titulo="Equipe">{membros.join(' · ')}</Bloco>}
            <Bloco titulo="Referências">
              {conteudo.artigos.map((artigo) => (
                <p key={artigo.id} className="mb-3 text-[22px]">
                  {artigo.referenciaABNT}
                </p>
              ))}
            </Bloco>
            <Bloco titulo="Arte e som">
              Ícones de game-icons.net (CC BY 3.0). Partículas e sons de interface de Kenney (CC0). Ilustrações, molduras,
              texturas, música e efeitos: créditos completos em public/assets/CREDITOS.md.
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
