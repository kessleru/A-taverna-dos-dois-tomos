/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Publicado na raiz (Vercel).
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Bibliotecas num arquivo à parte: mudam pouco, então o navegador
        // reaproveita do cache quando só o jogo muda.
        manualChunks: {
          react: ['react', 'react-dom'],
          animacao: ['framer-motion'],
          som: ['howler', 'canvas-confetti'],
        },
      },
    },
  },
  test: {
    // Sem isto o Vitest entrega todo .css vazio, e tema.test.ts não enxergaria
    // tokens e fontes proibidos dentro das folhas de estilo.
    css: true,
  },
});
