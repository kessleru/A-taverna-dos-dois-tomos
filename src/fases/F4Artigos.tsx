import { conteudo } from '../data/conteudo';
import { comparacao } from '../data/rodada';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import type { FaseProps } from '../types';

export function F4Artigos(props: FaseProps) {
  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Os Artigos Lado a Lado</Titulo>
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

      <h2 className="font-titulo text-2xl text-moeda">Tema central</h2>
      <p className="text-xl text-papel/90">{conteudo.temaCentral}</p>

      <ControlesFase {...props} />
    </section>
  );
}
