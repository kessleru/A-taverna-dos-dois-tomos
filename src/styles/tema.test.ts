import { describe, expect, it } from 'vitest';

// Conteúdo bruto de todo o código-fonte (menos os próprios testes).
const fontes = import.meta.glob(['/src/**/*.{ts,tsx,css}', '!/src/**/*.test.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PROIBIDOS: RegExp[] = [
  /--(?:noite|papel|moeda|fosforo|artigo-[ab])\b/,
  /Bungee|Rubik|IBM Plex/,
  /\b(?:text|bg|border|from|to|via|ring|fill|stroke|shadow)-(?:noite|papel|moeda|fosforo|artigo-a|artigo-b)\b/,
  /\bfont-mono\b/,
  // Tema só medieval: nada da estética de terminal (fonte mono, ciano da runa).
  /jetbrains/i,
  /\bfont-sistema\b/,
  /--runa\b|runa-fundo/,
  /\b(?:text|bg|border|from|to|via|ring|fill|stroke|shadow)-runa\b/,
];

describe('tema da taverna', () => {
  it('lê o código-fonte', () => {
    expect(Object.keys(fontes).length).toBeGreaterThan(20);
  });

  it('nenhum arquivo usa tokens ou fontes antigos', () => {
    const violacoes = Object.entries(fontes).flatMap(([arquivo, texto]) =>
      PROIBIDOS.filter((regra) => regra.test(texto)).map((regra) => `${arquivo}: ${regra}`),
    );
    expect(violacoes).toEqual([]);
  });
});
