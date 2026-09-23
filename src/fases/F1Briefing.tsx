import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { briefing } from '../data/rodada';
import { conteudo } from '../data/conteudo';
import { navegarFolha, type Direcao } from '../engine/folhas';
import { Botao } from '../components/ui/Botao';
import { QuadroMadeira } from '../components/ui/QuadroMadeira';
import { Pergaminho } from '../components/ui/Pergaminho';
import { SeloCera } from '../components/ui/SeloCera';
import { CartaArtigo } from '../components/cartas/CartaArtigo';
import { CartaDecisao } from '../components/cartas/CartaDecisao';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

// O briefing é o quadro de missões da taverna, em quatro folhas
// (docs/redesign/10-briefing-quadro.md).
const TOTAL_FOLHAS = 4;
const CHAVE_FOLHA = 'sa-f1-folha';
const TECLAS_AVANCAR = ['ArrowRight', ' ', 'PageDown'];
const TECLAS_VOLTAR = ['ArrowLeft', 'PageUp'];

function lerFolha(): number {
  const salva = Number(sessionStorage.getItem(CHAVE_FOLHA));
  return Number.isInteger(salva) && salva >= 0 && salva < TOTAL_FOLHAS ? salva : 0;
}

interface F1BriefingProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F1Briefing({ som, avancar, voltar }: F1BriefingProps) {
  const [folha, setFolha] = useState(lerFolha);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_FOLHA, String(folha));
  }, [folha]);

  const ir = useCallback(
    (direcao: Direcao) => {
      const destino = navegarFolha(folha, TOTAL_FOLHAS, direcao);
      if (destino.tipo === 'sair') {
        if (direcao === 1) avancar();
        else voltar();
        return;
      }
      som.tocar('pagina');
      setFolha(destino.folha);
    },
    [folha, avancar, voltar, som],
  );

  // Captura as setas antes do useNavegacao: aqui elas trocam de folha e só
  // nas pontas mudam de fase.
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      const direcao = TECLAS_AVANCAR.includes(evento.key) ? 1 : TECLAS_VOLTAR.includes(evento.key) ? -1 : 0;
      if (direcao === 0) return;
      evento.preventDefault();
      evento.stopPropagation();
      ir(direcao);
    }
    window.addEventListener('keydown', aoTeclar, true);
    return () => window.removeEventListener('keydown', aoTeclar, true);
  }, [ir]);

  return (
    <section className="flex h-full flex-col gap-5 px-24 pb-5 pt-8">
      <QuadroMadeira className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={folha} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
            {folha === 0 && <FolhaMissao />}
            {folha === 1 && <FolhaTomosProvisoria som={som} />}
            {folha === 2 && <FolhaDecisoesProvisoria />}
            {folha === 3 && <FolhaRegrasProvisoria />}
          </motion.div>
        </AnimatePresence>
      </QuadroMadeira>

      <nav className="flex items-center justify-between" aria-label="Folhas do briefing">
        <Botao variante="fantasma" onClick={() => ir(-1)}>
          Voltar
        </Botao>
        <ol className="flex gap-4" aria-label={`Folha ${folha + 1} de ${TOTAL_FOLHAS}`}>
          {Array.from({ length: TOTAL_FOLHAS }, (_, i) => (
            <li
              key={i}
              className={`h-5 w-5 rounded-full border-2 ${i === folha ? 'border-cera bg-cera' : 'border-pergaminho/40'}`}
            />
          ))}
        </ol>
        <Botao onClick={() => ir(1)}>Continuar</Botao>
      </nav>
    </section>
  );
}

function FolhaMissao() {
  const { missao } = briefing;
  // Notas da direita em alturas e ângulos diferentes, como papéis pregados à mão.
  const posicoes = [
    { left: 1170, top: 56, angulo: 2 },
    { left: 1215, top: 300, angulo: -1.5 },
    { left: 1160, top: 540, angulo: 1 },
  ];

  return (
    <>
      <Pergaminho variante="aviso" angulo={-1} className="absolute" style={{ left: 80, top: 60, width: 1000 }}>
        <h2 className="font-titulo text-[64px] font-bold leading-[1.1]">{missao.titulo}</h2>
        <div className="ornamento my-6" aria-hidden>
          ❦
        </div>
        <p className="capitular font-texto text-[36px] leading-[1.45]">{missao.texto}</p>
        <SeloCera className="absolute right-12 top-14 h-32 w-32 rotate-12" />
      </Pergaminho>

      {missao.notas.map((nota, i) => (
        <Pergaminho
          key={nota.titulo}
          angulo={posicoes[i].angulo}
          atraso={0.15 + i * 0.12}
          className="absolute"
          style={{ left: posicoes[i].left, top: posicoes[i].top, width: 420 }}
        >
          <h3 className="font-titulo text-[36px] font-bold leading-tight">{nota.titulo}</h3>
          <p className="mt-2 font-texto text-[32px] leading-snug">{nota.texto}</p>
        </Pergaminho>
      ))}
    </>
  );
}

// ── Folhas 2 a 4: conteúdo antigo dentro do quadro até cada uma ser refeita
// (blocos seguintes do 10-briefing-quadro.md). ────────────────────────────

function FolhaTomosProvisoria({ som }: { som: ReturnType<typeof useSom> }) {
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
    <div className="flex h-full flex-col items-center justify-center gap-6 p-10">
      <div className="flex gap-10">
        {conteudo.artigos.map((artigo) => (
          <CartaArtigo key={artigo.id} artigo={artigo} virada={!!viradas[artigo.id]} onClick={() => clicarConselheiro(artigo.id)} />
        ))}
      </div>
      {artigoExpandido && (
        <Pergaminho className="w-[1100px]">
          <p className="font-texto text-[28px]">
            <strong>Estratégia:</strong> {artigoExpandido.estrategia}
          </p>
        </Pergaminho>
      )}
    </div>
  );
}

function FolhaDecisoesProvisoria() {
  return (
    <div className="flex h-full items-center justify-center gap-6">
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
  );
}

function FolhaRegrasProvisoria() {
  return (
    <div className="flex h-full items-center p-16">
      <Pergaminho variante="aviso" className="w-[1150px]">
        <h2 className="font-titulo text-[56px] font-bold">{briefing.regras.titulo}</h2>
        <ol className="mt-6 list-decimal space-y-3 pl-10 font-texto text-[32px]">
          {briefing.regras.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </Pergaminho>
    </div>
  );
}
