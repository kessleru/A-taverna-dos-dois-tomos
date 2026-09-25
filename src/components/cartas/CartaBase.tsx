import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useSomDoJogo } from '../../engine/SomContexto';
import { useAmpliacao } from './Ampliacao';
import { SLOTS_MOLDURA } from './moldura';
import { VersoCarta } from './VersoCarta';

// Altura das molduras antes da ESCALA_CARTA (largura 260 ou 170, proporção 5:7).
const ALTURA_BASE = { grande: 364, pequena: 238 };
// Inclinação máxima (graus) com o cursor na borda da carta.
const INCLINACAO = 14;
// Mola do cursor: segue rápido, mas sem tremer (como nas cartas do pokemon-cards-css).
const MOLA_CURSOR = { stiffness: 260, damping: 26, mass: 0.6 };
const MOLA_LUZ = { stiffness: 180, damping: 30 };
const MASCARA_ESTRELAS = `${import.meta.env.BASE_URL}assets/texturas/estrelas-mascara.webp`;
// O holográfico fica só na janela da arte, como nas cartas "holo" de verdade:
// por cima do texto, as estrelas atrapalhavam a leitura.
const JANELA_ARTE = SLOTS_MOLDURA.arte;
// Passar o cursor de carta em carta faz um "fff" baixinho, sem virar metralhadora.
const INTERVALO_SOM_PASSAR_MS = 140;
let ultimoSomPassar = 0;

interface CartaBaseProps {
  frente: ReactNode;
  corPrincipal: string;
  virada?: boolean;
  tamanho?: 'grande' | 'pequena';
  onClick?: () => void;
  layoutId?: string;
  // Lendárias ganham o brilho holográfico de estrelas por cima da arte.
  holografica?: boolean;
}

