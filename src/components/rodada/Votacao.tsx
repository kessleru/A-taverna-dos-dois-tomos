import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Escolha, Etapa } from '../../data/rodada';
import { CartaDecisao } from '../cartas/CartaDecisao';
import { LeituraMapa } from './LeituraMapa';

interface VotacaoProps {
  etapa: Etapa;
  combinarLiberado: boolean;
  onEscolher: (escolha: Escolha) => void;
  aoSelecionar?: () => void;
}

const NOMES: Record<Escolha, string> = { planejar: 'Planejar', adaptar: 'Adaptar', combinar: 'Combinar' };
const TEORIAS: Record<Escolha, string> = { planejar: 'Causation', adaptar: 'Effectuation', combinar: 'As duas juntas' };
const ROTACOES = [-4, 0, 4];
// Suspense entre a turma escolher e a carta ser jogada (rufar de tambor).
const ATRASO_REVELACAO_MS = 1500;

// Votação (02-jogabilidade.md §2): a Leitura do Mapa, a pergunta grande e as
// cartas numeradas; a turma levanta a mão e o apresentador clica ou tecla 1/2/3.
export function Votacao({ etapa, combinarLiberado, onEscolher, aoSelecionar }: VotacaoProps) {
  const opcoes: Escolha[] = etapa.combinar && combinarLiberado ? ['planejar', 'adaptar', 'combinar'] : ['planejar', 'adaptar'];
  const [selecionada, setSelecionada] = useState<Escolha | null>(null);

  function selecionar(escolha: Escolha) {
    if (selecionada) return;
    setSelecionada(escolha);
    aoSelecionar?.();
  }

  useEffect(() => {
    if (!selecionada) return;
    const id = setTimeout(() => onEscolher(selecionada), ATRASO_REVELACAO_MS);
    return () => clearTimeout(id);
  }, [selecionada, onEscolher]);

  useEffect(() => {
    if (selecionada) return;
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.defaultPrevented || evento.shiftKey) return;
      const indice = { '1': 0, '2': 1, '3': 2 }[evento.key];
      if (indice !== undefined && opcoes[indice]) selecionar(opcoes[indice]);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-center font-titulo text-[46px] font-bold leading-tight text-ouro [text-shadow:0_3px_6px_rgb(0_0_0/0.9)]">
        {etapa.perguntaParaTurma}
      </h2>
      <LeituraMapa etapa={etapa} opcoes={opcoes} />
      <div className="relative flex min-h-[440px] items-end justify-center gap-16" data-guia="cartas">
        <AnimatePresence>
          {opcoes.map((escolha, indice) => {
            if (selecionada && escolha !== selecionada) return null;
            const opcao = escolha === 'combinar' ? etapa.combinar! : etapa[escolha];
            return (
              <motion.div
                key={escolha}
                layout
                initial={{ opacity: 0, y: 60, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0, clipPath: 'inset(-60px -60px -60px -60px)' }}
                // A carta descartada queima de baixo para cima.
                exit={{
                  clipPath: 'inset(-60px -60px 100% -60px)',
                  filter: 'sepia(1) saturate(4) hue-rotate(-20deg) brightness(0.8)',
                  transition: { duration: 0.9, ease: 'easeIn' },
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 1.2 + indice * 0.15 }}
              >
                <CartaDecisao
                  id={escolha}
                  nome={NOMES[escolha]}
                  teoria={TEORIAS[escolha]}
                  resumo={opcao.texto}
                  onClick={() => selecionar(escolha)}
                  rotacao={selecionada ? 0 : ROTACOES[indice] ?? 0}
                  emDestaque={escolha === selecionada}
                  tecla={indice + 1}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
