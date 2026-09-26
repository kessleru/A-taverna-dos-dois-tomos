import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArtePintada } from './ArtePintada';
import { marcarVisto, naoVistos } from '../../engine/vistos';

const FUMACA = `${import.meta.env.BASE_URL}assets/particulas/smoke-07.webp`;

const idDica = (dica: string) => `carregamento:${dica}`;

// Enquanto a taverna prepara as mesas, o Taverneiro dá umas dicas. Só o que
// o jogo não conta em outro lugar (botão direito, atalhos e números dos tomos
// já aparecem no tutorial, no título e no Grimório), cada uma uma vez: sem dar
// a volta, e sem repetir depois de recarregar a página.
export const DICAS = ['M liga e desliga o som. F deixa em tela cheia.', 'Cliquem na mesa. Várias vezes. A taverna sente.'];
const TROCA_DICA_MS = 3800;

// Tela exibida enquanto imagens, sons e fontes carregam. Segura o teclado
// para ninguém avançar de fase às cegas antes de o jogo aparecer.
export function TelaCarregamento({ progresso, aquecendo = false }: { progresso: number; aquecendo?: boolean }) {
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
  const [dicas] = useState(() => naoVistos(DICAS, idDica));
  const [dica, setDica] = useState(0);
  useEffect(() => {
    if (dicas.length === 0) return;
    marcarVisto(idDica(dicas[dica]));
    // Para na última: nada de recomeçar a lista numa carga demorada.
    if (dica >= dicas.length - 1) return;
    const id = window.setTimeout(() => setDica((d) => d + 1), TROCA_DICA_MS);
    return () => window.clearTimeout(id);
  }, [dica, dicas]);

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
      {/* A vela da taverna acesa enquanto tudo carrega: o castiçal fica
          parado e só a chama vive (halo, língua de fogo e um fio de fumaça,
          por cima da chama pintada). */}
      <span className="vela-carregando" aria-hidden>
        <ArtePintada nome="vela" className="h-[170px] w-[122px]" />
        <span className="vela-halo" />
        <span className="vela-lingua" />
        <span className="vela-fumaca" style={{ WebkitMaskImage: `url(${FUMACA})`, maskImage: `url(${FUMACA})` }} />
      </span>
      <h1 className="titulo-ouro font-titulo text-[72px] font-bold tracking-[0.04em]">A Taverna dos Dois Tomos</h1>
      <div className="filigrana text-[22px] text-ouro" aria-hidden>✦</div>
      <p className="font-texto text-[34px] italic text-pergaminho/80">{aquecendo ? 'Acendendo as velas...' : 'Preparando a taverna...'}</p>
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
      <div className="h-[44px]">
        <AnimatePresence mode="wait">
          {dicas[dica] && (
            <motion.p
              key={dica}
              className="font-texto text-[30px] italic text-pergaminho/75"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <span className="font-titulo text-[24px] font-bold not-italic text-ouro/80">Dica · </span>
              {dicas[dica]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
