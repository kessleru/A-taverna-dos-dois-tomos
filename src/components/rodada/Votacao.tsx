import { useEffect } from 'react';
import type { Escolha, Etapa } from '../../data/rodada';

interface VotacaoProps {
  etapa: Etapa;
  combinarLiberado: boolean;
  onEscolher: (escolha: Escolha) => void;
}

const CORES: Record<Escolha, string> = {
  planejar: 'var(--planejar)',
  adaptar: 'var(--adaptar)',
  combinar: 'var(--moeda)',
};

const ICONES: Record<Escolha, string> = { planejar: '📋', adaptar: '🧭', combinar: '🔀' };
const NOMES: Record<Escolha, string> = { planejar: 'Planejar', adaptar: 'Adaptar', combinar: 'Combinar' };

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
    <div className="flex flex-col gap-6">
      <h2 className="font-titulo text-2xl text-moeda">{etapa.perguntaParaTurma}</h2>
      <div className="flex flex-wrap gap-4">
        {opcoes.map((escolha) => {
          const opcao = escolha === 'combinar' ? etapa.combinar! : etapa[escolha];
          return (
            <button
              key={escolha}
              onClick={() => onEscolher(escolha)}
              className="w-64 rounded-carta border-2 p-4 text-left transition-transform hover:-translate-y-1"
              style={{ borderColor: CORES[escolha], boxShadow: 'var(--sombra-carta)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ICONES[escolha]}</span>
                <span className="font-titulo text-lg" style={{ color: CORES[escolha] }}>
                  {NOMES[escolha]}
                </span>
              </div>
              <p className="mt-2 text-sm text-papel/85">{opcao.texto}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
