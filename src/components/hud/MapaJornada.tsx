import { motion, useReducedMotion } from 'framer-motion';
import { etapas, type Escolha } from '../../data/rodada';
import { marcosDaJornada } from '../../engine/jornada';
import { COR, SIGILO } from '../cartas/logicas';
import { Icone } from '../ui/Icone';

const ROMANOS = ['I', 'II', 'III', 'IV'];

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

  return (
    <div className="relative flex w-[560px] items-start justify-between px-6" aria-label="Mapa da jornada">
      {/* A estrada: linha tracejada de terra batida atrás dos marcos. */}
      <div className="absolute left-12 right-12 top-[30px] h-2 rounded-full bg-madeira-clara/80 [background-image:repeating-linear-gradient(90deg,rgb(232_182_74/0.5)_0_14px,transparent_14px_26px)]" />
      {marcos.map((marco, i) => {
        const nome = etapas[i].fase.replace(/^\d+\s*·\s*/, '');
        const atual = marco.estado === 'atual';
        const feito = marco.estado === 'feito';
        const cor = feito ? COR[marco.escolha] : atual ? 'var(--ouro)' : 'rgb(243 230 200 / 0.3)';
        return (
          <div key={etapas[i].id} className="relative flex w-[112px] flex-col items-center gap-1">
            <motion.div
              className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 bg-madeira-profunda"
              style={{ borderColor: cor, boxShadow: feito || atual ? `0 0 14px ${cor}` : undefined }}
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
          </div>
        );
      })}
    </div>
  );
}
