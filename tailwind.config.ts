import type { Config } from 'tailwindcss';

// color-mix deixa o Tailwind aplicar opacidade (text-pergaminho/70) sobre um
// token CSS em hex; com 'var(--x)' puro as classes com /NN não eram geradas.
// Precisa ser função: o Tailwind 3 não sabe ler <alpha-value> dentro de color-mix.
const cor =
  (token: string) =>
  ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `var(--${token})`
      : `color-mix(in srgb, var(--${token}) calc(${opacityValue} * 100%), transparent)`;

const tokens = [
  'madeira-profunda',
  'madeira',
  'madeira-clara',
  'madeira-veio',
  'madeira-moldura',
  'ferro',
  'pergaminho',
  'tinta',
  'ouro',
  'ouro-claro',
  'ouro-escuro',
  'brasa',
  'planejar',
  'adaptar',
  'bricolagem',
  'tomo-a',
  'tomo-b',
  'clientes',
  'cera',
  'dano',
  'cura',
];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(tokens.map((token) => [token, cor(token)])),
      fontFamily: {
        titulo: ['Cinzel', 'serif'],
        texto: ['Alegreya', 'serif'],
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
