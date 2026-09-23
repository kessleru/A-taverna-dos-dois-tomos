import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CARACTERES_POR_SEGUNDO, digitar } from '../../engine/digitacao';
import { Icone } from './Icone';

interface GrimorioProps {
  linhas: string[];
  // Mostra tudo de uma vez (também automático com movimento reduzido).
  instantaneo?: boolean;
  compacto?: boolean;
  aoConcluir?: () => void;
  className?: string;
}

function useDigitacao(linhas: string[], instantaneo: boolean) {
  const [caracteres, setCaracteres] = useState(0);
  const total = linhas.reduce((soma, linha) => soma + linha.length, 0);

  useEffect(() => {
    if (instantaneo || caracteres >= total) return;
    const id = setTimeout(() => setCaracteres((c) => c + 1), 1000 / CARACTERES_POR_SEGUNDO);
    return () => clearTimeout(id);
  }, [caracteres, total, instantaneo]);

  return digitar(linhas, instantaneo ? total : caracteres);
}

export function Grimorio({ linhas, instantaneo = false, compacto = false, aoConcluir, className = '' }: GrimorioProps) {
  const reduzido = useReducedMotion();
  const { linhas: visiveis, completo } = useDigitacao(linhas, instantaneo || !!reduzido);
  const aoConcluirRef = useRef(aoConcluir);
  aoConcluirRef.current = aoConcluir;

  useEffect(() => {
    if (completo) aoConcluirRef.current?.();
  }, [completo]);

  // A pena acompanha o texto enquanto ele é escrito e some no fim.
  const pena = completo ? null : <Icone nome="quill-ink" className="grimorio-pena" />;

  return (
    <div className={`grimorio ${compacto ? 'grimorio-compacto' : ''} ${className}`}>
      <span className="grimorio-marcador">Grimório</span>
      {/* Leitor de tela recebe o texto inteiro, não letra por letra. */}
      <p className="sr-only">{linhas.join('. ')}</p>
      <div aria-hidden>
        {visiveis.length === 0 && <p className="grimorio-linha">{pena}</p>}
        {visiveis.map((linha, i) => (
          <p key={i} className="grimorio-linha">
            {linha}
            {i === visiveis.length - 1 && pena}
          </p>
        ))}
      </div>
    </div>
  );
}
