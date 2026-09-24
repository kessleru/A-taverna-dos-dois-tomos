// Trava de cliques: depois de uma ação, cliques e teclas de ação ficam
// ignorados até o efeito que ela disparou terminar, sem marcador visual.
// Evita pular animações clicando sem parar e o clique duplo sem querer.

// Cobre o giro da carta e a troca de folha (saída de 0,2 s + entrada).
export const TRAVA_PADRAO_MS = 700;

// Teclas que avançam, voltam, escolhem ou fecham algo no jogo.
export const TECLAS_DE_ACAO = new Set(['ArrowRight', 'ArrowLeft', ' ', 'Enter', 'PageDown', 'PageUp', 'Escape', '1', '2', '3']);

let liberadoEm = 0;

// Estende a trava até `ms` a partir de agora (nunca a encurta).
export function travar(ms: number, agora = performance.now()) {
  liberadoEm = Math.max(liberadoEm, agora + ms);
}

export function travado(agora = performance.now()) {
  return agora < liberadoEm;
}

export function destravar() {
  liberadoEm = 0;
}

// Decide o que fazer com um evento: deixar passar travando dali em diante,
// só deixar passar ou bloquear. Um evento bloqueado não estende a trava, senão
// quem clica sem parar nunca mais seria atendido.
export function avaliarEvento(evento: { tipo: 'click' | 'keydown'; tecla?: string; repeticao?: boolean; doTeclado?: boolean }, agora = performance.now()): 'aceitar' | 'ignorar' | 'bloquear' {
  if (evento.tipo === 'keydown') {
    if (!evento.tecla || !TECLAS_DE_ACAO.has(evento.tecla)) return 'ignorar';
    if (evento.repeticao || travado(agora)) return 'bloquear';
    return 'aceitar';
  }
  // Enter/Espaço num botão geram um clique sintético logo após a tecla, que
  // já passou pela trava.
  if (evento.doTeclado) return 'ignorar';
  return travado(agora) ? 'bloquear' : 'aceitar';
}

// Ouvintes na captura da window, instalados antes do React montar: assim
// rodam antes de todos os outros ouvintes de tecla e dos cliques do React.
// Elementos com data-sem-trava (o botão de som) não travam nem são travados.
export function instalarTrava() {
  function aoEvento(evento: Event) {
    const alvo = evento.target;
    if (alvo instanceof Element && alvo.closest('[data-sem-trava]')) return;
    const decisao =
      evento instanceof KeyboardEvent
        ? avaliarEvento({ tipo: 'keydown', tecla: evento.key, repeticao: evento.repeat })
        : avaliarEvento({ tipo: 'click', doTeclado: (evento as MouseEvent).detail === 0 });
    if (decisao === 'bloquear') {
      evento.preventDefault();
      evento.stopImmediatePropagation();
    } else if (decisao === 'aceitar') {
      travar(TRAVA_PADRAO_MS);
    }
  }
  window.addEventListener('click', aoEvento, true);
  window.addEventListener('keydown', aoEvento, true);
}
