import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { dadoDoDestino } from '../../data/rodada';
import type { ResultadoDado } from '../../engine/motor';
import { Icone } from '../ui/Icone';
import { mola } from '../../styles/movimento';

const COR_FAIXA = { critico: 'var(--ouro)', sucesso: 'var(--cura)', falha: 'var(--dano)' } as const;

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
    if (revelado) aoRevelarRef.current?.();
  }, [revelado]);

  const faixa = dadoDoDestino.faixas[dado.faixa];
  const cor = COR_FAIXA[dado.faixa];

  return (
    <div className="flex items-center gap-14">
      <motion.div
        className="relative flex h-[260px] w-[260px] shrink-0 items-center justify-center"
        animate={revelado ? { rotate: 0, scale: [1.15, 1] } : { rotate: [0, 360] }}
        transition={revelado ? mola.impacto : { duration: 0.5, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute inset-0 text-ouro-escuro drop-shadow-[0_10px_18px_rgb(0_0_0/0.8)]">
          <Icone nome="dice-twenty-faces-one" className="h-full w-full opacity-60" />
        </span>
        <span className="relative font-titulo text-[110px] font-bold text-pergaminho [text-shadow:0_4px_10px_rgb(0_0_0),0_0_4px_rgb(0_0_0)]">
          {face}
        </span>
      </motion.div>

      <div className="flex w-[820px] flex-col gap-5">
        <AnimatePresence>
          {revelado && (
            <>
              <motion.p
                key="soma"
                className="font-titulo text-[40px] font-bold text-pergaminho [text-shadow:0_2px_4px_rgb(0_0_0/0.9)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {dado.d20} {dado.bonus >= 0 ? '+' : '−'} {Math.abs(dado.bonus)} = {dado.total}
                <span className="ml-4 font-texto text-[28px] font-medium italic text-pergaminho/70">(CD {dadoDoDestino.cd})</span>
              </motion.p>
              <motion.div
                key="faixa"
                className="w-fit rounded-md border-4 px-8 py-3 font-titulo text-[52px] font-bold uppercase tracking-[0.06em]"
                style={{ borderColor: cor, color: cor, background: 'rgb(20 13 8 / 0.85)', boxShadow: `0 0 30px ${cor}` }}
                initial={{ scale: 2.2, opacity: 0 }}
                animate={dado.faixa === 'falha' ? { scale: 1, opacity: 1, x: [0, -10, 10, -6, 6, 0] } : { scale: 1, opacity: 1 }}
                transition={{ ...mola.impacto, delay: 0.25 }}
              >
                {faixa.titulo} <span className="font-texto text-[30px] normal-case tracking-normal">· {faixa.texto}</span>
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
    </div>
  );
}
