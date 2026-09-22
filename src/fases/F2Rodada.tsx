import { etapas, eventos, combinarDesbloqueado } from '../data/rodada';
import type { useRodada } from '../engine/useRodada';
import { BarraIndicador } from '../components/hud/BarraIndicador';
import { TrilhaEtapas } from '../components/hud/TrilhaEtapas';
import { CenaSituacao } from '../components/rodada/CenaSituacao';
import { Votacao } from '../components/rodada/Votacao';
import { Consequencia } from '../components/rodada/Consequencia';
import { Dado3D } from '../components/rodada/Dado3D';
import { BalaoArtigo } from '../components/rodada/BalaoArtigo';
import { SeloRealidade } from '../components/rodada/SeloRealidade';
import { Desbloqueio } from '../components/rodada/Desbloqueio';
import { CartaEvento } from '../components/cartas/CartaEvento';
import { Botao } from '../components/ui/Botao';
import type { FaseProps } from '../types';

interface F2RodadaProps extends FaseProps {
  rodada: ReturnType<typeof useRodada>;
}

export function F2Rodada({ avancar: avancarFase, rodada }: F2RodadaProps) {
  const { estado, avancar, escolher, rolarDado } = rodada;

  if (estado.terminou) {
    return (
      <section className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h2 className="font-titulo text-3xl text-moeda">Rodada concluída!</h2>
        <Botao onClick={avancarFase}>Ver o resultado →</Botao>
      </section>
    );
  }

  const etapa = etapas[estado.etapa];
  const escolhaAtual = estado.escolhas[estado.etapa];
  const opcaoAtual = escolhaAtual ? (escolhaAtual === 'combinar' ? etapa.combinar! : etapa[escolhaAtual]) : undefined;

  return (
    <section className="mx-auto flex h-full max-w-3xl flex-col gap-6 overflow-y-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <TrilhaEtapas etapaAtual={estado.etapa} escolhas={estado.escolhas} />
        <div className="flex gap-3">
          <BarraIndicador icone="💰" rotulo="Caixa" valor={estado.ind.caixa} cor="var(--moeda)" />
          <BarraIndicador icone="👥" rotulo="Clientes" valor={estado.ind.clientes} cor="var(--adaptar)" />
          <BarraIndicador icone="🔥" rotulo="Moral" valor={estado.ind.moral} cor="var(--dano)" />
        </div>
      </div>

      {estado.passo === 'situacao' && <CenaSituacao etapa={etapa} avancar={avancar} />}

      {estado.passo === 'votacao' && (
        <Votacao etapa={etapa} combinarLiberado={combinarDesbloqueado(estado.escolhas)} onEscolher={escolher} />
      )}

      {estado.passo === 'consequencia' && opcaoAtual && (
        <Consequencia resultado={opcaoAtual.resultado} ind={estado.ind} avancar={avancar} />
      )}

      {estado.passo === 'dado' && <Dado3D ultimoDado={estado.ultimoDado} onRolar={rolarDado} avancar={avancar} />}

      {estado.passo === 'artigos' && (
        <div className="flex flex-col gap-4">
          <h2 className="font-titulo text-2xl text-moeda">O que dizem os artigos</h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <BalaoArtigo letra="A" texto={etapa.artigoA} />
            <BalaoArtigo letra="B" texto={etapa.artigoB} />
          </div>
          {escolhaAtual && <SeloRealidade igualAoReal={escolhaAtual === etapa.ideal} escolhaReal={etapa.ideal} />}
          <div>
            <Botao onClick={avancar}>Avançar →</Botao>
          </div>
        </div>
      )}

      {estado.passo === 'evento' &&
        (() => {
          const evento = eventos.find((e) => e.depoisDaEtapa === estado.etapa)!;
          const sucesso = evento.condicao(estado.escolhas, estado.ind);
          const desfecho = sucesso ? evento.seSim : evento.seNao;
          return (
            <div className="flex flex-col items-center gap-4">
              <CartaEvento depoisDaEtapa={evento.depoisDaEtapa} nome={evento.nome} desfecho={desfecho} sucesso={sucesso} />
              <p className="max-w-md text-center text-sm text-papel/60">{evento.conceito}</p>
              <Botao onClick={avancar}>Avançar →</Botao>
            </div>
          );
        })()}

      {estado.passo === 'desbloqueio' && (
        <Desbloqueio desbloqueado={combinarDesbloqueado(estado.escolhas)} avancar={avancar} />
      )}
    </section>
  );
}
