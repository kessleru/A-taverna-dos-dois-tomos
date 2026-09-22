import { useEffect } from 'react';
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

export function Votacao({ etapa, combinarLiberado, onEscolher }: VotacaoProps) {
  const opcoes: Escolha[] = etapa.combinar && combinarLiberado ? ['planejar', 'adaptar', 'combinar'] : ['planejar', 'adaptar'];

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const indice = { '1': 0, '2': 1, '3': 2 }[evento.key];
      if (indice !== undefined && opcoes[indice]) onEscolher(opcoes[indice]);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [opcoes, onEscolher]);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-titulo text-2xl text-moeda">{etapa.perguntaParaTurma}</h2>
      <div className="flex flex-wrap items-end justify-center gap-4">
        {opcoes.map((escolha, indice) => {
          const opcao = escolha === 'combinar' ? etapa.combinar! : etapa[escolha];
          return (
            <CartaDecisao
              key={escolha}
              id={escolha}
              nome={NOMES[escolha]}
              teoria={TEORIAS[escolha]}
              resumo={opcao.texto}
              onClick={() => onEscolher(escolha)}
              rotacao={ROTACOES[indice] ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
}
