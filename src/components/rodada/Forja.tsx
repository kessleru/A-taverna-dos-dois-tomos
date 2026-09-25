import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { mensagensCombinar } from '../../data/rodada';
import { CartaDecisao } from '../cartas/CartaDecisao';
import { Icone } from '../ui/Icone';
import { Impacto } from '../ui/Particulas';
import { mola } from '../../styles/movimento';
import { TREMOR, useTremor, useTremorAoMontar } from '../ui/Tremor';

// Forja do Combinar (06-animacoes.md, "Revelações"): se a turma já adaptou e
// planejou, Planejar e Adaptar se fundem num clarão e nasce a lendária
// Combinar, com as correntes quebrando; senão, a Combinar treme acorrentada.
export function Forja({ desbloqueado, aoFundir }: { desbloqueado: boolean; aoFundir?: () => void }) {
  const reduzido = useReducedMotion();
  const [fase, setFase] = useState<'juntando' | 'forjada'>(desbloqueado && !reduzido ? 'juntando' : 'forjada');
  const aoFundirRef = useRef(aoFundir);
  aoFundirRef.current = aoFundir;
  const tremer = useTremor();
  const tremerRef = useRef(tremer);
  tremerRef.current = tremer;
  // Trancada: as correntes chacoalham a mesa.
  useTremorAoMontar(desbloqueado ? 0 : TREMOR.leve, 250);

  useEffect(() => {
    if (!desbloqueado || reduzido) return;
    const id = window.setTimeout(() => {
      setFase('forjada');
      aoFundirRef.current?.();
      tremerRef.current(TREMOR.forte);
    }, 1300);
    return () => window.clearTimeout(id);
  }, [desbloqueado, reduzido]);

  const mensagem = desbloqueado ? mensagensCombinar.desbloqueou : mensagensCombinar.trancada;

  return (
    <div className="relative flex w-full max-w-[1320px] flex-col items-center gap-4">
      {/* A mensagem vai acima da carta para não ficar sob o botão Continuar. */}
      <p
        className={`max-w-[860px] text-center font-titulo text-[30px] font-bold leading-tight [text-shadow:0_2px_4px_rgb(0_0_0/0.9)] ${
          desbloqueado ? 'text-ouro' : 'text-pergaminho/80'
        }`}
      >
        {mensagem.replace(/^\S+\s/, '')}
      </p>
      <div className="relative flex h-[540px] w-full items-center justify-center">
        {desbloqueado && fase === 'juntando' && (
          <>
            <motion.div className="absolute" initial={{ x: -420, rotate: -10 }} animate={{ x: -40, rotate: 20, scale: 0.8 }} transition={{ duration: 1.2, ease: 'easeIn' }}>
              <CartaDecisao id="planejar" nome="Planejar" teoria="Causation" resumo="Plano, metas e controle." />
            </motion.div>
            <motion.div className="absolute" initial={{ x: 420, rotate: 10 }} animate={{ x: 40, rotate: -20, scale: 0.8 }} transition={{ duration: 1.2, ease: 'easeIn' }}>
              <CartaDecisao id="adaptar" nome="Adaptar" teoria="Effectuation" resumo="Meios, parcerias e perda aceitável." />
            </motion.div>
          </>
        )}

        {fase === 'forjada' && (
          <>
            {desbloqueado && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(255_240_200/0.95),rgb(232_182_74/0.4)_35%,transparent_65%)]"
                initial={{ opacity: 1, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 1 }}
              />
            )}
            <motion.div
              initial={desbloqueado && !reduzido ? { scale: 0.3, rotate: 720, y: -200 } : false}
              animate={desbloqueado ? { scale: 1, rotate: 0, y: 0 } : { x: [0, -8, 8, -6, 6, 0] }}
              transition={desbloqueado ? { ...mola.impacto, duration: 1.2 } : { duration: 0.6, repeat: 2 }}
              style={desbloqueado ? { filter: 'drop-shadow(0 0 30px var(--ouro))' } : undefined}
            >
              {/* Trancada: as correntes batem e soltam fagulhas de ferro. */}
              {!desbloqueado && <Impacto cor="#d8d0c6" onda={180} raio={200} quantidade={10} atraso={0.25} />}
              <div style={{ zoom: 0.8 }} data-guia="combinar">
                <CartaDecisao
                  id="combinar"
                  nome="Combinar"
                  teoria="As duas juntas"
                  resumo={desbloqueado ? 'Forjada! Disponível na última etapa.' : 'Trancada. Ainda falta viver as duas lógicas.'}
                  tamanho="grande"
                  trancada={!desbloqueado}
                />
              </div>
            </motion.div>
            {desbloqueado && !reduzido &&
              Array.from({ length: 10 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute text-[#8c847c]"
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: Math.cos((i / 10) * Math.PI * 2) * 420, y: Math.sin((i / 10) * Math.PI * 2) * 260 + 200, rotate: 360, opacity: 0 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                >
                  <Icone nome="breaking-chain" className="h-14 w-14" />
                </motion.span>
              ))}
          </>
        )}
      </div>

    </div>
  );
}
