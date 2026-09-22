import { conteudo } from '../data/conteudo';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import { CartaLendaria } from '../components/cartas/CartaLendaria';
import type { FaseProps } from '../types';

export function F5Fusao(props: FaseProps) {
  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col items-center gap-6 overflow-y-auto px-6 py-10">
      <CartaLendaria />
      <Titulo className="text-4xl">Aprendizados</Titulo>
      <ol className="list-decimal space-y-2 pl-5 text-lg text-papel/90">
        {conteudo.aprendizados.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <ControlesFase {...props} />
    </section>
  );
}
