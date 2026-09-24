import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Tela exibida enquanto imagens, sons e fontes carregam. Segura o teclado
// para ninguém avançar de fase às cegas antes de o jogo aparecer.
export function TelaCarregamento({ progresso }: { progresso: number }) {
  useEffect(() => {
    // Marca as teclas do jogo como tratadas (os atalhos ignoram teclas com
    // defaultPrevented), mas deixa passar recarregar, atalhos com Ctrl e o F
    // de tela cheia.
    function bloquear(evento: KeyboardEvent) {
      if (evento.key === 'F5' || evento.ctrlKey || evento.metaKey || evento.key.toLowerCase() === 'f') return;
      evento.preventDefault();
    }
    window.addEventListener('keydown', bloquear, true);
    return () => window.removeEventListener('keydown', bloquear, true);
  }, []);

  const porcento = Math.round(Math.min(1, Math.max(0, progresso)) * 100);

  return (
    <motion.div
      className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-10 bg-madeira-profunda"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={porcento}
      aria-label="Carregando o jogo"
    >
      <h1 className="titulo-ouro font-titulo text-[72px] font-bold tracking-[0.04em]">A Taverna dos Dois Tomos</h1>
      <div className="filigrana text-[22px] text-ouro" aria-hidden>✦</div>
      <p className="font-texto text-[34px] italic text-pergaminho/80">Preparando a taverna...</p>
      {/* Barra de ouro forjado numa placa de ferro rebitada. */}
      <div className="placa-ferro h-11 w-[900px] px-5 py-[11px]">
        <div className="h-full bg-[#0b0806] shadow-[inset_0_2px_4px_rgb(0_0_0/0.9)]">
          <div
            className="barra-forjada h-full bg-gradient-to-r from-ouro-escuro via-ouro to-ouro-claro transition-[width] duration-200"
            style={{ width: `${porcento}%` }}
          />
        </div>
      </div>
      <p className="font-titulo text-[32px] font-bold text-ouro">{porcento}%</p>
    </motion.div>
  );
}
