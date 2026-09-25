import { memo, useEffect, useMemo, type CSSProperties } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { gerarBrasas } from '../../engine/brasas';

// Versões "noite": o desfoque e o escurecimento já vêm aplicados no arquivo.
// Com filter no CSS, a pintura (que se mexe sem parar) era refiltrada a cada
// quadro, e em dobro durante a virada de página.
const PINTURA = `${import.meta.env.BASE_URL}assets/cenario/taverna-fundo-noite.webp`;
const TAMPO = `${import.meta.env.BASE_URL}assets/cenario/tampo-mesa-noite.webp`;

// Parallax do mouse (como o menu do Hearthstone): o fundo distante anda pouco
// e o tampo, mais perto, anda um pouco mais, para dar profundidade. Em px do
// palco, bem sutil; a pintura e o tampo sobram 12 px para cada lado.
const PARALLAX_FUNDO = 5;
const PARALLAX_TAMPO = 9;
const MOLA_PARALLAX = { stiffness: 40, damping: 18, mass: 1 };

// Camadas de trás para frente: pintura, luz de vela, tampo, brasas, vinheta.
// memo: não tem props, então não re-renderiza a cada ação da rodada.
export const Taverna = memo(function Taverna() {
  const brasas = useMemo(() => gerarBrasas(26, 7), []);
  const reduzido = useReducedMotion();
  // Posição do mouse na janela, de -1 a 1; por valor de movimento (sem render).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, MOLA_PARALLAX);
  const y = useSpring(my, MOLA_PARALLAX);
  const fundoX = useTransform(x, (v) => v * -PARALLAX_FUNDO);
  const fundoY = useTransform(y, (v) => v * -PARALLAX_FUNDO);
  const tampoX = useTransform(x, (v) => v * -PARALLAX_TAMPO);

  useEffect(() => {
    if (reduzido) return;
    function aoMover(evento: PointerEvent) {
      mx.set((evento.clientX / window.innerWidth) * 2 - 1);
      my.set((evento.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener('pointermove', aoMover, { passive: true });
    return () => window.removeEventListener('pointermove', aoMover);
  }, [reduzido, mx, my]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* will-change: transform posto por JS a cada quadro não vira camada
          sozinho; sem ele, cada passo do parallax repintava o palco inteiro. */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ x: fundoX, y: fundoY }}>
        <div className="taverna-pintura" style={{ backgroundImage: `url(${PINTURA})` }} />
      </motion.div>
      <div className="taverna-vela taverna-vela-esquerda" />
      <div className="taverna-vela taverna-vela-direita" />
      <motion.div className="taverna-tampo will-change-transform" style={{ backgroundImage: `url(${TAMPO})`, x: tampoX }} />
      {brasas.map((brasa, i) => (
        <span
          key={i}
          className="taverna-brasa"
          style={
            {
              left: `${brasa.x}%`,
              width: brasa.tamanho,
              height: brasa.tamanho,
              animationDuration: `${brasa.duracao}s`,
              animationDelay: `-${brasa.atraso}s`,
              '--deriva': `${brasa.deriva}px`,
            } as CSSProperties
          }
        />
      ))}
      <div className="taverna-vinheta" />
    </div>
  );
});
