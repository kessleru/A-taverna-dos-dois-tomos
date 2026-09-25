import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { temposTransicao } from '../../styles/movimento';
import { travar } from '../../engine/trava';

interface TransicaoPaginaProps {
  chave: string;
  children: ReactNode;
  // Fundo pintado atrás da página que vira, para ela ser uma folha opaca.
  fundo?: ReactNode;
  aoVirar?: () => void;
}

interface Saida {
  chave: string;
  conteudo: ReactNode;
  id: number;
}

// Descola devagar, gira rápido no meio e assenta de perfil.
const CURVA_FOLHA_CSS = 'cubic-bezier(0.55, 0.05, 0.55, 1)';

// Página de tomo virando entre as fases (01-tema-e-hud.md §9): a fase que sai é
// a própria folha. Ela gira para dentro do tomo em volta da lombada (borda
// esquerda do palco) até ficar de perfil, revelando por baixo a fase que entra,
// já montada. Girar para fora cobriria o palco quase o giro todo, e passando de
// 90° a folha sairia do palco, então o giro para aí.
//
// As páginas ficam numa lista com chave, então a fase que sai não é recriada
// (não repete animações nem falas): só ganha a rotação e sai ao fim do giro,
// por temporizador (a saída do AnimatePresence travava depois da rodada).
export function TransicaoPagina({ chave, children, fundo, aoVirar }: TransicaoPaginaProps) {
  const reduzido = !!useReducedMotion();
  const tempos = temposTransicao(reduzido);
  const duracao = reduzido ? tempos.saida + tempos.entrada : tempos.folha;
  const [chaveAtual, setChaveAtual] = useState(chave);
  const [saindo, setSaindo] = useState<Saida | null>(null);
  // Último conteúdo renderizado de cada fase.
  const conteudos = useRef(new Map<string, ReactNode>());
  const contador = useRef(0);
  const aoVirarRef = useRef(aoVirar);
  aoVirarRef.current = aoVirar;

  if (chaveAtual !== chave) {
    // A fase mudou neste render: a anterior vira a folha que sai.
    setSaindo({
      chave: chaveAtual,
      conteudo: conteudos.current.get(chaveAtual),
      id: ++contador.current,
    });
    setChaveAtual(chave);
  } else {
    conteudos.current.set(chave, children);
  }

  useEffect(() => {
    if (!saindo) return;
    aoVirarRef.current?.();
    // Sem cliques até a folha assentar.
    travar(duracao * 1000);
    const id = window.setTimeout(() => {
      conteudos.current.delete(saindo.chave);
      setSaindo(null);
    }, duracao * 1000);
    return () => window.clearTimeout(id);
  }, [saindo, duracao]);

  // Mesma estrutura para a página parada e a que vira: assim a fase que sai
  // continua sendo o mesmo elemento e não é montada de novo.
  function pagina(chavePagina: string, conteudo: ReactNode, virando: boolean) {
    return (
      // A folha vira por animação CSS (compositor), não por JavaScript: a fase
      // nova monta durante o giro, e um pico na thread principal travava a folha
      // no meio do caminho.
      <div
        key={chavePagina}
        className={`absolute inset-0 ${virando ? `pointer-events-none ${reduzido ? 'folha-sumindo' : 'folha-virando'}` : ''}`}
        style={{ zIndex: virando ? 30 : 10, transformOrigin: 'left center', '--duracao': `${duracao}s`, '--curva': CURVA_FOLHA_CSS } as CSSProperties}
      >
        {/* Frente: a fase; enquanto vira, sobre o fundo da taverna. */}
        <div className="absolute inset-0 overflow-hidden">
          {virando && fundo}
          {conteudo}
          {/* A folha escurece ao se afastar da luz das velas. */}
          {virando && !reduzido && <div className="folha-escurece absolute inset-0 bg-gradient-to-l from-black/70 to-black/20" />}
        </div>
      </div>
    );
  }

  const paginas = [pagina(chave, children, false)];
  if (saindo && saindo.chave !== chave) paginas.push(pagina(saindo.chave, saindo.conteudo, true));

  return (
    // perspectiveOrigin na lombada: a folha encolhe em direção a ela ao girar.
    <div className="absolute inset-0" style={{ perspective: 3000, perspectiveOrigin: '0% 50%' }}>
      {paginas}
      {saindo && !reduzido && (
        // Sombra da folha sobre a fase de baixo, que clareia conforme ela passa.
        <div key={`sombra-${saindo.id}`} className="folha-sombra folha-sombra-clareia" style={{ '--duracao': `${duracao}s` } as CSSProperties} />
      )}
    </div>
  );
}
