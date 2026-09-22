import { useEffect, useState } from 'react';

export function ContadorAnimado({ valor, duracaoMs = 1200 }: { valor: number; duracaoMs?: number }) {
  const [exibido, setExibido] = useState(0);

  useEffect(() => {
    let inicio: number | null = null;
    let quadro: number;
    function passo(agora: number) {
      if (inicio === null) inicio = agora;
      const progresso = Math.min(1, (agora - inicio) / duracaoMs);
      setExibido(Math.round(progresso * valor));
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    }
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor, duracaoMs]);

  return <>{exibido}</>;
}
