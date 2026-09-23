/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A Vercel define VERCEL=1 no build e serve o site na raiz; o GitHub Pages
// serve em https://<usuario>.github.io/empreendedorismo/. (Acesso via
// globalThis porque o tsconfig não inclui os tipos do Node.)
const naVercel = Boolean((globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.VERCEL);

export default defineConfig({
  plugins: [react()],
  base: naVercel ? '/' : '/empreendedorismo/',
  test: {
    // Sem isto o Vitest entrega todo .css vazio, e tema.test.ts não enxergaria
    // tokens e fontes proibidos dentro das folhas de estilo.
    css: true,
  },
});
