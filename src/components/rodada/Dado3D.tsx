import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dadoDaIncerteza } from '../../data/rodada';
import { Botao } from '../ui/Botao';

const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

function Face({ numero }: { numero: number }) {
  return (
    <div className="grid h-16 w-16 grid-cols-3 grid-rows-3 gap-1 rounded-lg bg-moeda p-2 shadow-carta">
      {Array.from({ length: 9 }).map((_, indice) => {
        const linha = Math.floor(indice / 3);
        const coluna = indice % 3;
        const ativo = PIPS[numero]?.some(([l, c]) => l === linha && c === coluna);
        return <span key={indice} className={`rounded-full ${ativo ? 'bg-tinta' : ''}`} />;
      })}
    </div>
  );
}

const DURACAO_ROLAGEM_MS = 1200;

interface Dado3DProps {
  ultimoDado?: number;
  onRolar: () => void;
  avancar: () => void;
}

export function Dado3D({ ultimoDado, onRolar, avancar }: Dado3DProps) {
  const [rolando, setRolando] = useState(false);
  const [faceAnimada, setFaceAnimada] = useState(1);

  useEffect(() => {
    if (!rolando) return;
    const intervalo = setInterval(() => setFaceAnimada((f) => (f % 6) + 1), 90);
    const fim = setTimeout(() => {
      clearInterval(intervalo);
      setRolando(false);
      onRolar();
    }, DURACAO_ROLAGEM_MS);
    return () => {
      clearInterval(intervalo);
      clearTimeout(fim);
    };
  }, [rolando, onRolar]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="font-titulo text-2xl text-moeda">Dado da Incerteza</h2>
      <p className="max-w-md text-papel/80">{dadoDaIncerteza.explicacao}</p>

      {rolando && (
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
        >
          <Face numero={faceAnimada} />
        </motion.div>
      )}

      {!rolando && ultimoDado && (
        <>
          <motion.div initial={{ scale: 0.5, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Face numero={ultimoDado} />
          </motion.div>
          <p className="font-titulo text-xl">{dadoDaIncerteza.faces[ultimoDado].titulo}</p>
          <Botao onClick={avancar}>Avançar →</Botao>
        </>
      )}

      {!rolando && !ultimoDado && <Botao onClick={() => setRolando(true)}>🎲 Rolar o dado</Botao>}
    </div>
  );
}
