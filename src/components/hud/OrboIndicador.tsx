import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { animate, AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { emAlerta, nivelLiquido } from '../../engine/indicador';
import { Icone } from '../ui/Icone';
import { Bolhas } from '../ui/Particulas';
import { mola } from '../../styles/movimento';

const ORBE = `${import.meta.env.BASE_URL}assets/ui/orbe.webp`;
// Vidro do orbe pintado: círculo de raio 35,7% centrado na imagem.
const RAIO_VIDRO = 35.7;
const FUNDO_VIDRO = 50 + RAIO_VIDRO;
const ALTURA_VIDRO = RAIO_VIDRO * 2;
const TOPO_VIDRO = 50 - RAIO_VIDRO;

// Ondas do líquido, da de trás para a da frente. Períodos diferentes e
// sentidos opostos fazem a superfície parecer viva sem nunca se repetir igual
// ao olho; cada uma, sozinha, fecha o loop certinho (desliza um período).
const ONDAS = [
  { periodo: 62.5, amplitude: 5.5, fase: 0.35, duracao: 3.4, inverte: true, opacidade: 0.55, brilho: false },
  { periodo: 50, amplitude: 3.8, fase: 0, duracao: 2.2, inverte: false, opacidade: 1, brilho: true },
];
// Largura do trecho desenhado (em % do vidro): cobre o vidro + um período.
const ONDA_LARGURA = 200;
// Folga acima da superfície para as cristas.
const ONDA_TOPO = 8;
const BOLHAS = [
  { x: 24, lado: 7, duracao: 3.1, fase: 0 },
  { x: 47, lado: 5, duracao: 2.4, fase: 0.55 },
  { x: 63, lado: 8, duracao: 3.8, fase: 0.3 },
  { x: 76, lado: 4, duracao: 2.7, fase: 0.8 },
];

// Crista em y = 0, vale em +A, período P: curvas quadráticas encadeadas (Q + T)
// que desenham um seno. Começa em x = -P para a fase não abrir buraco.
function pontosOnda(periodo: number, amplitude: number, fase: number): string {
  const inicio = -periodo - fase * periodo;
  let d = `M ${inicio} ${amplitude / 2} Q ${inicio + periodo / 4} ${-amplitude / 2} ${inicio + periodo / 2} ${amplitude / 2}`;
  for (let x = inicio + periodo; x <= ONDA_LARGURA + periodo; x += periodo / 2) d += ` T ${x} ${amplitude / 2}`;
  return d;
}

function caminhoOnda(periodo: number, amplitude: number, fase: number): string {
  return `${pontosOnda(periodo, amplitude, fase)} V 100 H ${-periodo * 2} Z`;
}

function linhaOnda(periodo: number, amplitude: number, fase: number): string {
  return pontosOnda(periodo, amplitude, fase);
}

interface OrboIndicadorProps {
  rotulo: string;
  icone: string;
  valor: number;
  cor: string;
}

interface Flutuante {
  id: number;
  delta: number;
}

// Globo de vidro do HUD (01-tema-e-hud.md §7): o líquido na cor do indicador
// sobe e desce com o valor e ondula; ganhos e perdas saem flutuando do globo.
export function OrboIndicador({ rotulo, icone, valor, cor }: OrboIndicadorProps) {
  const reduzido = useReducedMotion();
  const alerta = emAlerta(valor);
  const idSombra = `sombra-liquido-${useId().replace(/:/g, '')}`;
  const topoLiquido = FUNDO_VIDRO - nivelLiquido(valor) * ALTURA_VIDRO;

  const valorAnterior = useRef(valor);
  const proximoId = useRef(0);
  const [flutuantes, setFlutuantes] = useState<Flutuante[]>([]);

  // O número conta até o valor novo (odômetro), sem re-render: o texto é um
  // MotionValue arredondado que o framer escreve direto no DOM.
  const contagem = useMotionValue(valor);
  const numero = useTransform(contagem, (v) => Math.round(v));
  // O líquido chacoalha quando o valor muda: inclina para o lado do tranco e
  // assenta balançando. Controle imperativo, para não remontar as ondas (o
  // loop delas recomeçaria e daria um salto).
  const chacoalho = useAnimationControls();

  useEffect(() => {
    const delta = valor - valorAnterior.current;
    valorAnterior.current = valor;
    if (delta === 0) return;
    const conta = animate(contagem, valor, { duration: reduzido ? 0 : 0.9, ease: [0.2, 0.7, 0.3, 1] });
    if (!reduzido) {
      const lado = delta > 0 ? 1 : -1;
      const forca = Math.min(1, Math.abs(delta) / 20);
      chacoalho.start({
        rotate: [0, lado * (6 + 8 * forca), -lado * (4 + 4 * forca), lado * 2, 0],
        y: ['0%', `${-6 * forca * lado}%`, `${3 * forca * lado}%`, '0%', '0%'],
        transition: { duration: 1.3, times: [0, 0.18, 0.45, 0.72, 1], ease: 'easeOut' },
      });
    }
    const id = proximoId.current++;
    setFlutuantes((f) => [...f, { id, delta }]);
    const tempo = setTimeout(() => setFlutuantes((f) => f.filter((x) => x.id !== id)), 1500);
    return () => {
      clearTimeout(tempo);
      conta.stop();
    };
  }, [valor]);

  return (
    <div className="relative flex w-[136px] flex-col items-center" aria-label={`${rotulo}: ${valor}`}>
      <div className="relative h-32 w-32 rounded-full">
        {/* Alerta: brilho vermelho que pulsa só na opacidade, no compositor. */}
        {alerta && <span className="brilho-pulsante brilho-rapido rounded-full shadow-[0_0_28px_6px_rgb(224_55_74/0.8)]" aria-hidden />}
        <img src={ORBE} alt="" draggable={false} className="absolute inset-0 h-full w-full" />
        {/* Vidro recortado no círculo pintado: fundo escuro, líquido e reflexo.
            Tudo em camadas HTML: a onda anda por CSS e o nível sobe por
            transform, no compositor. Antes o SVG inteiro era repintado a cada
            quadro, nos três orbes, durante a rodada toda. */}
        <div
          className="absolute overflow-hidden rounded-full"
          style={{ left: `${TOPO_VIDRO}%`, top: `${TOPO_VIDRO}%`, width: `${ALTURA_VIDRO}%`, height: `${ALTURA_VIDRO}%` }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[#140d08] opacity-90" />
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ y: `${((topoLiquido - TOPO_VIDRO) / ALTURA_VIDRO) * 100}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          >
            {/* O líquido balança devagar (sobe/desce e inclina em vaivém), e cada
                onda desliza exatamente um período em loop linear: o fim de um
                ciclo é idêntico ao começo, então não há corte. Só transform,
                no compositor. Unidades: 1 = 1% da largura do vidro. */}
            <motion.div className="absolute inset-0 origin-[50%_60%]" animate={chacoalho}>
              <div className={`absolute inset-0 ${reduzido ? '' : 'orbe-balanco'}`}>
                {ONDAS.map((onda) => (
                  <svg
                    key={onda.periodo}
                    className={`absolute left-0 ${reduzido ? '' : 'orbe-onda'}`}
                    viewBox={`0 ${-ONDA_TOPO} ${ONDA_LARGURA} ${100 + ONDA_TOPO}`}
                    style={
                      {
                        top: `${-ONDA_TOPO}%`,
                        width: `${ONDA_LARGURA}%`,
                        height: `${100 + ONDA_TOPO}%`,
                        '--periodo': `${(-onda.periodo / ONDA_LARGURA) * 100}%`,
                        animationDuration: `${onda.duracao}s`,
                        animationDirection: onda.inverte ? 'reverse' : 'normal',
                      } as CSSProperties
                    }
                  >
                    <path d={caminhoOnda(onda.periodo, onda.amplitude, onda.fase)} style={{ fill: alerta ? 'var(--dano)' : cor }} opacity={onda.opacidade} />
                    {onda.brilho && (
                      <>
                        {/* Luz na superfície e escuro no fundo: dá corpo ao líquido. */}
                        <defs>
                          <linearGradient id={idSombra} gradientUnits="userSpaceOnUse" x1="0" y1="-4" x2="0" y2="100">
                            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                            <stop offset="0.22" stopColor="#fff" stopOpacity="0" />
                            <stop offset="0.6" stopColor="#000" stopOpacity="0.08" />
                            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        <path d={caminhoOnda(onda.periodo, onda.amplitude, onda.fase)} fill={`url(#${idSombra})`} />
                      </>
                    )}
                    {onda.brilho && (
                      <path
                        d={linhaOnda(onda.periodo, onda.amplitude, onda.fase)}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                    )}
                  </svg>
                ))}
                {/* Bolhas subindo sem parar, cada uma no seu ritmo; nascem e
                  somem transparentes, então o recomeço não aparece. */}
                {!reduzido &&
                  BOLHAS.map((b, i) => (
                    <span
                      key={i}
                      className="orbe-bolha-trilho"
                      style={{ left: `${b.x}%`, animationDuration: `${b.duracao}s`, animationDelay: `${-b.duracao * b.fase}s` }}
                    >
                      <span className="orbe-bolha" style={{ width: b.lado, height: b.lado }} />
                    </span>
                  ))}
              </div>
            </motion.div>
          </motion.div>
          {/* Volume de esfera: luz no alto à esquerda, sombra na borda. Fixo. */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,transparent_38%,rgb(0_0_0/0.5)_100%)]" />
          {/* Reflexo do vidro. */}
          <svg className="absolute inset-0 h-full w-full" viewBox={`${TOPO_VIDRO} ${TOPO_VIDRO} ${ALTURA_VIDRO} ${ALTURA_VIDRO}`}>
            <ellipse cx="40" cy="30" rx="17" ry="8" fill="#fff" opacity="0.28" transform="rotate(-25 40 30)" />
          </svg>
        </div>
        {/* O número dá um salto na cor do ganho ou da perda e assenta. A ref
            ainda tem o valor anterior durante o render (o efeito atualiza depois). */}
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={valor}
            className="font-titulo text-[44px] font-bold tabular-nums text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.95),0_0_2px_rgb(0_0_0)]"
            initial={valorAnterior.current !== valor && !reduzido ? { scale: 1.45, color: valor > valorAnterior.current ? '#5ed17a' : '#e0374a' } : false}
            animate={{ scale: 1, color: '#f3e6c8' }}
            transition={{ scale: mola.impacto, color: { duration: 0.9, ease: 'easeOut' } }}
          >
            <motion.span>{numero}</motion.span>
          </motion.span>
        </span>

        <AnimatePresence>
          {flutuantes.map((f) => [
            // Ganho: bolhas sobem no líquido do frasco.
            f.delta > 0 ? <Bolhas key={`bolhas-${f.id}`} className="inset-[15%]" semente={f.id + 3} /> : null,
            // Anel de luz que sai do vidro na cor do ganho ou da perda.
            <motion.span
              key={`anel-${f.id}`}
              className="pointer-events-none absolute inset-[14%] rounded-full border-[5px]"
              style={{ borderColor: f.delta > 0 ? 'var(--cura)' : 'var(--dano)', boxShadow: `0 0 18px ${f.delta > 0 ? 'var(--cura)' : 'var(--dano)'}` }}
              initial={{ scale: 0.9, opacity: 0.95 }}
              animate={{ scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduzido ? 0 : 0.9, ease: 'easeOut' }}
            />,
            <motion.span
              key={f.id}
              className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 font-titulo text-[56px] font-bold [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]"
              style={{ color: f.delta > 0 ? 'var(--cura)' : 'var(--dano)' }}
              initial={{ opacity: 0, y: 0 }}
              animate={f.delta > 0 ? { opacity: [0, 1, 1, 0], y: -90 } : { opacity: [0, 1, 1, 0], y: 70, x: [0, -4, 4, 0] }}
              transition={{ duration: 1.5 }}
            >
              {f.delta > 0 ? `+${f.delta}` : f.delta}
            </motion.span>,
          ])}
        </AnimatePresence>
      </div>

      <div className="mt-1 flex items-center gap-2 font-titulo text-[22px] font-bold text-pergaminho [text-shadow:0_2px_3px_rgb(0_0_0/0.9)]">
        <span style={{ color: cor }}>
          <Icone nome={icone} className="h-7 w-7" />
        </span>
        {rotulo}
      </div>
      {alerta && <p className="font-texto text-[20px] italic text-dano [text-shadow:0_1px_2px_rgb(0_0_0)]">Quase quebrou!</p>}
    </div>
  );
}
