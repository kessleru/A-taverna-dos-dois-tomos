import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSonsEmSequencia } from '../../engine/useSonsEmSequencia';
import { useSomDoJogo } from '../../engine/SomContexto';
import type { Momento } from '../../engine/falas';

const TAVERNEIRO = `${import.meta.env.BASE_URL}assets/personagens/taverneiro.webp`;
const MS_POR_LETRA = 18;

interface BalaoGuiaProps {
  texto: string;
  fala?: Momento;
  x: number;
  y: number;
  largura: number;
  ultimo: boolean;
  reduzido: boolean;
}

// Pergaminho com o retrato do Taverneiro e o texto digitado rápido.
export function BalaoGuia({ texto, fala, x, y, largura, ultimo, reduzido }: BalaoGuiaProps) {
  const [letras, setLetras] = useState(reduzido ? texto.length : 0);
  useSonsEmSequencia([['pagina', 0]]);
  const som = useSomDoJogo();
  const somRef = useRef(som);
  somRef.current = som;

  // A voz do Taverneiro lê o balão (cada balão é montado de novo, com chave).
  useEffect(() => {
    if (fala) somRef.current?.falar(fala);
  }, [fala]);

  useEffect(() => {
    if (reduzido) return;
    const id = window.setInterval(() => setLetras((n) => (n >= texto.length ? n : n + 1)), MS_POR_LETRA);
    return () => window.clearInterval(id);
  }, [texto, reduzido]);

  return (
    <motion.div
      className="pergaminho-sombra absolute"
      style={{ left: x, top: y, width: largura }}
      initial={reduzido ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="pergaminho flex items-start gap-5 px-7 pb-5 pt-6">
        <img src={TAVERNEIRO} alt="" className="h-[104px] w-[104px] shrink-0 rounded-full border-4 border-ouro-escuro object-cover object-top" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="font-titulo text-[22px] font-bold leading-none text-cera">O Taverneiro</p>
          {/* O texto inteiro ocupa o espaço desde o começo; só a parte digitada aparece. */}
          <p className="font-texto text-[32px] leading-snug">
            {texto.slice(0, letras)}
            <span className="invisible">{texto.slice(letras)}</span>
          </p>
          <p className="self-end font-texto text-[22px] italic text-tinta/70">{ultimo ? 'clique para jogar →' : 'clique para continuar →'}</p>
        </div>
      </div>
    </motion.div>
  );
}
