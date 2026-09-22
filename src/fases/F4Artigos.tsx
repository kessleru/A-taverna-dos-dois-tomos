import { useState } from 'react';
import { conteudo, rotulosAtributos, type Atributo } from '../data/conteudo';
import { comparacao } from '../data/rodada';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import type { FaseProps } from '../types';

const ATRIBUTOS = Object.keys(rotulosAtributos) as Atributo[];

export function F4Artigos(props: FaseProps) {
  const [viradas, setViradas] = useState<Record<string, boolean>>({});
  const [artigoA, artigoB] = conteudo.artigos;

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Os Artigos Lado a Lado</Titulo>
      <p className="text-sm text-papel/60">Clique em cada carta para revelar.</p>

      <div className="flex flex-wrap justify-center gap-6">
        {conteudo.artigos.map((artigo) => (
          <CartaArtigo
            key={artigo.id}
            artigo={artigo}
            virada={!!viradas[artigo.id]}
            onClick={() => setViradas((v) => ({ ...v, [artigo.id]: true }))}
          />
        ))}
      </div>

      <p className="rounded-carta border border-moeda/40 p-4 text-papel/90">
        <strong className="text-moeda">Veredito:</strong> {conteudo.vereditoTexto}
      </p>

      <h2 className="font-titulo text-2xl text-moeda">Semelhanças</h2>
      <ul className="list-disc space-y-1 pl-5 text-papel/90">
        {comparacao.semelhancas.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="font-titulo text-2xl text-moeda">Diferenças</h2>
      <table className="w-full text-left text-papel/90">
        <tbody>
          {comparacao.diferencas.map((linha) => (
            <tr key={linha.tema} className="border-t border-papel/10">
              <td className="py-2 pr-4 font-bold">{linha.tema}</td>
              <td className="py-2 pr-4" style={{ color: 'var(--artigo-a)' }}>
                {linha.A}
              </td>
              <td className="py-2" style={{ color: 'var(--artigo-b)' }}>
                {linha.B}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-titulo text-2xl text-moeda">Atributos</h2>
      <div className="flex flex-col gap-3">
        {ATRIBUTOS.map((atributo) => {
          const a = artigoA.atributos[atributo].valor;
          const b = artigoB.atributos[atributo].valor;
          return (
            <div key={atributo} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
              <div className="flex justify-end">
                <div className="h-3 rounded-l-full" style={{ width: `${a * 6}px`, background: 'var(--artigo-a)' }} />
              </div>
              <span className="w-32 text-center text-papel/70">{rotulosAtributos[atributo]}</span>
              <div className="flex justify-start">
                <div className="h-3 rounded-r-full" style={{ width: `${b * 6}px`, background: 'var(--artigo-b)' }} />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="font-titulo text-2xl text-moeda">Tema central</h2>
      <p className="text-xl text-papel/90">{conteudo.temaCentral}</p>

      <ControlesFase {...props} />
    </section>
  );
}
