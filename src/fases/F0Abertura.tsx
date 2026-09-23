import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Titulo } from '../components/ui/Titulo';
import { Botao } from '../components/ui/Botao';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const LINHAS = ['> buscando periódicos CAPES...', '> 2 artigos encontrados', '> iniciando arena...'];
const VELOCIDADE_MS = 28;

interface F0AberturaProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F0Abertura({ avancar, som }: F0AberturaProps) {
  const [linhaAtual, setLinhaAtual] = useState(0);
  const [texto, setTexto] = useState('');
  const [terminalConcluido, setTerminalConcluido] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (linhaAtual >= LINHAS.length) {
      setTerminalConcluido(true);
      return;
    }
    const linha = LINHAS[linhaAtual];
    if (texto.length < linha.length) {
      const id = setTimeout(() => setTexto(linha.slice(0, texto.length + 1)), VELOCIDADE_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setLinhaAtual((l) => l + 1);
      setTexto('');
    }, 350);
    return () => clearTimeout(id);
  }, [texto, linhaAtual]);

  useEffect(() => {
    if (!terminalConcluido) return;
    setGlitch(true);
    const id = setTimeout(() => setGlitch(false), 400);
    return () => clearTimeout(id);
  }, [terminalConcluido]);

  function comecar() {
    som.tocar('clique');
    avancar();
  }

  return (
    <section className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="h-20 font-sistema text-runa">
        {LINHAS.slice(0, linhaAtual).map((linha) => (
          <span key={linha}>
            {linha}
            <br />
          </span>
        ))}
        {linhaAtual < LINHAS.length && texto}
        {!terminalConcluido && <span className="animate-pulse">▌</span>}
      </p>

      {terminalConcluido && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: glitch ? [0, -4, 4, -2, 2, 0] : 0 }}
            transition={{ duration: 0.4 }}
            style={{ textShadow: '0 0 24px var(--ouro), 0 0 48px var(--tomo-a)' }}
          >
            <Titulo>Startup Arena</Titulo>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Botao onClick={comecar}>Começar</Botao>
          </motion.div>
        </>
      )}
    </section>
  );
}
