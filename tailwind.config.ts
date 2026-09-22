import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noite: 'var(--noite)',
        'noite-profunda': 'var(--noite-profunda)',
        papel: 'var(--papel)',
        tinta: 'var(--tinta)',
        'artigo-a': 'var(--artigo-a)',
        'artigo-b': 'var(--artigo-b)',
        moeda: 'var(--moeda)',
        planejar: 'var(--planejar)',
        adaptar: 'var(--adaptar)',
        bricolagem: 'var(--bricolagem)',
        dano: 'var(--dano)',
        fosforo: 'var(--fosforo)',
      },
      fontFamily: {
        titulo: ['Bungee', 'cursive'],
        texto: ['Rubik', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        carta: 'var(--raio-carta)',
      },
      boxShadow: {
        carta: 'var(--sombra-carta)',
      },
    },
  },
  plugins: [],
} satisfies Config;
