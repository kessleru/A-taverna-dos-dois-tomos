import type { ReactNode } from 'react';
import { conteudo } from '../data/conteudo';
import { briefing, etapas, eventos, dadoDaIncerteza } from '../data/rodada';
import { artesEtapas } from '../data/artes';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { CartaDecisao } from '../components/cartas/CartaDecisao';
import { CartaEvento } from '../components/cartas/CartaEvento';
import { CartaLendaria } from '../components/cartas/CartaLendaria';
import { VersoCarta } from '../components/cartas/VersoCarta';
import { CenaArte } from '../components/cartas/CenaArte';
import { Orbes } from '../components/hud/Orbes';
import { MapaJornada } from '../components/hud/MapaJornada';

// Rota de revisão visual. Não faz parte da apresentação: mostra todas as
// cartas (nas molduras de bronze, prata e ouro), estados e peças do HUD.
function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-titulo text-2xl text-ouro">{titulo}</h2>
      <div className="flex flex-wrap gap-6">{children}</div>
    </section>
  );
}

export function Vitrine() {
  return (
    <div className="fixed inset-0 space-y-10 overflow-y-auto bg-madeira px-8 py-10 text-pergaminho">
      <h1 className="font-titulo text-4xl">Vitrine de cartas — #vitrine</h1>

      <Secao titulo="Conselheiros (CartaArtigo)">
        {conteudo.artigos.map((artigo) => (
          <CartaArtigo key={artigo.id} artigo={artigo} />
        ))}
      </Secao>

      <Secao titulo="Decisões (CartaDecisao)">
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
      </Secao>

      <Secao titulo="Decisões em tamanho grande">
        {briefing.jeitosDeDecidir.cartas.slice(0, 2).map((carta) => (
          <CartaDecisao
            key={carta.id}
            id={carta.id as 'planejar' | 'adaptar'}
            nome={carta.nome}
            teoria={carta.teoria}
            resumo={carta.resumo}
            tamanho="grande"
          />
        ))}
        <CartaDecisao id="combinar" nome="Combinar" teoria="As duas juntas" resumo="Destravada: a carta lendária da forja." tamanho="grande" />
      </Secao>

      <Secao titulo="HUD — orbes (normal, cheio e quase quebrando)">
        <Orbes ind={{ caixa: 50, clientes: 95, moral: 12 }} />
      </Secao>

      <Secao titulo="HUD — mapa da jornada (início, meio e completo)">
        <div className="flex flex-col gap-8">
          <MapaJornada etapaAtual={0} escolhas={[]} />
          <MapaJornada etapaAtual={2} escolhas={['adaptar', 'planejar']} />
          <MapaJornada etapaAtual={4} escolhas={['adaptar', 'adaptar', 'planejar', 'combinar']} />
        </div>
      </Secao>

      <Secao titulo="Eventos (CartaEvento)">
        {eventos.map((evento) => (
          <div key={evento.nome} className="flex flex-col gap-2">
            <CartaEvento depoisDaEtapa={evento.depoisDaEtapa} nome={evento.nome} desfecho={evento.seSim} sucesso />
            <CartaEvento depoisDaEtapa={evento.depoisDaEtapa} nome={evento.nome} desfecho={evento.seNao} sucesso={false} />
          </div>
        ))}
      </Secao>

      <Secao titulo="Lendária (CartaLendaria)">
        <CartaLendaria />
      </Secao>

      <Secao titulo="Verso (VersoCarta)">
        <VersoCarta corPrincipal="var(--planejar)" />
        <VersoCarta corPrincipal="var(--tomo-b)" />
      </Secao>

      <Secao titulo="Cenas das etapas (CenaArte)">
        {etapas.map((etapa) => (
          <div key={etapa.id} className="h-40 w-56 overflow-hidden rounded-carta border border-pergaminho/20">
            <CenaArte arte={artesEtapas[etapa.id]} nome={etapa.titulo} />
          </div>
        ))}
      </Secao>

      <Secao titulo="Dado da Incerteza — faces">
        {Object.entries(dadoDaIncerteza.faces).map(([face, info]) => (
          <div key={face} className="w-32 rounded-carta border border-pergaminho/20 p-3 text-center text-sm">
            <div className="font-titulo text-xl">{face}</div>
            <div>{info.titulo}</div>
          </div>
        ))}
      </Secao>
    </div>
  );
}
