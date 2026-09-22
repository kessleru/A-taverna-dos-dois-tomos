import { conteudo } from '../../data/conteudo';

export function Hud({ fase }: { fase: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-3 text-sm text-papel/70">
      <span className="font-titulo tracking-wide text-papel/90">Startup Arena</span>
      <span className="font-mono uppercase">{fase}</span>
      <span>{conteudo.equipe.nome}</span>
    </header>
  );
}
