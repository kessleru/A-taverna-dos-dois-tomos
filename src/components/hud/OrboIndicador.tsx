import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const topoLiquido = FUNDO_VIDRO - nivelLiquido(valor) * ALTURA_VIDRO;

  const valorAnterior = useRef(valor);
  const proximoId = useRef(0);
  const [flutuantes, setFlutuantes] = useState<Flutuante[]>([]);

  useEffect(() => {
    const delta = valor - valorAnterior.current;
    valorAnterior.current = valor;
    if (delta === 0) return;
    const id = proximoId.current++;
    setFlutuantes((f) => [...f, { id, delta }]);
    const tempo = setTimeout(() => setFlutuantes((f) => f.filter((x) => x.id !== id)), 1500);
    return () => clearTimeout(tempo);
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
            {/* Onda: um trecho de 200 de largura desliza 50 (um período) para a esquerda em loop. */}
            <svg
              className={`absolute ${reduzido ? '' : 'orbe-onda'}`}
              viewBox="-50 -4 200 104"
              preserveAspectRatio="none"
              style={{
                left: `${((-50 - TOPO_VIDRO) / ALTURA_VIDRO) * 100}%`,
                top: `${(-4 / ALTURA_VIDRO) * 100}%`,
                width: `${(200 / ALTURA_VIDRO) * 100}%`,
                height: `${(104 / ALTURA_VIDRO) * 100}%`,
              }}
            >
              <path d="M-50 0 Q -25 -4 0 0 T 50 0 T 100 0 T 150 0 V 100 H -50 Z" style={{ fill: alerta ? 'var(--dano)' : cor }} opacity="0.92" />
            </svg>
          </motion.div>
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
            initial={
              valorAnterior.current !== valor && !reduzido
                ? { scale: 1.45, color: valor > valorAnterior.current ? '#5ed17a' : '#e0374a' }
                : false
            }
            animate={{ scale: 1, color: '#f3e6c8' }}
            transition={{ scale: mola.impacto, color: { duration: 0.9, ease: 'easeOut' } }}
          >
            {valor}
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
