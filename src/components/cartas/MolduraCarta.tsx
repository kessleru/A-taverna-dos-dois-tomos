import type { CSSProperties, ReactNode } from 'react';
import type { ArteCarta } from '../../data/artes';
import { CenaArte } from './CenaArte';
import { ESCALA_CARTA } from './escala';
import { SLOTS_MOLDURA, urlMoldura, type Slot } from './moldura';

// Base fixa da carta; o tamanho "pequena" aplica zoom sobre ela, então o
// desenho interno é um só (01-tema-e-hud.md §8).
const LARGURA = 260;
const ALTURA = 364;
const ZOOM_TAMANHO = { grande: 1, pequena: 170 / 260 };

interface MolduraCartaProps {
  nome: string;
  arte: ArteCarta;
  corPrincipal: string;
  tamanho?: 'grande' | 'pequena';
  gemaTopo: ReactNode;
  gemaEsquerda?: ReactNode;
  gemaDireita?: ReactNode;
  subtitulo?: ReactNode;
  children: ReactNode;
}

function posicao(slot: Slot, sobra = 0): CSSProperties {
  return {
    position: 'absolute',
    left: `${slot.esquerda - sobra}%`,
    top: `${slot.topo - sobra}%`,
    width: `${slot.largura + sobra * 2}%`,
    height: `${slot.altura + sobra * 2}%`,
  };
}

function Gema({ slot, children }: { slot: Slot; children?: ReactNode }) {
  if (children === undefined || children === null) return null;
  return (
    <div
      className="flex items-center justify-center font-titulo text-[20px] font-bold leading-none text-pergaminho [text-shadow:0_2px_3px_rgb(0_0_0/0.9),0_0_2px_rgb(0_0_0/0.9)]"
      style={posicao(slot)}
    >
      {children}
    </div>
  );
}

export function MolduraCarta({
  nome,
  arte,
  corPrincipal,
  tamanho = 'grande',
  gemaTopo,
  gemaEsquerda,
  gemaDireita,
  subtitulo,
  children,
}: MolduraCartaProps) {
  return (
    <div
      className="relative select-none"
      style={{
        width: LARGURA,
        height: ALTURA,
        zoom: ESCALA_CARTA * ZOOM_TAMANHO[tamanho],
        // O brilho na cor da carta repete a lógica que ela representa.
        filter: `drop-shadow(0 10px 14px rgb(0 0 0 / 0.6)) drop-shadow(0 0 10px ${corPrincipal})`,
      }}
    >
      {/* A arte fica por baixo; a sobra de 1% some sob a borda da janela. */}
      <div className="overflow-hidden rounded-[4px]" style={posicao(SLOTS_MOLDURA.arte, 1)}>
        <CenaArte arte={arte} nome={nome} />
      </div>
      <img
        src={urlMoldura(arte.raridade)}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <Gema slot={SLOTS_MOLDURA.gemaTopo}>{gemaTopo}</Gema>
      <Gema slot={SLOTS_MOLDURA.gemaEsquerda}>{gemaEsquerda}</Gema>
      <Gema slot={SLOTS_MOLDURA.gemaDireita}>{gemaDireita}</Gema>

      <div
        className="flex items-center justify-center px-2 text-center font-titulo text-[13px] font-bold leading-none text-tinta [text-shadow:0_1px_0_rgb(255_240_210/0.6)]"
        style={posicao(SLOTS_MOLDURA.nome)}
      >
        {nome}
      </div>

      <div className="overflow-hidden px-1 text-center text-[10.5px] leading-snug text-tinta" style={posicao(SLOTS_MOLDURA.texto)}>
        {/* Calços flutuantes: o texto desvia das gemas que invadem os cantos de baixo. */}
        <div className="float-left h-[42px] w-0" />
        <div className="float-right h-[42px] w-0" />
        <div className="float-left clear-left h-[40px] w-[25px]" />
        <div className="float-right clear-right h-[40px] w-[24px]" />
        {subtitulo && <p className="font-texto text-[9px] italic leading-tight text-tinta/75">{subtitulo}</p>}
        {children}
      </div>
    </div>
  );
}
