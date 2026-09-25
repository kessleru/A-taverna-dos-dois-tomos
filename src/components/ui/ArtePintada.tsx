// Peças pintadas à mão (public/assets/ui/) que substituem os ícones chapados
// onde eles aparecem grandes: a ampulheta da passagem do tempo, o Dado do
// Destino, o selo de cera, a vela do carregamento e o pergaminho do fim da
// rodada. Nos tamanhos pequenos (HUD, mapa) continuam os ícones SVG, que não
// viram borrão.
export const ARTES_PINTADAS = {
  ampulheta: 'ampulheta',
  dado: 'dado-d20',
  selo: 'selo-cera',
  vela: 'vela',
  pergaminho: 'pergaminho-pena',
} as const;

export type NomeArtePintada = keyof typeof ARTES_PINTADAS;

export function caminhoArtePintada(nome: NomeArtePintada): string {
  return `${import.meta.env.BASE_URL}assets/ui/${ARTES_PINTADAS[nome]}.webp`;
}

// Decorativa: o texto ao lado (ou o aria-label de quem a contém) é que diz o que é.
export function ArtePintada({ nome, className = '' }: { nome: NomeArtePintada; className?: string }) {
  return <img src={caminhoArtePintada(nome)} alt="" aria-hidden draggable={false} className={`block shrink-0 object-contain ${className}`} />;
}