export function CartaBase({ frente, corPrincipal, virada = true, tamanho = 'grande', onClick, layoutId, holografica = false }: CartaBaseProps) {
  const { mostrar, esconder } = useAmpliacao();
  const som = useSomDoJogo();
  const reduzido = !!useReducedMotion();
  const ampliada = useRef(false);

  // Onde o cursor está na carta (0 a 1, 0,5 = centro) e se está em cima.
  // São valores de movimento: mexer o mouse não re-renderiza a carta, só
  // muda transform e opacidade (antes cada movimento repintava a moldura
  // inteira, com as sombras, e engasgava em máquina fraca).
  const cursorX = useMotionValue(0.5);
  const cursorY = useMotionValue(0.5);
  const sobre = useMotionValue(0);
  const x = useSpring(cursorX, MOLA_CURSOR);
  const y = useSpring(cursorY, MOLA_CURSOR);
  const luz = useSpring(sobre, MOLA_LUZ);
  const rotateX = useTransform(y, (v) => (0.5 - v) * INCLINACAO);
  const rotateY = useTransform(x, (v) => (v - 0.5) * INCLINACAO);
  // O reflexo é um disco de luz do dobro do tamanho da carta que desliza por
  // baixo do recorte: move por transform, sem repintar.
  const reflexoX = useTransform(x, (v) => `${(v - 0.5) * 50}%`);
  const reflexoY = useTransform(y, (v) => `${(v - 0.5) * 50}%`);
  // Na holográfica, um foco de luz segue o cursor pela janela da arte (a
  // camada tem 3× o tamanho da janela, daí o terço) e o arco-íris dentro dele
  // corre ao contrário (paralaxe), como o foil que muda de cor ao inclinar.
  const focoX = useTransform(x, (v) => `${((v * 100 - JANELA_ARTE.esquerda) / JANELA_ARTE.largura - 0.5) * (100 / 3)}%`);
  const focoY = useTransform(y, (v) => `${((v * 100 - JANELA_ARTE.topo) / JANELA_ARTE.altura - 0.5) * (100 / 3)}%`);
  const arcoX = useTransform(x, (v) => `${(0.5 - v) * 20}%`);
  const arcoY = useTransform(y, (v) => `${(0.5 - v) * 20}%`);
  const brilhoEstrelas = useTransform(luz, (v) => 0.12 + v * 0.6);

  // O giro decide qual face aparece, sem backface-visibility: quando o hover
  // (tilt, escala e o reflexo com mix-blend) achata o 3D, o navegador errava
  // a face de trás e a carta fechada mostrava a frente espelhada ou sumia.
  // O verso gira 180° dentro da carta virada 180°, então nunca fica espelhado.
  const giro = useSpring(virada ? 0 : 180, { stiffness: 300, damping: 26 });
  const visibilidadeFrente = useTransform(giro, (v) => (v < 90 ? 'visible' : 'hidden'));
  const visibilidadeVerso = useTransform(giro, (v) => (v < 90 ? 'hidden' : 'visible'));
  useEffect(() => giro.set(virada ? 0 : 180), [virada, giro]);

  // Se a carta sair da tela (troca de folha ou de passo) ampliada, fecha junto.
  useEffect(
    () => () => {
      if (ampliada.current) esconder();
    },
    [esconder],
  );

  function aoEntrar() {
    sobre.set(1);
    const agora = performance.now();
    if (virada && agora - ultimoSomPassar > INTERVALO_SOM_PASSAR_MS) {
      ultimoSomPassar = agora;
      som?.tocar('carta-deslizar', { volume: 0.22 });
    }
  }

  function aoMoverMouse(evento: React.MouseEvent<HTMLDivElement>) {
    if (reduzido) return;
    const caixa = evento.currentTarget.getBoundingClientRect();
    cursorX.set((evento.clientX - caixa.left) / caixa.width);
    cursorY.set((evento.clientY - caixa.top) / caixa.height);
  }

  function aoSair() {
    cursorX.set(0.5);
    cursorY.set(0.5);
    sobre.set(0);
  }

  // Botão direito amplia a carta virada para cima no centro da mesa (como no
  // MTG Arena); a ampliação fecha com qualquer clique ou Esc.
  function aoBotaoDireito(evento: React.MouseEvent) {
    evento.preventDefault();
    if (!virada) return;
    ampliada.current = true;
    som?.tocar('virar-carta', { volume: 0.6 });
    mostrar(frente, ALTURA_BASE[tamanho], () => {
      ampliada.current = false;
    });
  }

  return (
    <motion.div
      layoutId={layoutId}
      className="cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={aoEntrar}
      onMouseMove={aoMoverMouse}
      onMouseLeave={aoSair}
      onContextMenu={aoBotaoDireito}
      onClick={() => onClick?.()}
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <motion.div className="relative" style={{ rotateY: giro, transformStyle: 'preserve-3d' }}>
          <motion.div className="relative" style={{ visibility: visibilidadeFrente }}>
            {/* Aura na cor da carta com o cursor em cima, como a carta jogável do
                Hearthstone. É uma camada separada que só muda de opacidade: um
                drop-shadow animado repintaria a carta a cada quadro. */}
            <motion.div
              className="pointer-events-none absolute inset-[5%] rounded-[18px]"
              style={{ opacity: luz, boxShadow: `0 0 34px 10px ${corPrincipal}, 0 0 70px 18px color-mix(in srgb, ${corPrincipal} 45%, transparent)` }}
              aria-hidden
            />
            {frente}
            {/* Brilho holográfico: arco-íris que só aparece através das estrelas. */}
            {holografica && !reduzido && (
              <motion.div
                className="carta-holo pointer-events-none absolute overflow-hidden rounded-[4px]"
                style={{
                  left: `${JANELA_ARTE.esquerda}%`,
                  top: `${JANELA_ARTE.topo}%`,
                  width: `${JANELA_ARTE.largura}%`,
                  height: `${JANELA_ARTE.altura}%`,
                  opacity: brilhoEstrelas,
                  WebkitMaskImage: `url(${MASCARA_ESTRELAS})`,
                  maskImage: `url(${MASCARA_ESTRELAS})`,
                }}
                aria-hidden
              >
                <motion.div className="carta-holo-foco absolute -inset-full" style={{ x: focoX, y: focoY }}>
                  <motion.div className="carta-holo-arco absolute inset-0" style={{ x: arcoX, y: arcoY }} />
                </motion.div>
              </motion.div>
            )}
            {/* Reflexo de vela que acompanha o cursor pelo verniz da carta. */}
            <motion.div className="pointer-events-none absolute inset-[4%] overflow-hidden rounded-[12px] mix-blend-soft-light" style={{ opacity: luz }} aria-hidden>
              <motion.div
                className="absolute -inset-1/2"
                style={{
                  x: reflexoX,
                  y: reflexoY,
                  background: 'radial-gradient(circle at 50% 50%, rgb(255 244 214 / 0.85), rgb(255 220 150 / 0.25) 15%, transparent 30%)',
                }}
              />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-0" style={{ rotateY: 180, visibility: visibilidadeVerso }}>
            <VersoCarta corPrincipal={corPrincipal} tamanho={tamanho} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
