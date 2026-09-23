import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { temposTransicao } from '../../styles/movimento';

interface TransicaoPaginaProps {
  chave: string;
  children: ReactNode;
  aoVirar?: () => void;
}

export function TransicaoPagina({ chave, children, aoVirar }: TransicaoPaginaProps) {
  const tempos = temposTransicao(!!useReducedMotion());
  // Conta as viradas para reiniciar a folha a cada troca (e não animar no carregamento).
  const [viradas, setViradas] = useState(0);
  const chaveAnterior = useRef(chave);
  const aoVirarRef = useRef(aoVirar);
  aoVirarRef.current = aoVirar;

  useEffect(() => {
    if (chaveAnterior.current === chave) return;
    chaveAnterior.current = chave;
    setViradas((v) => v + 1);
    aoVirarRef.current?.();
  }, [chave]);

  return (
    // perspectiveOrigin na borda esquerda: a folha fica de perfil (invisível)
    // no começo e no fim do giro, em vez de aparecer como uma parede.
    <div className="absolute inset-0" style={{ perspective: 4000, perspectiveOrigin: '0% 50%' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={chave}
          className="absolute inset-0"
          initial={{ opacity: tempos.entrada > 0 ? 0 : 1 }}
          animate={{ opacity: 1, transition: { duration: tempos.entrada } }}
          // A fase antiga fica na tela até a folha cobrir tudo (0,999: o
          // Framer só respeita a duração se o valor mudar).
          exit={{ opacity: tempos.entrada > 0 ? 0 : 0.999, transition: { duration: tempos.saida } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {tempos.folha > 0 && viradas > 0 && (
        <motion.div
          key={viradas}
          className="folha-pagina"
          style={{ transformOrigin: 'left center' }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: -90, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: tempos.folha,
            ease: 'easeInOut',
            opacity: { duration: tempos.folha, times: [0, 0.12, 0.88, 1] },
          }}
        />
      )}
    </div>
  );
}
