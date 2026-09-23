import { useEffect, useRef } from 'react';
import { useSomDoJogo } from './SomContexto';
import type { Efeito } from './useSom';

// Toca efeitos no compasso de uma animação: [efeito, milissegundos depois de montar].
// Roda uma vez ao montar; quem muda de conteúdo troca a chave do componente.
export function useSonsEmSequencia(sequencia: readonly (readonly [Efeito, number])[]): void {
  const som = useSomDoJogo();
  const somRef = useRef(som);
  somRef.current = som;
  const sequenciaRef = useRef(sequencia);

  useEffect(() => {
    const ids = sequenciaRef.current.map(([efeito, ms]) => window.setTimeout(() => somRef.current?.tocar(efeito), ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, []);
}
