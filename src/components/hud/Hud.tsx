import { conteudo } from '../../data/conteudo';

export function Hud({ fase, mudo, alternarMudo }: { fase: string; mudo: boolean; alternarMudo: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-3 text-sm text-pergaminho/70">
      <span className="font-titulo tracking-wide text-pergaminho/90">A Taverna dos Dois Tomos</span>
      <span className="font-sistema uppercase">{fase}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={alternarMudo}
          className="rounded-full border border-pergaminho/20 px-2 py-1 text-xs hover:border-pergaminho/50"
          title="M: liga/desliga o som"
        >
          {mudo ? '🔇' : '🔊'}
        </button>
        <span>{conteudo.equipe.nome}</span>
      </div>
    </header>
  );
}
