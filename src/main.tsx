import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { instalarTrava } from './engine/trava';
import { instalarAjuda } from './engine/ajuda';
import './styles/global.css';

instalarTrava();
// Depois da trava: ? e H abrem os atalhos antes de qualquer tecla chegar às fases.
instalarAjuda();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
