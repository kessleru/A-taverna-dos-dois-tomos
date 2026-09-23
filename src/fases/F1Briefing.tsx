import { useState } from 'react';
import { briefing } from '../data/rodada';
import { conteudo } from '../data/conteudo';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { CartaDecisao } from '../components/cartas/CartaDecisao';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

interface F1BriefingProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F1Briefing({ som, ...props }: F1BriefingProps) {
  const [viradas, setViradas] = useState<Record<string, boolean>>({});
  const [expandido, setExpandido] = useState<string | null>(null);

  function clicarConselheiro(id: string) {
    if (!viradas[id]) {
      som.tocar('virar-carta');
      setViradas((v) => ({ ...v, [id]: true }));
      return;
    }
    som.tocar('clique');
    setExpandido((atual) => (atual === id ? null : id));
  }

  const artigoExpandido = conteudo.artigos.find((a) => a.id === expandido);

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">{briefing.missao.titulo}</Titulo>
      <p className="text-lg text-papel/90">{briefing.missao.texto}</p>

      <h2 className="mt-4 font-titulo text-2xl text-moeda">{briefing.conselheiros.titulo}</h2>
      <p className="text-sm text-papel/60">Clique para virar cada conselheiro e clique de novo para saber mais.</p>
      <div className="flex flex-wrap justify-center gap-6">
        {conteudo.artigos.map((artigo) => (
          <CartaArtigo key={artigo.id} artigo={artigo} virada={!!viradas[artigo.id]} onClick={() => clicarConselheiro(artigo.id)} />
        ))}
      </div>
      {artigoExpandido && (
        <div className="rounded-carta border border-moeda/40 bg-noite-profunda/60 p-4 text-sm text-papel/90">
          <p>
            <strong className="text-moeda">Estratégia:</strong> {artigoExpandido.estrategia}
          </p>
          <p className="mt-2">
            <strong className="text-moeda">Solução:</strong> {artigoExpandido.solucao}
          </p>
        </div>
      )}

      <h2 className="mt-4 font-titulo text-2xl text-moeda">{briefing.jeitosDeDecidir.titulo}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {briefing.jeitosDeDecidir.cartas.map((carta) => (
          <CartaDecisao
            key={carta.id}
            id={carta.id as 'planejar' | 'adaptar' | 'combinar' | 'bricolagem'}
            nome={carta.nome}
            teoria={carta.teoria}
            resumo={carta.resumo}
            trancada={carta.id === 'combinar'}
          />
        ))}
      </div>

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
