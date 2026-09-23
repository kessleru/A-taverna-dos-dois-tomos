import { useCallback, useEffect, useState } from 'react';
import { navegarFolha, type Direcao } from './folhas';

const TECLAS_AVANCAR = ['ArrowRight', ' ', 'PageDown'];
const TECLAS_VOLTAR = ['ArrowLeft', 'PageUp'];

interface OpcoesFolhas {
  total: number;
  // Chave no sessionStorage para voltar à mesma folha depois de recarregar.
  chave: string;
  avancar: () => void;
  voltar: () => void;
  aoVirar?: () => void;
}

function lerFolha(chave: string, total: number): number {
  const salva = Number(sessionStorage.getItem(chave));
  return Number.isInteger(salva) && salva >= 0 && salva < total ? salva : 0;
}

// Folhas dentro de uma fase (briefing, confronto, aprendizados): as setas
// percorrem as folhas e só nas pontas passam a fase adiante ou para trás.
export function useFolhas({ total, chave, avancar, voltar, aoVirar }: OpcoesFolhas) {
  const [folha, setFolha] = useState(() => lerFolha(chave, total));

  useEffect(() => {
    sessionStorage.setItem(chave, String(folha));
  }, [chave, folha]);

  const ir = useCallback(
    (direcao: Direcao) => {
      const destino = navegarFolha(folha, total, direcao);
      if (destino.tipo === 'sair') {
        if (direcao === 1) avancar();
        else voltar();
        return;
      }
      aoVirar?.();
      setFolha(destino.folha);
    },
    [folha, total, avancar, voltar, aoVirar],
  );

  // Trata as setas antes do useNavegacao (fase de captura).
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const direcao = TECLAS_AVANCAR.includes(evento.key) ? 1 : TECLAS_VOLTAR.includes(evento.key) ? -1 : 0;
      if (direcao === 0 || evento.defaultPrevented) return;
      // Só preventDefault: o useNavegacao ignora teclas já tratadas, e a tecla
      // ainda chega a quem libera o áudio (stopPropagation deixava o jogo mudo).
      evento.preventDefault();
      ir(direcao);
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [ir]);

  return { folha, ir };
}
