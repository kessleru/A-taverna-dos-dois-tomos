import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { achatar, DURACAO_ROLAGEM_S, facesDoCaminho, PAUSA_IMPACTO_MS, QUIQUES, tombo, TROCAS_DE_FACE, voo } from '../../engine/rolagem';
import { ArtePintada } from '../ui/ArtePintada';

// Onde fica a face da frente na pintura do d20 (medido na imagem): o centro
// dela é um pouco abaixo do meio. O número mora ali dentro.
const DESCIDA_DA_FACE = 19;

interface DadoRolandoProps {
  resultado: number;
  // Cor da faixa (crítico, sucesso, falha), para o brilho da revelação.
  cor: string;
  revelado: boolean;
  reduzido: boolean;
  // Cada quique na mesa, com a força (para o "toc" e o tremor).
  aoQuicar?: (forca: number) => void;
  // Cada face nova que aparece no caminho.
  aoTrocarFace?: () => void;
  // Parou (depois da micro-pausa do impacto).
  aoAssentar?: () => void;
}

// O d20 pintado sendo lançado na mesa (coreografia em engine/rolagem.ts).
// Camadas, de fora para dentro: voo (x, y), achatamento (origem embaixo),
// giro no plano e "virar de lado" (largura). O número vai junto na última
// camada, então ele também some de perfil e troca sem ninguém ver.
export function DadoRolando({ resultado, cor, revelado, reduzido, aoQuicar, aoTrocarFace, aoAssentar }: DadoRolandoProps) {
  const [face, setFace] = useState(reduzido ? resultado : () => 1 + Math.floor(Math.random() * 20));
  const callbacks = useRef({ aoQuicar, aoTrocarFace, aoAssentar });
  callbacks.current = { aoQuicar, aoTrocarFace, aoAssentar };

  useEffect(() => {
    if (reduzido) {
      callbacks.current.aoAssentar?.();
      return;
    }
    const ms = DURACAO_ROLAGEM_S * 1000;
    const faces = facesDoCaminho(resultado, Math.random);
    const ids = [
      ...TROCAS_DE_FACE.map((t, i) =>
        window.setTimeout(() => {
          setFace(faces[i]);
          callbacks.current.aoTrocarFace?.();
        }, t * ms),
      ),
      ...QUIQUES.map(({ em, forca }) => window.setTimeout(() => callbacks.current.aoQuicar?.(forca), em * ms)),
      window.setTimeout(() => callbacks.current.aoAssentar?.(), ms + PAUSA_IMPACTO_MS),
    ];
    return () => ids.forEach((id) => window.clearTimeout(id));
    // Uma rolagem por montagem.
  }, []);

  const duration = DURACAO_ROLAGEM_S;

  return (
    <div className="relative h-[300px] w-[300px] shrink-0">
      {/* Sombra na mesa: não gira; encolhe e clareia com o dado no alto. */}
      <motion.span
        className="absolute bottom-[-6px] left-1/2 h-[46px] w-[230px] -ml-[115px] rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.85),transparent)] [will-change:transform,opacity]"
        initial={reduzido ? false : { scale: voo.sombraEscala[0], opacity: voo.sombraOpacidade[0] }}
        animate={{ scale: voo.sombraEscala, opacity: voo.sombraOpacidade, x: reduzido ? 0 : voo.x.map((x) => x * 0.35) }}
        transition={{ duration, times: voo.tempos, ease: 'linear' }}
        aria-hidden
      />
      <motion.div
        className="absolute inset-0 [will-change:transform]"
        initial={reduzido ? false : { x: voo.x[0], y: voo.y[0], opacity: 0 }}
        animate={{ x: voo.x, y: voo.y, opacity: 1 }}
        transition={{
          x: { duration, times: voo.tempos, ease: 'linear' },
          y: { duration, times: voo.tempos, ease: [...voo.easeY] },
          opacity: { duration: 0.12 },
        }}
      >
        <motion.div
          className="absolute inset-0 origin-bottom"
          initial={false}
          animate={reduzido ? undefined : { scaleX: achatar.scaleX, scaleY: achatar.scaleY }}
          transition={{ duration, times: achatar.tempos, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduzido ? false : { rotate: voo.rotate[0] }}
            animate={{ rotate: voo.rotate }}
            transition={{ duration, times: voo.tempos, ease: 'linear' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={reduzido ? undefined : { scaleX: tombo.scaleX }}
              transition={{ duration, times: tombo.tempos, ease: 'easeInOut' }}
            >
              {/* Revelado, o dado ganha um halo na cor da faixa. */}
              <span
                className="absolute inset-0"
                style={{
                  filter: revelado ? `drop-shadow(0 0 20px ${cor}) drop-shadow(0 8px 10px rgb(0 0 0 / 0.7))` : 'drop-shadow(0 8px 10px rgb(0 0 0 / 0.7))',
                }}
              >
                <ArtePintada nome="dado" className="h-full w-full" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: DESCIDA_DA_FACE * 2 }}>
                <span className="dado-numero" style={revelado ? { filter: `drop-shadow(0 2px 0 #2a1606) drop-shadow(0 0 10px ${cor})` } : undefined}>
                  {face}
                </span>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Carimbo: o número do resultado bate na face quando o dado assenta. */}
      <AnimatePresence>
        {revelado && !reduzido && (
          <motion.span
            key="carimbo"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ paddingTop: DESCIDA_DA_FACE * 2 }}
            initial={{ scale: 1.9, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            aria-hidden
          >
            <span className="dado-numero" style={{ filter: `drop-shadow(0 0 14px ${cor})` }}>
              {resultado}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
