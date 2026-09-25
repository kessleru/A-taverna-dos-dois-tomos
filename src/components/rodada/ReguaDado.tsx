import { motion, useReducedMotion } from 'framer-motion';
import { faixaDoDado, type Faixa } from '../../engine/motor';
import { mola } from '../../styles/movimento';

const COR: Record<Faixa, string> = { falha: 'var(--dano)', sucesso: 'var(--cura)', critico: 'var(--ouro)' };
const ROTULO: Record<Faixa, string> = { falha: 'Falha', sucesso: 'Sucesso', critico: 'Crítico' };
const FACES = Array.from({ length: 20 }, (_, i) => i + 1);

// Faixa de cada face do d20 com este bônus (a mesma regra do motor).
export function faixaDaFace(face: number, bonus: number): Faixa {
  return faixaDoDado(face, face + bonus);
}

// Menor face do d20 que já dá certo, e a chance disso acontecer.
export function minimoNoDado(bonus: number): { minimo: number; chance: number } {
  const minimo = FACES.find((face) => faixaDaFace(face, bonus) !== 'falha') ?? 20;
  return { minimo, chance: Math.round(((21 - minimo) / 20) * 100) };
}

// Régua das 20 faces pintadas pela faixa: a turma vê de relance o que
// precisa tirar. Com `face`, marca a face que saiu.
export function ReguaDado({ bonus, face, claro = false }: { bonus: number; face?: number; claro?: boolean }) {
  const reduzido = useReducedMotion();
  const faixas = FACES.map((f) => faixaDaFace(f, bonus));
  // Trechos contínuos da mesma faixa, para o rótulo ficar no meio de cada um.
  const trechos: { faixa: Faixa; de: number; ate: number }[] = [];
  faixas.forEach((faixa, i) => {
    const ultimo = trechos[trechos.length - 1];
    if (ultimo && ultimo.faixa === faixa) ultimo.ate = i + 1;
    else trechos.push({ faixa, de: i + 1, ate: i + 1 });
  });

  return (
    <div className="relative w-full select-none">
      <div className="placa-ferro-pequena relative flex h-[38px] overflow-visible p-[5px]">
        {FACES.map((f, i) => (
          <motion.div
            key={f}
            className="relative flex flex-1 items-center justify-center border-r border-black/40 font-titulo text-[13px] font-bold last:border-r-0"
            style={{
              background: `color-mix(in srgb, ${COR[faixas[i]]} ${face === f ? 95 : 62}%, #140d08)`,
              color: 'rgb(20 13 8 / 0.9)',
            }}
            initial={reduzido ? false : { opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: reduzido ? 0 : 0.2 + i * 0.025, duration: 0.25 }}
          >
            {f}
          </motion.div>
        ))}
        {face !== undefined && (
          <motion.div
            className="pointer-events-none absolute -top-[46px] flex -translate-x-1/2 flex-col items-center"
            style={{ left: `calc(5px + (100% - 10px) * ${(face - 0.5) / 20})` }}
            initial={reduzido ? false : { y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...mola.impacto, delay: reduzido ? 0 : 0.15 }}
          >
            <span className="font-titulo text-[22px] font-bold leading-none" style={{ color: COR[faixas[face - 1]], textShadow: '0 2px 4px rgb(0 0 0 / 0.95)' }}>
              {face}
            </span>
            <span className="text-[22px] leading-none" style={{ color: COR[faixas[face - 1]], textShadow: '0 2px 4px rgb(0 0 0 / 0.95)' }}>
              ▼
            </span>
          </motion.div>
        )}
      </div>
      <div className="relative mt-1 flex">
        {trechos.map((t) => (
          <span
            key={t.faixa}
            className={`text-center font-titulo text-[16px] font-bold uppercase tracking-[0.06em] ${claro ? '' : '[text-shadow:0_1px_3px_rgb(0_0_0/0.95)]'}`}
            style={{ width: `${((t.ate - t.de + 1) / 20) * 100}%`, color: claro ? `color-mix(in srgb, ${COR[t.faixa]} 70%, #2a1a0e)` : COR[t.faixa] }}
          >
            {t.ate - t.de >= 2 ? ROTULO[t.faixa] : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
