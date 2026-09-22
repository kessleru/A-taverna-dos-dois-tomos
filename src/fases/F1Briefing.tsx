import { briefing } from '../data/rodada';
import { conteudo } from '../data/conteudo';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import type { FaseProps } from '../types';

export function F1Briefing(props: FaseProps) {
  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">{briefing.missao.titulo}</Titulo>
      <p className="text-lg text-papel/90">{briefing.missao.texto}</p>

      <h2 className="mt-4 font-titulo text-2xl text-moeda">{briefing.conselheiros.titulo}</h2>
      <ul className="space-y-2 text-papel/90">
        {conteudo.artigos.map((artigo) => (
          <li key={artigo.id}>
            <strong style={{ color: artigo.id === 'A' ? 'var(--artigo-a)' : 'var(--artigo-b)' }}>
              {artigo.tituloCurto}:
            </strong>{' '}
            {briefing.conselheiros[artigo.id as 'A' | 'B']}
          </li>
        ))}
      </ul>

      <h2 className="mt-4 font-titulo text-2xl text-moeda">{briefing.jeitosDeDecidir.titulo}</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {briefing.jeitosDeDecidir.cartas.map((carta) => (
          <li key={carta.id} className="rounded-carta border border-papel/20 p-3 text-center">
            <div className="text-3xl">{carta.icone}</div>
            <div className="font-titulo text-sm">{carta.nome}</div>
            <div className="text-xs text-papel/60">{carta.teoria}</div>
          </li>
        ))}
      </ul>

      <h2 className="mt-4 font-titulo text-2xl text-moeda">{briefing.regras.titulo}</h2>
      <ol className="list-decimal space-y-1 pl-5 text-papel/90">
        {briefing.regras.itens.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <ControlesFase {...props} />
    </section>
  );
}
