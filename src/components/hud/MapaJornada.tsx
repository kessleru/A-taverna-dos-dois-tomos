import { useRef } from 'react';
import { motion, useReducedMotion, type MotionStyle } from 'framer-motion';
import { etapas, type Escolha } from '../../data/rodada';
import { marcosDaJornada } from '../../engine/jornada';
import { COR, SIGILO } from '../cartas/logicas';
import { Icone } from '../ui/Icone';
import { Impacto } from '../ui/Particulas';

const ROMANOS = ['I', 'II', 'III', 'IV'];
// Centros do primeiro e do último marco na estrada (px): 4 marcos de 112 px
// distribuídos em 560 px com 24 px de margem.
const INICIO_TRILHA = 80;
const COMPRIMENTO_TRILHA = 400;
const MOLA_TRILHA = { type: 'spring', stiffness: 45, damping: 16 } as const;

// Estrada com os 4 marcos da rodada (01-tema-e-hud.md §7): o atual pulsa; os
// feitos mostram o sigilo da carta jogada e um selo de cera quando ela bateu
// com o que a startup real fez.
export function MapaJornada({ etapaAtual, escolhas }: { etapaAtual: number; escolhas: (Escolha | undefined)[] }) {
  const reduzido = useReducedMotion();
  const marcos = marcosDaJornada(
    etapaAtual,
    escolhas,
    etapas.map((e) => e.ideal),
  );
  const progresso = Math.min(etapaAtual, marcos.length - 1) / (marcos.length - 1);
  // Marcos já feitos ao montar (recarregar a página, voltar à rodada) não comemoram de novo.
  const feitosAoMontar = useRef(new Set(marcos.flatMap((m, i) => (m.estado === 'feito' ? [i] : []))));

  return (
    <div className="relative flex w-[560px] items-start justify-between px-6" aria-label="Mapa da jornada">
      {/* A estrada: linha tracejada de terra batida atrás dos marcos. */}
      <div className="absolute left-12 right-12 top-[27px] h-2 rounded-full bg-madeira-clara/80 [background-image:repeating-linear-gradient(90deg,rgb(232_182_74/0.5)_0_14px,transparent_14px_26px)]" />
      {/* O caminho já percorrido, em ouro: a cada capítulo ele avança até o
          marco novo, com uma fagulha na ponta (scaleX e x, no compositor). */}
      <div className="absolute top-[27px] h-2" style={{ left: INICIO_TRILHA, width: COMPRIMENTO_TRILHA }} aria-hidden>
        <motion.div
          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-claro shadow-[0_0_8px_rgb(232_182_74/0.7)] will-change-transform"
          initial={false}
          animate={{ scaleX: progresso }}
          transition={reduzido ? { duration: 0 } : MOLA_TRILHA}
        />
        <motion.span
          className="absolute -left-[7px] -top-[3px] h-[14px] w-[14px] rounded-full bg-[radial-gradient(circle,#fff6d0,var(--ouro)_45%,transparent_72%)] will-change-transform"
          initial={false}
          animate={{ x: progresso * COMPRIMENTO_TRILHA }}
          transition={reduzido ? { duration: 0 } : MOLA_TRILHA}
        />
      </div>
      {marcos.map((marco, i) => {
        const nome = etapas[i].fase.replace(/^\d+\s*·\s*/, '');
        const atual = marco.estado === 'atual';
        const feito = marco.estado === 'feito';
        const cor = feito ? COR[marco.escolha] : atual ? 'var(--ouro)' : 'rgb(243 230 200 / 0.3)';
        return (
          <div key={etapas[i].id} className="relative flex w-[112px] flex-col items-center gap-1">
            <motion.div
              // will-change: a escala pulsa por JS; sem ele o Chrome refazia o
              // drop-shadow do medalhão em cada tamanho, quadro a quadro.
              className="medalhao relative flex h-[62px] w-[62px] items-center justify-center bg-[radial-gradient(circle_at_40%_35%,#3a2616,#140d08_70%)] will-change-transform"
              style={{ '--gema': cor, filter: feito || atual ? `drop-shadow(0 0 10px ${cor})` : 'saturate(0.4) brightness(0.8)' } as MotionStyle}
              animate={atual && !reduzido ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={atual ? { duration: 1.4, repeat: Infinity } : { duration: 0.2 }}
            >
              {feito ? (
                <span style={{ color: cor }}>
                  <Icone nome={SIGILO[marco.escolha]} className="h-10 w-10" />
                </span>
              ) : (
                <span className="font-titulo text-[26px] font-bold" style={{ color: cor }}>
                  {ROMANOS[i]}
                </span>
              )}
              {feito && !feitosAoMontar.current.has(i) && <Impacto cor={cor} onda={80} raio={62} quantidade={8} atraso={0.15} />}
              {feito && marco.bateuReal && (
                <span className="selo-cera absolute -bottom-2 -right-3" title="Como na história real">
                  <Icone nome="wax-seal" className="h-8 w-8" />
                </span>
              )}
            </motion.div>
            <span
              className={`text-center font-texto text-[18px] leading-tight [text-shadow:0_1px_2px_rgb(0_0_0/0.9)] ${
                atual ? 'font-bold text-ouro' : 'text-pergaminho/75'
              }`}
            >
              {nome}
            </span>
            {/* O ano de cada marco: o tempo passando à vista a rodada inteira. */}
            <span
              className={`font-titulo text-[15px] font-bold tracking-[0.08em] [text-shadow:0_1px_2px_rgb(0_0_0/0.9)] ${
                atual ? 'text-ouro' : feito ? 'text-ouro/70' : 'text-pergaminho/45'
              }`}
            >
              {etapas[i].capitulo.anos}
            </span>
          </div>
        );
      })}
    </div>
  );
}
