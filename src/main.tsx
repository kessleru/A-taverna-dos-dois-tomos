import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { instalarTrava } from './engine/trava';
import { instalarAjuda } from './engine/ajuda';
import './styles/global.css';

instalarTrava();
// O botão direito é do jogo (amplia a carta): o menu do navegador (salvar
// imagem, inspecionar...) não abre em lugar nenhum da página, nem arrastar
// uma imagem para fora (o outro jeito de "baixar" a arte).
window.addEventListener('contextmenu', (evento) => evento.preventDefault(), true);
window.addEventListener('dragstart', (evento) => {
  if (evento.target instanceof HTMLImageElement) evento.preventDefault();
}, true);
// Depois da trava: ? e H abrem os atalhos antes de qualquer tecla chegar às fases.
instalarAjuda();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
