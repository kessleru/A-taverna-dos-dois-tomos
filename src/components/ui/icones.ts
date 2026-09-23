// SVGs do game-icons.net (src/assets/icones/, créditos em public/assets/CREDITOS.md),
// embutidos no bundle como texto, indexados pelo nome do arquivo.
const arquivos = import.meta.glob('../../assets/icones/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const ICONES: Record<string, string> = Object.fromEntries(
  Object.entries(arquivos).map(([caminho, svg]) => [caminho.replace(/^.*\/(.+)\.svg$/, '$1'), svg.trim()]),
);
