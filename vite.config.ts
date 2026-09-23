/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serve o build em https://<usuario>.github.io/empreendedorismo/
  base: '/empreendedorismo/',
  test: {
    // Sem isto o Vitest entrega todo .css vazio, e tema.test.ts não enxergaria
    // tokens e fontes proibidos dentro das folhas de estilo.
    css: true,
  },
});
