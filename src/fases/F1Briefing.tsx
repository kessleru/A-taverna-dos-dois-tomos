import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { navegarFolha, type Direcao } from '../engine/folhas';
import { Botao } from '../components/ui/Botao';
import { QuadroMadeira } from '../components/ui/QuadroMadeira';
import { FolhaMissao } from './briefing/FolhaMissao';
import { FolhaTomos } from './briefing/FolhaTomos';
import { FolhaDecisoes } from './briefing/FolhaDecisoes';
import { FolhaRegras } from './briefing/FolhaRegras';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

// O briefing é o quadro de missões da taverna, em quatro folhas
// (docs/redesign/10-briefing-quadro.md).
const TOTAL_FOLHAS = 4;
const CHAVE_FOLHA = 'sa-f1-folha';
const TECLAS_AVANCAR = ['ArrowRight', ' ', 'PageDown'];
const TECLAS_VOLTAR = ['ArrowLeft', 'PageUp'];

function lerFolha(): number {
  const salva = Number(sessionStorage.getItem(CHAVE_FOLHA));
  return Number.isInteger(salva) && salva >= 0 && salva < TOTAL_FOLHAS ? salva : 0;
}

interface F1BriefingProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F1Briefing({ som, avancar, voltar }: F1BriefingProps) {
  const [folha, setFolha] = useState(lerFolha);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_FOLHA, String(folha));
  }, [folha]);

  const ir = useCallback(
    (direcao: Direcao) => {
      const destino = navegarFolha(folha, TOTAL_FOLHAS, direcao);
      if (destino.tipo === 'sair') {
        if (direcao === 1) avancar();
        else voltar();
        return;
      }
      som.tocar('pagina');
      setFolha(destino.folha);
    },
    [folha, avancar, voltar, som],
  );

  // Trata as setas antes do useNavegacao (fase de captura): aqui elas trocam
  // de folha e só nas pontas mudam de fase.
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const direcao = TECLAS_AVANCAR.includes(evento.key) ? 1 : TECLAS_VOLTAR.includes(evento.key) ? -1 : 0;
      if (direcao === 0) return;
      // Só preventDefault: o useNavegacao ignora teclas já tratadas, e a tecla
      // ainda chega a quem libera o áudio (stopPropagation deixava o jogo mudo).
      evento.preventDefault();
      ir(direcao);
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [ir]);

  return (
    <section className="flex h-full flex-col gap-5 px-24 pb-5 pt-8">
      <QuadroMadeira className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={folha} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            {folha === 0 && <FolhaMissao />}
            {folha === 1 && <FolhaTomos som={som} />}
            {folha === 2 && <FolhaDecisoes />}
            {folha === 3 && <FolhaRegras />}
          </motion.div>
        </AnimatePresence>
      </QuadroMadeira>

      <nav className="flex items-center justify-between" aria-label="Folhas do briefing">
        <Botao variante="fantasma" onClick={() => ir(-1)}>
          Voltar
        </Botao>
        <ol className="flex gap-4" aria-label={`Folha ${folha + 1} de ${TOTAL_FOLHAS}`}>
          {Array.from({ length: TOTAL_FOLHAS }, (_, i) => (
            <li
              key={i}
              className={`h-5 w-5 rounded-full border-2 ${i === folha ? 'border-cera bg-cera' : 'border-pergaminho/40'}`}
            />
          ))}
        </ol>
        <Botao onClick={() => ir(1)}>Continuar</Botao>
      </nav>
    </section>
  );
}
