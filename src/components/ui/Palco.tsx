import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

  useEffect(() => {
    const aoRedimensionar = () => setQuadro(medir());
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
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
