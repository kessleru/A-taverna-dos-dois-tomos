import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ALTURA_PALCO, LARGURA_PALCO, enquadrarPalco } from '../../engine/palco';

// Escala atual, para quem precisar converter coordenadas da tela para o
// palco (tutorial, iteração 4): coordenada no palco = coordenada na tela / escala.
const EscalaPalco = createContext(1);

export function useEscalaPalco(): number {
  return useContext(EscalaPalco);
}

function medir() {
  return enquadrarPalco(window.innerWidth, window.innerHeight);
}

export function Palco({ children }: { children: ReactNode }) {
  const [quadro, setQuadro] = useState(medir);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aoRedimensionar = () => setQuadro(medir());
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);

  // Cursor "apertando" (src/styles/cursor.css) enquanto algum botão do mouse
  // está pressionado. Direto no atributo, sem estado: não re-renderiza o jogo.
  useEffect(() => {
    const elemento = raiz.current;
    if (!elemento) return;
    const apertar = () => elemento.setAttribute('data-apertando', '');
    const soltar = () => elemento.removeAttribute('data-apertando');
    window.addEventListener('pointerdown', apertar, true);
    window.addEventListener('pointerup', soltar, true);
    window.addEventListener('pointercancel', soltar, true);
    window.addEventListener('blur', soltar);
    return () => {
      window.removeEventListener('pointerdown', apertar, true);
      window.removeEventListener('pointerup', soltar, true);
      window.removeEventListener('pointercancel', soltar, true);
      window.removeEventListener('blur', soltar);
    };
  }, []);

  return (
    // O botão direito é do jogo (amplia cartas): o menu do navegador não abre no palco.
    <div ref={raiz} className="palco-jogo fixed inset-0 overflow-hidden bg-black" onContextMenu={(evento) => evento.preventDefault()}>
      {/* O transform faz deste div o bloco de contenção dos filhos com
          position: fixed, então HUD e overlays ficam presos ao palco. */}
      <div
        className="absolute left-0 top-0 overflow-hidden bg-madeira"
        style={{
          width: LARGURA_PALCO,
          height: ALTURA_PALCO,
          transform: `translate(${quadro.x}px, ${quadro.y}px) scale(${quadro.escala})`,
          transformOrigin: 'top left',
        }}
      >
        <EscalaPalco.Provider value={quadro.escala}>{children}</EscalaPalco.Provider>
      </div>
    </div>
  );
}
