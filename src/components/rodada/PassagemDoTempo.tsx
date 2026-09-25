import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Etapa } from '../../data/rodada';
import { anosEntre } from '../../engine/historia';
import { useSomDoJogo } from '../../engine/SomContexto';
import { mola } from '../../styles/movimento';
import { Icone } from '../ui/Icone';
import { Cintilas } from '../ui/Particulas';

// Tempos da passagem: a ampulheta vira, os anos folheiam um a um e o último
// fica um instante na mesa antes do capítulo novo abrir.
const ENTRADA_MS = 800;
const POR_ANO_MS = 850;
const PAUSA_FINAL_MS = 1500;
const REDUZIDO_MS = 1600;
// O relógio corre baixinho por baixo de tudo, duas batidas por segundo.
const TIQUE_MS = 500;
const PARTICULAS = `${import.meta.env.BASE_URL}assets/particulas/`;
// Redemoinhos de tempo em volta da ampulheta (Kenney Particle Pack): tamanho,
// textura e sentido do giro de cada um.
const REDEMOINHOS = [
  { lado: 250, textura: 'twirl-01', inverte: false, duracao: 1.6 },
  { lado: 200, textura: 'twirl-02', inverte: true, duracao: 1.2 },
  { lado: 280, textura: 'twirl-03', inverte: false, duracao: 2.1 },
];
const BRILHOS = [
  { x: 14, y: 30, tamanho: 46, atraso: 0.2 },
  { x: 86, y: 22, tamanho: 38, atraso: 0.7 },
  { x: 92, y: 70, tamanho: 30, atraso: 1.1 },
  { x: 6, y: 78, tamanho: 34, atraso: 1.5 },
  { x: 50, y: 4, tamanho: 26, atraso: 0.9 },
];

// Duração total, para quem precisa esperar por ela (e para os testes).
export function duracaoPassagem(quantidadeDeAnos: number, reduzido = false): number {
  if (reduzido) return REDUZIDO_MS;
  return ENTRADA_MS + Math.max(0, quantidadeDeAnos - 2) * POR_ANO_MS + PAUSA_FINAL_MS;
}

// Passagem do tempo entre dois capítulos: uma ampulheta que vira e o ano
// avançando como um calendário folheado (2017 → 2018 → 2019), com uma frase
// do que aconteceu no meio-tempo. É curta e some sozinha; clique ou → pulam.
// O que o capítulo novo tem de som e fala só começa depois dela.
export function PassagemDoTempo({ de, para, aoTerminar }: { de: Etapa; para: Etapa; aoTerminar: () => void }) {
  const reduzido = !!useReducedMotion();
  const anos = anosEntre(de.capitulo.ano, para.capitulo.ano);
  const [indice, setIndice] = useState(reduzido ? anos.length - 1 : 0);
  const som = useSomDoJogo();
  const somRef = useRef(som);
  somRef.current = som;
  const aoTerminarRef = useRef(aoTerminar);
  aoTerminarRef.current = aoTerminar;

  useEffect(() => {
    const ids: number[] = [];
    if (!reduzido) {
      // O vidro da ampulheta tilinta ao virar; depois o relógio corre.
      ids.push(window.setTimeout(() => somRef.current?.tocar('vidro'), 150));
      const relogio = window.setInterval(() => somRef.current?.tocar('relogio', { volume: 0.45 }), TIQUE_MS);
      ids.push(window.setTimeout(() => window.clearInterval(relogio), duracaoPassagem(anos.length) - 200));
      ids.push(relogio);
      for (let i = 1; i < anos.length; i++) {
        ids.push(
          window.setTimeout(() => {
            setIndice(i);
            somRef.current?.tocar('pagina');
          }, ENTRADA_MS + (i - 1) * POR_ANO_MS),
        );
      }
    }
    ids.push(window.setTimeout(() => aoTerminarRef.current(), duracaoPassagem(anos.length, reduzido)));
    return () =>
      ids.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
    // Uma passagem por montagem.
  }, []);

  return (
    <motion.div
      className="flex cursor-pointer flex-col items-center gap-2 text-center"
      onClick={aoTerminar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      aria-live="polite"
    >
      {/* A ampulheta vira no começo, como quem diz "o tempo passou", dentro de
          um redemoinho dourado que gira forte e depois assenta. */}
      <div className="relative flex h-[170px] w-[170px] items-center justify-center">
        {!reduzido && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.9, 0.35], scale: [0.6, 1.1, 1] }}
            transition={{ duration: 1.6, times: [0, 0.35, 1], ease: 'easeOut' }}
            aria-hidden
          >
            {REDEMOINHOS.map((r) => (
              <span
                key={r.textura}
                className="redemoinho"
                style={{
                  width: r.lado,
                  height: r.lado,
                  WebkitMaskImage: `url(${PARTICULAS}${r.textura}.webp)`,
                  maskImage: `url(${PARTICULAS}${r.textura}.webp)`,
                  animationDuration: `${r.duracao}s`,
                  animationDirection: r.inverte ? 'reverse' : 'normal',
                }}
              />
            ))}
          </motion.div>
        )}
        <motion.span
          className="relative text-ouro [filter:drop-shadow(0_0_18px_rgb(232_182_74/0.55))_drop-shadow(0_8px_10px_rgb(0_0_0/0.8))]"
          initial={false}
          animate={reduzido ? undefined : { rotate: [0, 180] }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.6, 0, 0.3, 1] }}
        >
          <Icone nome="hourglass" className="h-[150px] w-[150px]" />
        </motion.span>
      </div>
      {/* O ano, folheado como um calendário: o velho sobe, o novo chega de baixo. */}
      <div className="relative h-[170px] w-[640px]" aria-label={`Ano ${anos[indice]}`}>
        {/* Aura de luz atrás do ano e estrelas piscando em volta. */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background: 'radial-gradient(circle, var(--ouro-claro), var(--ouro) 60%)',
            WebkitMaskImage: `url(${PARTICULAS}light-01.webp)`,
            maskImage: `url(${PARTICULAS}light-01.webp)`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
          aria-hidden
        />
        <Cintilas pontos={BRILHOS} />
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.p
              key={anos[indice]}
              className="titulo-ouro absolute inset-0 font-titulo text-[150px] font-bold leading-[170px]"
              initial={{ y: 130, opacity: 0, rotateX: -60 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: -130, opacity: 0, rotateX: 60 }}
              transition={mola.carta}
            >
              {anos[indice]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      {para.capitulo.passagem && (
        <motion.p
          className="max-w-[1000px] font-texto text-[34px] italic leading-snug text-pergaminho/90 [text-shadow:0_2px_4px_rgb(0_0_0/0.95)]"
          initial={reduzido ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduzido ? 0 : 0.5, duration: 0.5 }}
        >
          {para.capitulo.passagem}
        </motion.p>
      )}
    </motion.div>
  );
}
