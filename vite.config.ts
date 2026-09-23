import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serve o build em https://<usuario>.github.io/empreendedorismo/
  base: '/empreendedorismo/',
});
