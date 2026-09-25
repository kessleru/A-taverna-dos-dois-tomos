// Painel de atalhos (? ou H): estado fora do React, como a trava, para que o
// ouvinte de teclas seja instalado antes de o jogo montar e rode antes dos
// atalhos das fases. Com o painel aberto, → não avança a rodada por baixo.

type Ouvinte = (aberta: boolean) => void;

let aberta = false;
const ouvintes = new Set<Ouvinte>();

export const TECLAS_AJUDA = new Set(['?', 'h', 'H']);
// Com o painel aberto estas continuam valendo (som e tela cheia).
const TECLAS_LIVRES = new Set(['m', 'M', 'f', 'F']);

export function ajudaAberta(): boolean {
  return aberta;
}

export function definirAjuda(valor: boolean): void {
  if (valor === aberta) return;
  aberta = valor;
  for (const ouvinte of ouvintes) ouvinte(valor);
}

export function assinarAjuda(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

// O que fazer com uma tecla: abrir/fechar o painel, engolir a tecla (painel
// aberto) ou deixar passar para o jogo.
export function avaliarTeclaAjuda(tecla: string, comModificador: boolean, estaAberta: boolean): 'alternar' | 'fechar' | 'passar' {
  if (!comModificador && TECLAS_AJUDA.has(tecla)) return 'alternar';
  if (!estaAberta || TECLAS_LIVRES.has(tecla)) return 'passar';
  return 'fechar';
}

export function instalarAjuda(): void {
  window.addEventListener(
    'keydown',
    (evento) => {
      // Tecla já barrada pela tela de carregamento ou pela trava.
      if (evento.defaultPrevented) return;
      const decisao = avaliarTeclaAjuda(evento.key, evento.ctrlKey || evento.metaKey || evento.altKey, aberta);
      if (decisao === 'passar') return;
      evento.preventDefault();
      evento.stopImmediatePropagation();
      definirAjuda(decisao === 'alternar' ? !aberta : false);
    },
    true,
  );
}
