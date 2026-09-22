import { perfis, caminhoReal } from '../data/rodada';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import type { FaseProps } from '../types';

// Placeholder textual da Iteração 1. O brasão do perfil, o contador animado
// e as trilhas comparativas entram na Iteração 5 (F3 com brasão e trilhas).
export function F3Resultado(props: FaseProps) {
  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Resultado</Titulo>
      <p className="text-papel/80">
        Ao final da rodada, a turma recebe um perfil (ex.: {perfis.lendario.emoji} {perfis.lendario.nome}) e compara
        suas escolhas com o caminho real da startup:
      </p>
      <ol className="space-y-1 text-papel/90">
        {caminhoReal.map((passo) => (
          <li key={passo.etapa}>
            {passo.etapa}: {passo.logica}
          </li>
        ))}
      </ol>
      <ControlesFase {...props} />
    </section>
  );
}
