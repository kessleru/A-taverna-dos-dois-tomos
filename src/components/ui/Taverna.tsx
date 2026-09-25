import { useMemo, type CSSProperties } from 'react';
import { gerarBrasas } from '../../engine/brasas';

// Versões "noite": o desfoque e o escurecimento já vêm aplicados no arquivo.
// Com filter no CSS, a pintura (que se mexe sem parar) era refiltrada a cada
// quadro, e em dobro durante a virada de página.
const PINTURA = `${import.meta.env.BASE_URL}assets/cenario/taverna-fundo-noite.webp`;
const TAMPO = `${import.meta.env.BASE_URL}assets/cenario/tampo-mesa-noite.webp`;

// Camadas de trás para frente: pintura, luz de vela, tampo, brasas, vinheta.
export function Taverna() {
  const brasas = useMemo(() => gerarBrasas(26, 7), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="taverna-pintura" style={{ backgroundImage: `url(${PINTURA})` }} />
      <div className="taverna-vela taverna-vela-esquerda" />
      <div className="taverna-vela taverna-vela-direita" />
      <div className="taverna-tampo" style={{ backgroundImage: `url(${TAMPO})` }} />
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
}
