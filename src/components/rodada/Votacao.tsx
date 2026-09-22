import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Escolha, Etapa } from '../../data/rodada';
import { CartaDecisao } from '../cartas/CartaDecisao';

interface VotacaoProps {
  etapa: Etapa;
  combinarLiberado: boolean;
  onEscolher: (escolha: Escolha) => void;
}

const NOMES: Record<Escolha, string> = { planejar: 'Planejar', adaptar: 'Adaptar', combinar: 'Combinar' };
const TEORIAS: Record<Escolha, string> = { planejar: 'Causation', adaptar: 'Effectuation', combinar: 'As duas juntas' };
const ROTACOES = [-8, 0, 8];
const ATRASO_REVELACAO_MS = 1000;

export function Votacao({ etapa, combinarLiberado, onEscolher }: VotacaoProps) {
  const opcoes: Escolha[] = etapa.combinar && combinarLiberado ? ['planejar', 'adaptar', 'combinar'] : ['planejar', 'adaptar'];
  const [selecionada, setSelecionada] = useState<Escolha | null>(null);

  useEffect(() => {
    if (!selecionada) return;
    const id = setTimeout(() => onEscolher(selecionada), ATRASO_REVELACAO_MS);
    return () => clearTimeout(id);
  }, [selecionada, onEscolher]);

  useEffect(() => {
    if (selecionada) return;
    function aoTeclar(evento: KeyboardEvent) {
      const indice = { '1': 0, '2': 1, '3': 2 }[evento.key];
      if (indice !== undefined && opcoes[indice]) setSelecionada(opcoes[indice]);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [opcoes, selecionada]);

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-center font-titulo text-2xl text-moeda">{etapa.perguntaParaTurma}</h2>

      <div className="relative flex min-h-[22rem] flex-wrap items-end justify-center gap-4">
        <AnimatePresence>
          {opcoes.map((escolha, indice) => {
            if (selecionada && escolha !== selecionada) return null;
            const opcao = escolha === 'combinar' ? etapa.combinar! : etapa[escolha];
            return (
              <motion.div
                key={escolha}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <CartaDecisao
                  id={escolha}
                  nome={NOMES[escolha]}
                  teoria={TEORIAS[escolha]}
                  resumo={opcao.texto}
                  onClick={() => !selecionada && setSelecionada(escolha)}
                  rotacao={selecionada ? 0 : ROTACOES[indice] ?? 0}
                  emDestaque={escolha === selecionada}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {selecionada && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm uppercase tracking-widest text-papel/60"
        >
          🥁 revelando...
        </motion.p>
      )}
    </div>
  );
}
