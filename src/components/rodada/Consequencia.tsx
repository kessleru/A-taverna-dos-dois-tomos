import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { dadoDoDestino } from '../../data/rodada';
import type { ResultadoDado } from '../../engine/motor';
import confetti from 'canvas-confetti';
import { Icone } from '../ui/Icone';
import { Faiscas } from '../ui/Faiscas';
import { Baforada } from '../ui/Particulas';
import { ReguaDado } from './ReguaDado';
import { mola } from '../../styles/movimento';

const COR_FAIXA = { critico: 'var(--ouro)', sucesso: 'var(--cura)', falha: 'var(--dano)' } as const;
// Pano da fita de cada faixa: ouro, verde-musgo e vermelho-cera.
const PANO_FAIXA = { critico: '#c28a22', sucesso: '#2f7a45', falha: '#9e1f2b' } as const;

// Revelação do dado e o que a carta causou. O d20 gira mostrando faces ao
// acaso até parar no resultado, a soma aparece e a faixa bate na mesa
// (06-animacoes.md, "Dado do Destino"). Os orbes do topo animam a mudança.
export function Consequencia({
  dado,
  resultado,
  aoRevelar,
  aoGirar,
}: {
  dado: ResultadoDado;
  resultado: string;
  aoRevelar?: () => void;
  // Chamado a cada duas faces sorteadas (tic da contagem).
  aoGirar?: () => void;
}) {
  const reduzido = useReducedMotion();
  const [face, setFace] = useState(reduzido ? dado.d20 : 1);
  const [revelado, setRevelado] = useState(!!reduzido);

  const aoGirarRef = useRef(aoGirar);
  aoGirarRef.current = aoGirar;

  useEffect(() => {
    if (reduzido) return;
    let passos = 0;
    const id = window.setInterval(() => {
      passos++;
      if (passos >= 14) {
        window.clearInterval(id);
        setFace(dado.d20);
        setRevelado(true);
        return;
      }
      setFace(1 + Math.floor(Math.random() * 20));
      if (passos % 2 === 0) aoGirarRef.current?.();
    }, 70);
    return () => window.clearInterval(id);
  }, [dado.d20, reduzido]);

  // aoRevelar dispara uma vez, na revelação (ref para não depender da identidade).
  const aoRevelarRef = useRef(aoRevelar);
  aoRevelarRef.current = aoRevelar;
  useEffect(() => {
    if (!revelado) return;
    aoRevelarRef.current?.();
    // Crítico merece festa: uma chuva curta de ouro saindo do dado.
    if (dado.faixa === 'critico' && !reduzido) {
      confetti({ particleCount: 90, spread: 70, startVelocity: 38, origin: { x: 0.42, y: 0.62 }, colors: ['#E8B64A', '#F3E6C8', '#FFD27A'] });
    }
  }, [revelado]);

  const faixa = dadoDoDestino.faixas[dado.faixa];
  const cor = COR_FAIXA[dado.faixa];

  return (
    <motion.div
      className="relative flex items-center gap-14"
      // Na falha a mesa inteira treme junto com a faixa.
      animate={revelado && dado.faixa === 'falha' && !reduzido ? { x: [0, -14, 12, -8, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
    >
      {/* Clarão na cor do resultado, do centro do dado para a sala toda. */}
      <AnimatePresence>
        {revelado && !reduzido && (
          <motion.div
            key="clarao"
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              background:
                dado.faixa === 'falha'
                  ? 'radial-gradient(circle at 50% 55%, transparent 30%, rgb(160 20 30 / 0.45) 100%)'
                  : `radial-gradient(circle at 40% 60%, color-mix(in srgb, ${cor} 45%, transparent), transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, times: [0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative flex h-[260px] w-[260px] shrink-0 items-center justify-center"
        animate={revelado ? { rotate: 0, scale: [1.15, 1] } : { rotate: [0, 360] }}
        transition={revelado ? mola.impacto : { duration: 0.5, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute inset-0 drop-shadow-[0_10px_18px_rgb(0_0_0/0.8)]" style={{ color: revelado ? cor : 'var(--ouro-escuro)' }}>
          <Icone nome="dice-twenty-faces-one" className="h-full w-full opacity-60" />
        </span>
        <span className="relative font-titulo text-[110px] font-bold text-pergaminho [text-shadow:0_4px_10px_rgb(0_0_0),0_0_4px_rgb(0_0_0)]">
          {face}
        </span>
        {revelado && <Baforada largura={0.8} semente={dado.d20} />}
        {revelado && dado.faixa !== 'falha' && <Faiscas cor={cor} quantidade={dado.faixa === 'critico' ? 18 : 10} raio={dado.faixa === 'critico' ? 300 : 200} />}
      </motion.div>

      <div className="relative flex w-[820px] flex-col gap-5">
        <AnimatePresence>
          {revelado && (
            <>
              <motion.div key="regua" className="pt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ReguaDado bonus={dado.bonus} face={dado.d20} />
              </motion.div>
              <motion.p
                key="soma"
                className="font-titulo text-[40px] font-bold text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {dado.d20} {dado.bonus >= 0 ? '+' : '−'} {Math.abs(dado.bonus)} = {dado.total}
                <span className="ml-4 font-texto text-[28px] font-medium italic text-pergaminho/70">precisavam de {dadoDoDestino.cd}</span>
              </motion.p>
              {/* A faixa bate na mesa como uma fita de pano costurada. */}
              <motion.div
                key="faixa"
                className="fita-sombra"
                initial={{ scale: 2.2, opacity: 0, rotate: -4 }}
                animate={dado.faixa === 'falha' ? { scale: 1, opacity: 1, rotate: -1.5, x: [0, -10, 10, -6, 6, 0] } : { scale: 1, opacity: 1, rotate: -1.5 }}
                transition={{ ...mola.impacto, delay: 0.25 }}
              >
                <div
                  className="fita font-titulo text-[52px] font-bold uppercase leading-none tracking-[0.06em]"
                  style={{ '--fita': PANO_FAIXA[dado.faixa] } as CSSProperties}
                >
                  {faixa.titulo} <span className="font-texto text-[30px] normal-case tracking-normal">· {faixa.texto}</span>
                </div>
              </motion.div>
              <motion.p
                key="resultado"
                className="font-texto text-[38px] leading-snug text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {resultado}
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
