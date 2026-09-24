import { conteudo, preenchido } from '../../data/conteudo';
import type { Fase } from '../../types';

// Nome de cada fase como a turma a conhece (a chave interna não tem acento).
const NOME_FASE: Record<Fase, string> = {
  abertura: 'Abertura',
  briefing: 'A Taverna',
  rodada: 'A Crônica',
  resultado: 'Resultado',
  artigos: 'Confronto dos Tomos',
  fusao: 'Fusão',
};

// Alto-falante desenhado, no dourado do resto do HUD (emoji destoava do tema).
function IconeSom({ mudo }: { mudo: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {mudo ? (
        <path d="M17 9l5 6M22 9l-5 6" />
      ) : (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a8.5 8.5 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

export function Hud({ fase, mudo, alternarMudo }: { fase: Fase; mudo: boolean; alternarMudo: () => void }) {
  const equipe = conteudo.equipe.nome;
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-3 text-[18px] text-pergaminho/70">
      <span className="font-titulo tracking-wide text-pergaminho/90">A Taverna dos Dois Tomos</span>
      <span className="flex items-center gap-3 font-titulo text-[17px] uppercase tracking-[0.2em] text-ouro/80">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-ouro/60" aria-hidden />
        {NOME_FASE[fase]}
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-ouro/60" aria-hidden />
      </span>
      <div className="flex items-center gap-3">
        {preenchido(equipe) && <span className="font-texto">{equipe}</span>}
        <button
          onClick={alternarMudo}
          data-sem-trava
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
            mudo ? 'border-dano/60 text-dano' : 'border-ouro/40 text-ouro/80 hover:border-ouro hover:text-ouro'
          }`}
          title="M: liga/desliga o som"
          aria-label={mudo ? 'Ligar o som' : 'Desligar o som'}
        >
          <IconeSom mudo={mudo} />
        </button>
      </div>
    </header>
  );
}
