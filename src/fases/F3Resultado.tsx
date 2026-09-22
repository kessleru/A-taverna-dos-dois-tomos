import { perfis, caminhoReal, calcularPerfil, etapas } from '../data/rodada';
import { pontuacao, type EstadoRodada } from '../engine/motor';
import { Titulo } from '../components/ui/Titulo';
import { ControlesFase } from '../components/ui/ControlesFase';
import type { FaseProps } from '../types';

interface F3ResultadoProps extends FaseProps {
  estadoRodada: EstadoRodada;
}

// Versão funcional da Iteração 2. O brasão animado e as trilhas com fio
// dourado entram na Iteração 5 (F3 com brasão e trilhas).
export function F3Resultado({ estadoRodada, ...props }: F3ResultadoProps) {
  const { escolhas, ind } = estadoRodada;
  const { total, estrelas } = pontuacao(ind);
  const perfilId = escolhas.length === etapas.length ? calcularPerfil(escolhas) : undefined;
  const perfil = perfilId ? perfis[perfilId] : undefined;

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <Titulo className="text-4xl">Resultado</Titulo>

      <div className="flex items-center gap-6 rounded-carta border border-moeda/40 p-6">
        <span className="text-6xl">{perfil?.emoji ?? '❔'}</span>
        <div>
          <p className="font-titulo text-2xl text-moeda">{perfil?.nome ?? 'Rodada incompleta'}</p>
          <p className="text-papel/80">{perfil?.texto ?? 'Complete as 4 decisões para ver o perfil da turma.'}</p>
          <p className="mt-2 font-mono text-sm text-papel/60">
            {total} pontos · {'⭐'.repeat(estrelas)}
          </p>
        </div>
      </div>

      <h2 className="font-titulo text-2xl text-moeda">Vocês vs. a startup real</h2>
      <ol className="space-y-2">
        {caminhoReal.map((passo, indice) => {
          const escolhaTurma = escolhas[indice];
          const igual = escolhaTurma === passo.escolha;
          return (
            <li
              key={passo.etapa}
              className={`flex items-center justify-between rounded-carta border p-3 ${
                igual ? 'border-moeda/60 bg-moeda/10' : 'border-papel/15'
              }`}
            >
              <span>{passo.etapa}</span>
              <span className="text-papel/70">{escolhaTurma ?? '—'}</span>
              <span>{igual ? '🔗' : ''}</span>
              <span style={{ color: 'var(--artigo-b)' }}>{passo.logica}</span>
            </li>
          );
        })}
      </ol>

      <ControlesFase {...props} />
    </section>
  );
}
