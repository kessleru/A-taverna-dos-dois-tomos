import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { instalarTrava } from './engine/trava';
import './styles/global.css';

instalarTrava();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
