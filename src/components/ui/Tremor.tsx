import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { decairTrauma, deslocamentoTremor, somarTrauma } from '../../engine/tremor';

// Impactos prontos, do mais leve ao mais pesado (escala do tremor ao evento).
export const TREMOR = {
  leve: 0.28,
  medio: 0.5,
  forte: 0.72,
} as const;

const Contexto = createContext<(impacto: number) => void>(() => {});

// tremer(0 a 1): soma trauma à câmera do jogo (src/engine/tremor.ts).
export function useTremor(): (impacto: number) => void {
  return useContext(Contexto);
}

// Câmera que treme: um invólucro em volta da mesa inteira. O laço de
// animação só roda enquanto há trauma e escreve o transform direto no
// elemento, sem re-renderizar o jogo. Com movimento reduzido, não treme.
export function Tremor({ children }: { children: ReactNode }) {
  const reduzido = useReducedMotion();
  const elemento = useRef<HTMLDivElement>(null);
  const trauma = useRef(0);
  const quadro = useRef<number | null>(null);
  const anterior = useRef(0);

  const passo = useCallback((agora: number) => {
    const segundos = (agora - anterior.current) / 1000;
    anterior.current = agora;
    trauma.current = decairTrauma(trauma.current, segundos);
    const alvo = elemento.current;
    if (alvo) {
      if (trauma.current <= 0) {
        alvo.style.transform = '';
      } else {
        const { x, y, giro, escala } = deslocamentoTremor(trauma.current, agora / 1000);
        alvo.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${giro.toFixed(3)}deg) scale(${escala.toFixed(4)})`;
      }
    }
    quadro.current = trauma.current > 0 ? requestAnimationFrame(passo) : null;
  }, []);

  const tremer = useCallback(
    (impacto: number) => {
      if (reduzido) return;
      trauma.current = somarTrauma(trauma.current, impacto);
      if (quadro.current === null) {
        anterior.current = performance.now();
        quadro.current = requestAnimationFrame(passo);
      }
    },
    [reduzido, passo],
  );

  useEffect(
    () => () => {
      if (quadro.current !== null) cancelAnimationFrame(quadro.current);
    },
    [],
  );

  return (
    <Contexto.Provider value={tremer}>
      <div ref={elemento} className="relative h-full w-full">
        {children}
      </div>
    </Contexto.Provider>
  );
}

// Um tremor só, `atrasoMs` depois de montar: para selos e medalhas que batem
// na mesa no meio da animação de entrada.
export function useTremorAoMontar(impacto: number, atrasoMs = 0) {
  const tremer = useTremor();
  const tremerRef = useRef(tremer);
  tremerRef.current = tremer;
  const impactoRef = useRef(impacto);
  useEffect(() => {
    if (impactoRef.current <= 0) return;
    const id = window.setTimeout(() => tremerRef.current(impactoRef.current), atrasoMs);
    return () => window.clearTimeout(id);
  }, [atrasoMs]);
}
