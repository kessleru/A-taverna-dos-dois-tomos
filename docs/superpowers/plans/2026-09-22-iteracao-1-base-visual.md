# Iteração 1 — Base visual: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar a base visual do jogo pela da taverna: palco fixo de 1920×1080, paleta e fontes novas, cenário da taverna, o Grimório (painel de terminal com notificações) e a transição de página entre fases.

**Architecture:** Um `Palco` escala um div de 1920×1080 para caber na janela (letterbox) e envolve todo o app. A paleta vira tokens CSS lidos pelo Tailwind via `color-mix`, o que faz os modificadores de opacidade (`/60`) funcionarem. A lógica pura (enquadramento, brasas, digitação, fila de notificações, tempos da transição) fica em módulos testados com Vitest; os componentes só a usam.

**Tech Stack:** React 18, Vite 5, TypeScript, Tailwind 3.4, Framer Motion 11, Howler, Vitest 2, `@fontsource/*`.

**Spec:** `docs/redesign/00-visao-geral.md` (§5, iteração 1), `01-tema-e-hud.md` (§3 paleta, §4 cenário, §5 Grimório, §9 transição), `04-visibilidade.md` (§2.1 palco), `07-tipografia.md`, `06-animacoes.md` (§2 `movimento.ts`).

## Global Constraints

- Palco de exatamente 1920×1080 px, escalado com `Math.min(innerWidth / 1920, innerHeight / 1080)`, tarjas pretas nas sobras, sem rolagem.
- Paleta exata de `01-tema-e-hud.md` §3 (valores hex copiados na Task 1).
- Fontes: Cinzel 600/700 (`font-titulo`), Alegreya 500/700 e itálico 500 (`font-texto`), JetBrains Mono 500/700 (`font-sistema`). Nenhum uso de Bungee, Rubik ou IBM Plex Mono.
- Grimório: vidro `--runa-fundo` com `backdrop-filter: blur(8px)`, borda 2 px `--runa` com brilho, cantos em colchete, aba `[ GRIMÓRIO ]`, varredura a 6%, JetBrains Mono 28–32 px maiúsculo, ~40 caracteres/s, cursor `█` piscando, linhas com `›`. Notificação entra pela direita com "ping" e fica 3 s.
- Transição: página de tomo virando, 900 ms, som de página; com movimento reduzido, fade de 300 ms.
- Cenário: pintura desfocada e escurecida no centro, duas luzes de vela oscilando, tampo na faixa inferior, 20–30 brasas, vinheta, deriva de ±6 px em 20 s (sem parallax de mouse).
- Sem dependências novas além das três fontes. Caminhos de `public/` sempre com `import.meta.env.BASE_URL`.
- Cada task termina com `npm run build` e `npm test` passando e um commit.

## Fora do escopo desta iteração

HUD novo (orbes, mapa, tapeçaria), cartas novas, foco por passo, ampliação, tutorial e o relayout das fases F1–F5 (iterações 2–4). As telas antigas passam a rodar dentro do palco com a paleta e as fontes novas; tamanhos e layouts delas ainda são os antigos.

## Review Focus

1. Janela minimizada ou com tamanho 0 (alguns navegadores disparam `resize` com 0×0): o palco não pode gerar escala negativa nem `NaN`. Teste na Task 2.
2. Janela ultralarga (21:9) ou 4:3: o palco fica centralizado com tarjas só nos lados certos. Teste na Task 2.
3. Linhas do Grimório que crescem depois de digitadas (log que recebe linha nova): a digitação continua de onde parou, sem redigitar. Teste na Task 4.
4. Várias notificações em sequência rápida: no máximo 3 na tela, as mais novas ficam. Teste na Task 4.
5. Movimento reduzido (`prefers-reduced-motion`): transição vira fade de 300 ms e o Grimório aparece inteiro de uma vez. Teste na Task 6 (tempos) e Task 4 (digitação instantânea via `caracteres` = total).

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/styles/tokens.css` (reescrito) | Paleta da taverna |
| `tailwind.config.ts` (modificado) | Cores via `color-mix` e famílias `titulo`/`texto`/`sistema` |
| `src/styles/global.css` (modificado) | Fontes, corpo, título em ouro, imports dos CSS novos |
| `src/styles/tema.test.ts` (novo) | Garante que nenhum arquivo usa tokens/fontes antigos |
| `src/engine/palco.ts` + `.test.ts` (novos) | `enquadrarPalco` |
| `src/components/ui/Palco.tsx` (novo) | Div escalado + contexto `useEscalaPalco` |
| `src/engine/brasas.ts` + `.test.ts` (novos) | `gerarBrasas` determinístico |
| `src/components/ui/Taverna.tsx` + `src/styles/taverna.css` (novos) | Cenário; substitui `Fundo.tsx` (removido) |
| `src/engine/digitacao.ts` + `.test.ts` (novos) | `digitar` |
| `src/engine/notificacoes.ts` + `.test.ts` (novos) | Fila de notificações |
| `src/components/ui/Grimorio.tsx` + `src/styles/grimorio.css` (novos) | Painel do Grimório |
| `src/components/ui/NotificacoesGrimorio.tsx` (novo) | `GrimorioProvider` e `useGrimorio` |
| `src/styles/movimento.ts` + `.test.ts` (novos) | Molas e tempos da transição |
| `src/components/ui/TransicaoPagina.tsx` + CSS em `taverna.css` (novos) | Página virando entre fases |
| `src/App.tsx`, `src/fases/F0Abertura.tsx`, `src/components/ui/{Botao,Titulo}.tsx`, `src/components/hud/Hud.tsx`, `index.html` | Integração |

---

### Task 1: Paleta e fontes

**Files:**
- Modify: `package.json` (via npm), `src/styles/tokens.css`, `tailwind.config.ts`, `src/styles/global.css`, `src/components/ui/Titulo.tsx`, `index.html`
- Modify (renomeação mecânica): todos os `src/**/*.{ts,tsx,css}` que usam classes/tokens antigos
- Test: `src/styles/tema.test.ts`

**Interfaces:**
- Produces: tokens CSS `--madeira-profunda --madeira --madeira-clara --pergaminho --tinta --ouro --ouro-claro --ouro-escuro --brasa --planejar --adaptar --bricolagem --tomo-a --tomo-b --clientes --dano --cura --runa --runa-fundo`; classes Tailwind com os mesmos nomes (ex.: `text-pergaminho/70`, `bg-ouro`); famílias `font-titulo`, `font-texto`, `font-sistema`; classe CSS `titulo-ouro`.

- [ ] **Step 1: Teste que falha**

`src/styles/tema.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/styles/tema.test.ts`
Expected: FAIL, lista de violações (`--noite`, `Bungee`, `text-papel` etc.).

- [ ] **Step 3: Trocar pacotes de fonte**

```bash
npm i @fontsource/cinzel @fontsource/alegreya @fontsource/jetbrains-mono
npm rm @fontsource/bungee @fontsource/rubik @fontsource/ibm-plex-mono
```

- [ ] **Step 4: Tokens**

`src/styles/tokens.css` inteiro:

```css
/* Paleta da taverna (docs/redesign/01-tema-e-hud.md §3). */
:root {
  --madeira-profunda: #140d08;
  --madeira: #24170f;
  --madeira-clara: #4a3222;
  --pergaminho: #f3e6c8;
  --tinta: #2a1d14;
  --ouro: #e8b64a;
  --ouro-claro: #ffe39a;
  --ouro-escuro: #9c6b1e;
  --brasa: #ff7a2f;
  --planejar: #4f7bff;
  --adaptar: #3fbf7f;
  --bricolagem: #c7773a;
  --tomo-a: #f2862e;
  --tomo-b: #2fc7b8;
  --clientes: #9b7bff;
  --dano: #e0374a;
  --cura: #5ed17a;
  --runa: #7fe8ff;
  --runa-fundo: rgb(8 20 32 / 0.82);

  --raio-carta: 20px;
  --sombra-carta: 0 24px 48px -12px rgb(0 0 0 / 0.55);
}
```

- [ ] **Step 5: Tailwind**

`tailwind.config.ts` inteiro:

```ts
import type { Config } from 'tailwindcss';

// color-mix deixa o Tailwind aplicar opacidade (text-pergaminho/70) sobre um
// token CSS em hex; com 'var(--x)' puro as classes com /NN não eram geradas.
const cor = (token: string) => `color-mix(in srgb, var(--${token}) calc(<alpha-value> * 100%), transparent)`;

const tokens = [
  'madeira-profunda',
  'madeira',
  'madeira-clara',
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
  'dano',
  'cura',
  'runa',
];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(tokens.map((token) => [token, cor(token)])),
      fontFamily: {
        titulo: ['Cinzel', 'serif'],
        texto: ['Alegreya', 'serif'],
        sistema: ['"JetBrains Mono"', 'monospace'],
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
```

- [ ] **Step 6: CSS global**

Em `src/styles/global.css`, trocar os quatro `@import '@fontsource/...'` por:

```css
@import '@fontsource/cinzel/600.css';
@import '@fontsource/cinzel/700.css';
@import '@fontsource/alegreya/500.css';
@import '@fontsource/alegreya/700.css';
@import '@fontsource/alegreya/500-italic.css';
@import '@fontsource/jetbrains-mono/500.css';
@import '@fontsource/jetbrains-mono/700.css';
```

Trocar a regra `body` por:

```css
body {
  background: #000;
  color: var(--pergaminho);
  font-family: 'Alegreya', serif;
  font-weight: 500;
  overflow: hidden;
}

/* Títulos em ouro (07-tipografia.md §3): gradiente + contorno para aguentar qualquer fundo. */
.titulo-ouro {
  background: linear-gradient(180deg, var(--ouro-claro) 0%, var(--ouro) 55%, var(--ouro-escuro) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-stroke: 1px rgb(20 13 8 / 0.5);
  filter: drop-shadow(0 4px 0 rgb(0 0 0 / 0.45)) drop-shadow(0 0 24px rgb(232 182 74 / 0.35));
}
```

- [ ] **Step 7: Renomeação mecânica das classes e tokens**

Mapa: `noite-profunda→madeira-profunda`, `noite→madeira`, `papel→pergaminho`, `moeda→ouro`, `artigo-a→tomo-a`, `artigo-b→tomo-b`, `fosforo→runa`, `font-mono→font-sistema`. Só em contexto de classe Tailwind ou `var(--…)` (a palavra "papel" aparece em textos do jogo e não pode mudar):

```bash
node -e '
const fs=require("fs"),path=require("path");
const mapa=[["noite-profunda","madeira-profunda"],["noite","madeira"],["papel","pergaminho"],["moeda","ouro"],["artigo-a","tomo-a"],["artigo-b","tomo-b"],["fosforo","runa"]];
const pref="text|bg|border|from|to|via|ring|fill|stroke|shadow|outline|decoration|divide|placeholder|accent|caret";
const nomes=mapa.map(m=>m[0]).join("|");
const reClasse=new RegExp("\\b("+pref+")-("+nomes+")\\b","g");
const reVar=new RegExp("var\\(--("+nomes+")\\)","g");
const novo=Object.fromEntries(mapa);
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
for(const f of walk("src").filter(f=>/\.(tsx?|css)$/.test(f)&&!f.endsWith(".test.ts")&&!f.endsWith("tokens.css"))){
  const a=fs.readFileSync(f,"utf8");
  const b=a.replace(reClasse,(_,p,n)=>p+"-"+novo[n]).replace(reVar,(_,n)=>"var(--"+novo[n]+")").replace(/\bfont-mono\b/g,"font-sistema");
  if(a!==b){fs.writeFileSync(f,b);console.log("alterado",f)}
}'
```

- [ ] **Step 8: Título e página**

`src/components/ui/Titulo.tsx` (o `vw` do `clamp` antigo não funciona dentro do palco escalado):

```tsx
import type { ReactNode } from 'react';

export function Titulo({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`titulo-ouro font-titulo text-[104px] font-bold leading-[1.05] tracking-[0.04em] ${className}`}>
      {children}
    </h1>
  );
}
```

`index.html`: `<title>A Taverna dos Dois Tomos</title>`.

- [ ] **Step 9: Rodar tudo**

Run: `npm test && npm run build && grep -c "text-pergaminho\\\\/70" dist/assets/*.css`
Expected: testes PASS (incluindo `tema.test.ts`), build OK, contagem ≥ 1 (prova de que o modificador de opacidade agora gera CSS).

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: paleta e fontes da taverna"
```

---

### Task 2: Palco de 1920×1080

**Files:**
- Create: `src/engine/palco.ts`, `src/engine/palco.test.ts`, `src/components/ui/Palco.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `LARGURA_PALCO = 1920`, `ALTURA_PALCO = 1080`, `enquadrarPalco(largura: number, altura: number): { escala: number; x: number; y: number }`, componente `<Palco>{children}</Palco>`, hook `useEscalaPalco(): number`.

- [ ] **Step 1: Teste que falha**

`src/engine/palco.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { enquadrarPalco } from './palco';

describe('enquadrarPalco', () => {
  it('1920×1080 fica em escala 1, sem tarjas', () => {
    expect(enquadrarPalco(1920, 1080)).toEqual({ escala: 1, x: 0, y: 0 });
  });

  it('1366×768 limita pela altura e centraliza na horizontal', () => {
    const { escala, x, y } = enquadrarPalco(1366, 768);
    expect(escala).toBeCloseTo(768 / 1080, 6);
    expect(x).toBeCloseTo((1366 - 1920 * escala) / 2, 6);
    expect(y).toBe(0);
  });

  it('ultralarga 2560×1080 tem tarjas só nos lados', () => {
    expect(enquadrarPalco(2560, 1080)).toEqual({ escala: 1, x: 320, y: 0 });
  });

  it('4:3 (1024×768) tem tarjas em cima e embaixo', () => {
    const { escala, x, y } = enquadrarPalco(1024, 768);
    expect(escala).toBeCloseTo(1024 / 1920, 6);
    expect(x).toBe(0);
    expect(y).toBeCloseTo((768 - 1080 * escala) / 2, 6);
  });

  it('janela minimizada (0×0 ou negativa) não gera escala negativa nem NaN', () => {
    expect(enquadrarPalco(0, 0)).toEqual({ escala: 0, x: 0, y: 0 });
    expect(enquadrarPalco(-10, 500)).toEqual({ escala: 0, x: 0, y: 0 });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/engine/palco.test.ts`
Expected: FAIL, "Failed to resolve import './palco'".

- [ ] **Step 3: Implementar**

`src/engine/palco.ts`:

```ts
// Todo o jogo é desenhado num palco fixo de 1920×1080 e escalado para caber
// na janela (docs/redesign/04-visibilidade.md §2.1): o que se vê no notebook é
// exatamente o que se vê no projetor.
export const LARGURA_PALCO = 1920;
export const ALTURA_PALCO = 1080;

export interface Enquadramento {
  escala: number;
  x: number;
  y: number;
}

export function enquadrarPalco(largura: number, altura: number): Enquadramento {
  if (!(largura > 0) || !(altura > 0)) return { escala: 0, x: 0, y: 0 };
  const escala = Math.min(largura / LARGURA_PALCO, altura / ALTURA_PALCO);
  return {
    escala,
    x: (largura - LARGURA_PALCO * escala) / 2,
    y: (altura - ALTURA_PALCO * escala) / 2,
  };
}
```

`src/components/ui/Palco.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ALTURA_PALCO, LARGURA_PALCO, enquadrarPalco } from '../../engine/palco';

// Escala atual, para quem precisar converter coordenadas da tela para o
// palco (tutorial, iteração 4): coordenada no palco = coordenada na tela / escala.
const EscalaPalco = createContext(1);

export function useEscalaPalco(): number {
  return useContext(EscalaPalco);
}

function medir() {
  return enquadrarPalco(window.innerWidth, window.innerHeight);
}

export function Palco({ children }: { children: ReactNode }) {
  const [quadro, setQuadro] = useState(medir);

  useEffect(() => {
    const aoRedimensionar = () => setQuadro(medir());
    window.addEventListener('resize', aoRedimensionar);
    return () => window.removeEventListener('resize', aoRedimensionar);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* O transform faz deste div o bloco de contenção dos filhos com
          position: fixed, então HUD e overlays ficam presos ao palco. */}
      <div
        className="absolute left-0 top-0 overflow-hidden bg-madeira"
        style={{
          width: LARGURA_PALCO,
          height: ALTURA_PALCO,
          transform: `translate(${quadro.x}px, ${quadro.y}px) scale(${quadro.escala})`,
          transformOrigin: 'top left',
        }}
      >
        <EscalaPalco.Provider value={quadro.escala}>{children}</EscalaPalco.Provider>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Usar no App**

Em `src/App.tsx`: importar `Palco`, envolver o retorno principal (não a vitrine) e trocar `h-screen w-screen` por `h-full w-full`:

```tsx
  return (
    <Palco>
      <div className="relative h-full w-full">
        <Fundo />
        {fase !== 'abertura' && <Hud fase={fase} mudo={som.mudo} alternarMudo={som.alternarMudo} />}
        <main className={fase === 'abertura' ? 'h-full' : 'h-full pt-14'}>
          {/* ...fases, sem mudança... */}
        </main>
      </div>
    </Palco>
  );
```

- [ ] **Step 5: Rodar**

Run: `npm test && npm run build`
Expected: PASS e build OK.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: palco fixo de 1920x1080"
```

---

### Task 3: Cenário da taverna

**Files:**
- Create: `src/engine/brasas.ts`, `src/engine/brasas.test.ts`, `src/components/ui/Taverna.tsx`, `src/styles/taverna.css`
- Delete: `src/components/ui/Fundo.tsx`
- Modify: `src/App.tsx`, `src/styles/global.css`

**Interfaces:**
- Produces: `gerarBrasas(quantidade: number, semente: number): Brasa[]` com `Brasa = { x: number; tamanho: number; duracao: number; atraso: number; deriva: number }`; componente `<Taverna />`.

- [ ] **Step 1: Teste que falha**

`src/engine/brasas.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { gerarBrasas } from './brasas';

describe('gerarBrasas', () => {
  const brasas = gerarBrasas(26, 7);

  it('gera a quantidade pedida', () => {
    expect(brasas).toHaveLength(26);
  });

  it('mantém cada valor dentro da faixa', () => {
    for (const b of brasas) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x).toBeLessThanOrEqual(100);
      expect(b.tamanho).toBeGreaterThanOrEqual(3);
      expect(b.tamanho).toBeLessThanOrEqual(7);
      expect(b.duracao).toBeGreaterThanOrEqual(7);
      expect(b.duracao).toBeLessThanOrEqual(14);
      expect(b.atraso).toBeGreaterThanOrEqual(0);
      expect(b.atraso).toBeLessThanOrEqual(b.duracao);
      expect(Math.abs(b.deriva)).toBeLessThanOrEqual(60);
    }
  });

  it('é determinístico pela semente (mesma tela em todo ensaio)', () => {
    expect(gerarBrasas(26, 7)).toEqual(brasas);
    expect(gerarBrasas(26, 8)).not.toEqual(brasas);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/engine/brasas.test.ts`
Expected: FAIL, import não resolve.

- [ ] **Step 3: Implementar**

`src/engine/brasas.ts`:

```ts
// Brasas que sobem da lareira no cenário (01-tema-e-hud.md §4). Posições
// geradas com semente fixa para a tela ser igual em todo ensaio.
export interface Brasa {
  x: number; // % da largura
  tamanho: number; // px
  duracao: number; // s para subir a tela inteira
  atraso: number; // s já percorridos ao abrir, para não nascerem todas juntas
  deriva: number; // px de desvio lateral até o topo
}

// mulberry32: gerador pequeno e determinístico, suficiente para decoração.
function aleatorio(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarBrasas(quantidade: number, semente: number): Brasa[] {
  const sorte = aleatorio(semente);
  return Array.from({ length: quantidade }, () => {
    const duracao = 7 + sorte() * 7;
    return {
      x: sorte() * 100,
      tamanho: 3 + sorte() * 4,
      duracao,
      atraso: sorte() * duracao,
      deriva: (sorte() * 2 - 1) * 60,
    };
  });
}
```

`src/styles/taverna.css`:

```css
/* Cenário da taverna (docs/redesign/01-tema-e-hud.md §4). */

.taverna-pintura {
  position: absolute;
  inset: -12px;
  background-size: cover;
  background-position: center;
  filter: blur(3px) brightness(0.55) saturate(1.1);
  animation: taverna-deriva 20s ease-in-out infinite alternate;
}

/* Centro mais escuro, onde ficam as cartas. */
.taverna-pintura::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 55% 50% at 50% 45%, rgb(20 13 8 / 0.6), transparent 75%);
}

@keyframes taverna-deriva {
  from {
    transform: translate(-6px, -3px);
  }
  to {
    transform: translate(6px, 3px);
  }
}

.taverna-vela {
  position: absolute;
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(255 170 80 / 0.22), transparent 65%);
  mix-blend-mode: screen;
  animation: taverna-vela 3.2s ease-in-out infinite alternate;
}

.taverna-vela-esquerda {
  left: -250px;
  top: 80px;
}

.taverna-vela-direita {
  right: -300px;
  top: -200px;
  animation-duration: 4.1s;
  animation-delay: -1.3s;
}

@keyframes taverna-vela {
  0% {
    opacity: 0.75;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(1.04);
  }
  70% {
    opacity: 0.85;
  }
  100% {
    opacity: 0.95;
    transform: scale(0.98);
  }
}

.taverna-tampo {
  position: absolute;
  inset: auto 0 0 0;
  height: 300px;
  background-size: cover;
  background-position: center top;
  filter: brightness(0.6);
  -webkit-mask-image: linear-gradient(to top, #000 55%, transparent);
  mask-image: linear-gradient(to top, #000 55%, transparent);
}

.taverna-brasa {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  background: var(--brasa);
  box-shadow: 0 0 8px 2px rgb(255 122 47 / 0.7);
  opacity: 0;
  animation-name: taverna-brasa;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes taverna-brasa {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    transform: translate(var(--deriva), -900px);
    opacity: 0;
  }
}

.taverna-vinheta {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 260px 80px var(--madeira-profunda);
}

@media (prefers-reduced-motion: reduce) {
  .taverna-brasa {
    display: none;
  }
}
```

`src/components/ui/Taverna.tsx`:

```tsx
import { useMemo, type CSSProperties } from 'react';
import { gerarBrasas } from '../../engine/brasas';

const PINTURA = `${import.meta.env.BASE_URL}assets/cenario/taverna-fundo.webp`;
const TAMPO = `${import.meta.env.BASE_URL}assets/cenario/tampo-mesa.webp`;

// Camadas de trás para frente: pintura, luz de vela, tampo, brasas, vinheta.
export function Taverna() {
  const brasas = useMemo(() => gerarBrasas(26, 7), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="taverna-pintura" style={{ backgroundImage: `url(${PINTURA})` }} />
      <div className="taverna-vela taverna-vela-esquerda" />
      <div className="taverna-vela taverna-vela-direita" />
      <div className="taverna-tampo" style={{ backgroundImage: `url(${TAMPO})` }} />
      {brasas.map((brasa, i) => (
        <span
          key={i}
          className="taverna-brasa"
          style={
            {
              left: `${brasa.x}%`,
              width: brasa.tamanho,
              height: brasa.tamanho,
              animationDuration: `${brasa.duracao}s`,
              animationDelay: `-${brasa.atraso}s`,
              '--deriva': `${brasa.deriva}px`,
            } as CSSProperties
          }
        />
      ))}
      <div className="taverna-vinheta" />
    </div>
  );
}
```

- [ ] **Step 4: Integrar**

- `src/styles/global.css`: adicionar `@import './taverna.css';` depois de `@import './cartas.css';`.
- `src/App.tsx`: trocar `import { Fundo } from './components/ui/Fundo';` por `import { Taverna } from './components/ui/Taverna';` e `<Fundo />` por `<Taverna />`; `main` ganha `relative` na classe (`'relative h-full'` / `'relative h-full pt-14'`) para ficar acima do cenário.
- `git rm src/components/ui/Fundo.tsx`.

- [ ] **Step 5: Rodar**

Run: `npm test && npm run build`
Expected: PASS e build OK.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: cenário da taverna"
```

---

### Task 4: Grimório e notificações

**Files:**
- Create: `src/engine/digitacao.ts`, `src/engine/digitacao.test.ts`, `src/engine/notificacoes.ts`, `src/engine/notificacoes.test.ts`, `src/components/ui/Grimorio.tsx`, `src/components/ui/NotificacoesGrimorio.tsx`, `src/styles/grimorio.css`
- Modify: `src/styles/global.css`, `src/App.tsx`

**Interfaces:**
- Consumes: `useSom().tocar('ping')` (já existe).
- Produces: `digitar(linhas: string[], caracteres: number): { linhas: string[]; completo: boolean }`; `CARACTERES_POR_SEGUNDO = 40`; `adicionarNotificacao(lista, texto, agora, id)`, `removerExpiradas(lista, agora)`, `DURACAO_NOTIFICACAO_MS = 3000`, `MAXIMO_NOTIFICACOES = 3`, tipo `Notificacao = { id: number; texto: string; expiraEm: number }`; componente `<Grimorio linhas={string[]} instantaneo? compacto? aoConcluir? className? />`; `<GrimorioProvider aoNotificar?>` e `useGrimorio(): { notificar(texto: string): void }`.

- [ ] **Step 1: Testes que falham**

`src/engine/digitacao.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { digitar } from './digitacao';

describe('digitar', () => {
  const linhas = ['abc', 'de'];

  it('nada digitado ainda', () => {
    expect(digitar(linhas, 0)).toEqual({ linhas: [], completo: false });
  });

  it('meio da primeira linha', () => {
    expect(digitar(linhas, 2)).toEqual({ linhas: ['ab'], completo: false });
  });

  it('fim exato da primeira linha não abre a segunda', () => {
    expect(digitar(linhas, 3)).toEqual({ linhas: ['abc'], completo: false });
  });

  it('começo da segunda linha', () => {
    expect(digitar(linhas, 4)).toEqual({ linhas: ['abc', 'd'], completo: false });
  });

  it('tudo digitado', () => {
    expect(digitar(linhas, 5)).toEqual({ linhas: ['abc', 'de'], completo: true });
    expect(digitar(linhas, 99)).toEqual({ linhas: ['abc', 'de'], completo: true });
  });

  it('valor negativo conta como zero', () => {
    expect(digitar(linhas, -3)).toEqual({ linhas: [], completo: false });
  });

  it('sem linhas já está completo', () => {
    expect(digitar([], 0)).toEqual({ linhas: [], completo: true });
  });

  it('linha nova no log continua de onde parou, sem redigitar', () => {
    expect(digitar(['abc', 'de', 'fg'], 5)).toEqual({ linhas: ['abc', 'de'], completo: false });
  });
});
```

`src/engine/notificacoes.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DURACAO_NOTIFICACAO_MS, adicionarNotificacao, removerExpiradas } from './notificacoes';

describe('notificações do Grimório', () => {
  it('nova notificação expira 3 s depois', () => {
    expect(adicionarNotificacao([], 'CAIXA −15', 1000, 1)).toEqual([
      { id: 1, texto: 'CAIXA −15', expiraEm: 1000 + DURACAO_NOTIFICACAO_MS },
    ]);
  });

  it('mantém no máximo 3, descartando as mais antigas', () => {
    let lista = adicionarNotificacao([], 'a', 0, 1);
    lista = adicionarNotificacao(lista, 'b', 10, 2);
    lista = adicionarNotificacao(lista, 'c', 20, 3);
    lista = adicionarNotificacao(lista, 'd', 30, 4);
    expect(lista.map((n) => n.texto)).toEqual(['b', 'c', 'd']);
  });

  it('remove as vencidas, inclusive a que vence exatamente agora', () => {
    const lista = [
      { id: 1, texto: 'a', expiraEm: 100 },
      { id: 2, texto: 'b', expiraEm: 200 },
    ];
    expect(removerExpiradas(lista, 100)).toEqual([{ id: 2, texto: 'b', expiraEm: 200 }]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/engine/digitacao.test.ts src/engine/notificacoes.test.ts`
Expected: FAIL, imports não resolvem.

- [ ] **Step 3: Implementar a lógica**

`src/engine/digitacao.ts`:

```ts
// Efeito de digitação do Grimório: dado quantos caracteres já foram
// digitados, quanto de cada linha aparece (linhas digitadas em sequência).
export const CARACTERES_POR_SEGUNDO = 40;

export interface Digitacao {
  linhas: string[];
  completo: boolean;
}

export function digitar(linhas: string[], caracteres: number): Digitacao {
  let restante = Math.max(0, Math.floor(caracteres));
  const total = linhas.reduce((soma, linha) => soma + linha.length, 0);
  const visiveis: string[] = [];
  for (const linha of linhas) {
    if (restante <= 0) break;
    visiveis.push(linha.slice(0, restante));
    restante -= linha.length;
  }
  return { linhas: visiveis, completo: Math.max(0, caracteres) >= total };
}
```

`src/engine/notificacoes.ts`:

```ts
// Fila das notificações do Grimório (01-tema-e-hud.md §5): cada uma fica 3 s.
export const DURACAO_NOTIFICACAO_MS = 3000;
export const MAXIMO_NOTIFICACOES = 3;

export interface Notificacao {
  id: number;
  texto: string;
  expiraEm: number;
}

export function adicionarNotificacao(lista: Notificacao[], texto: string, agora: number, id: number): Notificacao[] {
  return [...lista, { id, texto, expiraEm: agora + DURACAO_NOTIFICACAO_MS }].slice(-MAXIMO_NOTIFICACOES);
}

export function removerExpiradas(lista: Notificacao[], agora: number): Notificacao[] {
  return lista.filter((notificacao) => notificacao.expiraEm > agora);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/engine/digitacao.test.ts src/engine/notificacoes.test.ts`
Expected: PASS.

- [ ] **Step 5: Componentes**

`src/styles/grimorio.css`:

```css
/* O Grimório: único elemento com estética de terminal (01-tema-e-hud.md §5). */

.grimorio {
  position: relative;
  padding: 44px 36px 26px;
  background: var(--runa-fundo);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border: 2px solid var(--runa);
  border-radius: 6px;
  box-shadow:
    0 0 18px rgb(127 232 255 / 0.35),
    inset 0 0 24px rgb(127 232 255 / 0.12);
  color: var(--runa);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 30px;
  line-height: 1.4;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgb(127 232 255 / 0.6);
  overflow: hidden;
}

.grimorio-compacto {
  padding: 36px 24px 16px;
  font-size: 28px;
}

/* Linhas de varredura sutis. */
.grimorio::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgb(127 232 255 / 0.06) 0 2px, transparent 2px 5px);
}

.grimorio-aba {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  letter-spacing: 0.24em;
  opacity: 0.85;
  white-space: nowrap;
}

.grimorio-canto {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 0 solid var(--runa);
}

.grimorio-canto-no {
  top: 6px;
  left: 6px;
  border-top-width: 4px;
  border-left-width: 4px;
}

.grimorio-canto-ne {
  top: 6px;
  right: 6px;
  border-top-width: 4px;
  border-right-width: 4px;
}

.grimorio-canto-so {
  bottom: 6px;
  left: 6px;
  border-bottom-width: 4px;
  border-left-width: 4px;
}

.grimorio-canto-se {
  bottom: 6px;
  right: 6px;
  border-bottom-width: 4px;
  border-right-width: 4px;
}

.grimorio-linha {
  margin: 0;
  white-space: pre-wrap;
}

.grimorio-cursor {
  animation: grimorio-piscar 1s steps(1) infinite;
}

@keyframes grimorio-piscar {
  50% {
    opacity: 0;
  }
}
```

`src/components/ui/Grimorio.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { CARACTERES_POR_SEGUNDO, digitar } from '../../engine/digitacao';

interface GrimorioProps {
  linhas: string[];
  // Mostra tudo de uma vez (também automático com movimento reduzido).
  instantaneo?: boolean;
  compacto?: boolean;
  aoConcluir?: () => void;
  className?: string;
}

function useDigitacao(linhas: string[], instantaneo: boolean) {
  const [caracteres, setCaracteres] = useState(0);
  const total = linhas.reduce((soma, linha) => soma + linha.length, 0);

  useEffect(() => {
    if (instantaneo || caracteres >= total) return;
    const id = setTimeout(() => setCaracteres((c) => c + 1), 1000 / CARACTERES_POR_SEGUNDO);
    return () => clearTimeout(id);
  }, [caracteres, total, instantaneo]);

  return digitar(linhas, instantaneo ? total : caracteres);
}

export function Grimorio({ linhas, instantaneo = false, compacto = false, aoConcluir, className = '' }: GrimorioProps) {
  const reduzido = useReducedMotion();
  const { linhas: visiveis, completo } = useDigitacao(linhas, instantaneo || !!reduzido);
  const aoConcluirRef = useRef(aoConcluir);
  aoConcluirRef.current = aoConcluir;

  useEffect(() => {
    if (completo) aoConcluirRef.current?.();
  }, [completo]);

  const cursor = <span className="grimorio-cursor">█</span>;

  return (
    <div className={`grimorio ${compacto ? 'grimorio-compacto' : ''} ${className}`}>
      <span className="grimorio-aba">[ GRIMÓRIO ]</span>
      <span className="grimorio-canto grimorio-canto-no" />
      <span className="grimorio-canto grimorio-canto-ne" />
      <span className="grimorio-canto grimorio-canto-so" />
      <span className="grimorio-canto grimorio-canto-se" />
      {/* Leitor de tela recebe o texto inteiro, não letra por letra. */}
      <p className="sr-only">{linhas.join('. ')}</p>
      <div aria-hidden>
        {visiveis.length === 0 && <p className="grimorio-linha">› {cursor}</p>}
        {visiveis.map((linha, i) => (
          <p key={i} className="grimorio-linha">
            › {linha}
            {i === visiveis.length - 1 && cursor}
          </p>
        ))}
      </div>
    </div>
  );
}
```

`src/components/ui/NotificacoesGrimorio.tsx`:

```tsx
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { adicionarNotificacao, removerExpiradas, type Notificacao } from '../../engine/notificacoes';
import { mola } from '../../styles/movimento';
import { Grimorio } from './Grimorio';

const Notificar = createContext<(texto: string) => void>(() => {});

export function useGrimorio() {
  return { notificar: useContext(Notificar) };
}

interface GrimorioProviderProps {
  children: ReactNode;
  // Chamado a cada notificação (o App toca o "ping").
  aoNotificar?: () => void;
}

export function GrimorioProvider({ children, aoNotificar }: GrimorioProviderProps) {
  const [lista, setLista] = useState<Notificacao[]>([]);
  const proximoId = useRef(0);
  const aoNotificarRef = useRef(aoNotificar);
  aoNotificarRef.current = aoNotificar;

  const notificar = useCallback((texto: string) => {
    setLista((atual) => adicionarNotificacao(atual, texto, Date.now(), proximoId.current++));
    aoNotificarRef.current?.();
  }, []);

  useEffect(() => {
    if (lista.length === 0) return;
    const proxima = Math.min(...lista.map((n) => n.expiraEm));
    const id = setTimeout(() => setLista((atual) => removerExpiradas(atual, Date.now())), Math.max(0, proxima - Date.now()));
    return () => clearTimeout(id);
  }, [lista]);

  return (
    <Notificar.Provider value={notificar}>
      {children}
      <div className="pointer-events-none absolute right-8 top-24 z-40 flex w-[460px] flex-col gap-3">
        <AnimatePresence initial={false}>
          {lista.map((notificacao) => (
            <motion.div
              key={notificacao.id}
              initial={{ x: 520, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 520, opacity: 0 }}
              transition={mola.carta}
            >
              <Grimorio linhas={[notificacao.texto]} compacto />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Notificar.Provider>
  );
}
```

Este arquivo importa `mola` de `src/styles/movimento.ts`, que a Task 6 cria com testes. Para a Task 4 compilar sozinha, criar agora `src/styles/movimento.ts` só com:

```ts
import type { Transition } from 'framer-motion';

// Molas e durações padronizadas (docs/redesign/06-animacoes.md §2).
export const mola = {
  carta: { type: 'spring', stiffness: 260, damping: 22 },
  impacto: { type: 'spring', stiffness: 500, damping: 18 },
  suave: { type: 'spring', stiffness: 120, damping: 20 },
} satisfies Record<string, Transition>;
```

- [ ] **Step 6: Integrar**

- `src/styles/global.css`: `@import './grimorio.css';` depois de `taverna.css`.
- `src/App.tsx`: dentro do `<Palco>`, envolver o conteúdo em `<GrimorioProvider aoNotificar={() => som.tocar('ping')}>`, e adicionar o aviso de som (primeiro uso real das notificações), definido no próprio `App.tsx`:

```tsx
// Avisa no Grimório quando o som liga ou desliga (tecla M ou botão do HUD).
function AvisoDeSom({ mudo }: { mudo: boolean }) {
  const { notificar } = useGrimorio();
  const primeiro = useRef(true);
  useEffect(() => {
    if (primeiro.current) {
      primeiro.current = false;
      return;
    }
    notificar(mudo ? 'som desligado' : 'som ligado');
  }, [mudo, notificar]);
  return null;
}
```

e renderizar `<AvisoDeSom mudo={som.mudo} />` dentro do provider.

- [ ] **Step 7: Rodar**

Run: `npm test && npm run build`
Expected: PASS e build OK.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: Grimório com digitação e notificações"
```

---

### Task 5: Abertura com o Grimório

**Files:**
- Modify: `src/fases/F0Abertura.tsx`, `src/components/ui/Botao.tsx`, `src/components/hud/Hud.tsx`

**Interfaces:**
- Consumes: `<Grimorio linhas aoConcluir className />` (Task 4), `<Titulo>` e `.titulo-ouro` (Task 1).

- [ ] **Step 1: Abertura**

`src/fases/F0Abertura.tsx` inteiro (texto de `docs/redesign/03-historia.md` §3):

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Titulo } from '../components/ui/Titulo';
import { Botao } from '../components/ui/Botao';
import { Grimorio } from '../components/ui/Grimorio';
import type { FaseProps } from '../types';
import type { useSom } from '../engine/useSom';

const BOOT = [
  'abrindo a taverna...',
  'tomo A: 38 estudos · 21 anos',
  'tomo B: 1 startup · 8 anos',
  '2 caminhos: planejar ou improvisar',
  'acendendo as velas',
];

interface F0AberturaProps extends FaseProps {
  som: ReturnType<typeof useSom>;
}

export function F0Abertura({ avancar, som }: F0AberturaProps) {
  const [pronto, setPronto] = useState(false);

  function entrar() {
    som.tocar('clique');
    avancar();
  }

  return (
    <section className="flex h-full flex-col items-center justify-center gap-14 text-center">
      <Grimorio linhas={BOOT} aoConcluir={() => setPronto(true)} className="w-[980px] text-left" />
      {/* Altura fixa: o Grimório não pula quando o título aparece. */}
      <div className="flex h-[340px] flex-col items-center gap-8">
        {pronto && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <Titulo>A Taverna dos Dois Tomos</Titulo>
              <p className="mt-4 font-texto text-[36px] italic text-pergaminho/85">
                a crônica de uma startup real, jogada em cartas
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
              <Botao onClick={entrar}>Entrar na taverna</Botao>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Botão no tema**

`src/components/ui/Botao.tsx`, só as constantes `base` e `estilos`:

```tsx
  const base =
    'rounded-md px-10 py-4 font-titulo text-[36px] font-bold tracking-[0.04em] transition-transform active:scale-95';
  const estilos =
    variante === 'primario'
      ? 'border-2 border-ouro-claro bg-gradient-to-b from-ouro-claro via-ouro to-ouro-escuro text-tinta shadow-carta hover:brightness-110'
      : 'border-2 border-pergaminho/40 text-pergaminho hover:border-pergaminho';
```

- [ ] **Step 3: Nome no HUD**

`src/components/hud/Hud.tsx`: trocar o texto `Startup Arena` por `A Taverna dos Dois Tomos`.

- [ ] **Step 4: Rodar**

Run: `npm test && npm run build`
Expected: PASS e build OK.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: abertura com o Grimório"
```

---

### Task 6: Transição de página entre fases

**Files:**
- Modify: `src/styles/movimento.ts` (criado na Task 4), `src/styles/taverna.css`, `src/App.tsx`
- Create: `src/styles/movimento.test.ts`, `src/components/ui/TransicaoPagina.tsx`

**Interfaces:**
- Consumes: `useSom().tocar('pagina')`.
- Produces: `DURACAO_PAGINA_S = 0.9`, `DURACAO_FADE_S = 0.3`, `temposTransicao(reduzido: boolean): { saida: number; entrada: number; folha: number }`; componente `<TransicaoPagina chave={string} aoVirar?>{children}</TransicaoPagina>`.

- [ ] **Step 1: Teste que falha**

`src/styles/movimento.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DURACAO_FADE_S, DURACAO_PAGINA_S, temposTransicao } from './movimento';

describe('temposTransicao', () => {
  it('página virando leva 900 ms e troca a fase no meio, com a folha cobrindo tudo', () => {
    expect(DURACAO_PAGINA_S).toBe(0.9);
    expect(temposTransicao(false)).toEqual({ saida: 0.45, entrada: 0, folha: 0.9 });
  });

  it('com movimento reduzido vira fade de 300 ms, sem folha', () => {
    expect(DURACAO_FADE_S).toBe(0.3);
    expect(temposTransicao(true)).toEqual({ saida: 0.15, entrada: 0.15, folha: 0 });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/styles/movimento.test.ts`
Expected: FAIL, `temposTransicao` não exportado.

- [ ] **Step 3: Implementar tempos**

Acrescentar em `src/styles/movimento.ts`:

```ts
export const DURACAO_PAGINA_S = 0.9;
export const DURACAO_FADE_S = 0.3;

// Página de tomo virando (01-tema-e-hud.md §9): a folha de pergaminho gira
// 180° em volta da borda esquerda; no meio do giro ela cobre o palco inteiro
// e a fase troca por baixo. Com movimento reduzido, só um fade.
export function temposTransicao(reduzido: boolean) {
  return reduzido
    ? { saida: DURACAO_FADE_S / 2, entrada: DURACAO_FADE_S / 2, folha: 0 }
    : { saida: DURACAO_PAGINA_S / 2, entrada: 0, folha: DURACAO_PAGINA_S };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/styles/movimento.test.ts`
Expected: PASS.

- [ ] **Step 5: Componente**

Acrescentar em `src/styles/taverna.css`:

```css
/* Folha da transição entre fases. */
.folha-pagina {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 60% 40%, #f8eed6 0%, var(--pergaminho) 55%, #cdb384 100%);
  box-shadow: 0 0 120px rgb(0 0 0 / 0.7);
}

/* Sombra da lombada à esquerda e da borda à direita. */
.folha-pagina::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgb(42 29 20 / 0.5),
    transparent 16%,
    transparent 86%,
    rgb(42 29 20 / 0.3)
  );
}
```

`src/components/ui/TransicaoPagina.tsx`:

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { temposTransicao } from '../../styles/movimento';

interface TransicaoPaginaProps {
  chave: string;
  children: ReactNode;
  aoVirar?: () => void;
}

export function TransicaoPagina({ chave, children, aoVirar }: TransicaoPaginaProps) {
  const tempos = temposTransicao(!!useReducedMotion());
  // Conta as viradas para reiniciar a folha a cada troca (e não animar no carregamento).
  const [viradas, setViradas] = useState(0);
  const chaveAnterior = useRef(chave);
  const aoVirarRef = useRef(aoVirar);
  aoVirarRef.current = aoVirar;

  useEffect(() => {
    if (chaveAnterior.current === chave) return;
    chaveAnterior.current = chave;
    setViradas((v) => v + 1);
    aoVirarRef.current?.();
  }, [chave]);

  return (
    // perspectiveOrigin na borda esquerda: a folha fica de perfil (invisível)
    // no começo e no fim do giro, em vez de aparecer como uma parede.
    <div className="absolute inset-0" style={{ perspective: 4000, perspectiveOrigin: '0% 50%' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={chave}
          className="absolute inset-0"
          initial={{ opacity: tempos.entrada > 0 ? 0 : 1 }}
          animate={{ opacity: 1, transition: { duration: tempos.entrada } }}
          // A fase antiga fica na tela até a folha cobrir tudo (0,999: o
          // Framer só respeita a duração se o valor mudar).
          exit={{ opacity: tempos.entrada > 0 ? 0 : 0.999, transition: { duration: tempos.saida } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {tempos.folha > 0 && viradas > 0 && (
        <motion.div
          key={viradas}
          className="folha-pagina"
          style={{ transformOrigin: 'left center' }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: -90, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: tempos.folha,
            ease: 'easeInOut',
            opacity: { duration: tempos.folha, times: [0, 0.12, 0.88, 1] },
          }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 6: Integrar no App**

Em `src/App.tsx`, trocar o `<main>` por:

```tsx
        <TransicaoPagina chave={fase} aoVirar={() => som.tocar('pagina')}>
          <main className={fase === 'abertura' ? 'relative h-full' : 'relative h-full pt-14'}>
            {/* ...fases, sem mudança... */}
          </main>
        </TransicaoPagina>
```

- [ ] **Step 7: Rodar**

Run: `npm test && npm run build`
Expected: PASS e build OK.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: transição de página entre fases"
```

---

### Task 7: Conferência visual e documentação

**Files:**
- Modify: `docs/redesign/00-visao-geral.md` (marcar iteração 1), `README.md` (título do jogo)

- [ ] **Step 1: Capturas de tela**

```bash
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 3
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1920,1080 --virtual-time-budget=9000 \
  --screenshot="$SCRATCH/f0-1080.png" http://localhost:4173/empreendedorismo/
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1366,768 --virtual-time-budget=9000 \
  --screenshot="$SCRATCH/f0-768.png" http://localhost:4173/empreendedorismo/
```

Conferir nas imagens: taverna ao fundo com vinheta, Grimório com aba e cantos, título em ouro, botão; em 1366×768 o mesmo enquadramento menor, sem rolagem. Encerrar o preview.

- [ ] **Step 2: Docs**

- `docs/redesign/00-visao-geral.md` §5: na linha da iteração 1, acrescentar "**feita**" na coluna Entrega.
- `README.md`: título `# A Taverna dos Dois Tomos` (mantendo "Startup Arena" como nome do repositório na primeira frase).

- [ ] **Step 3: Rodar e commit**

```bash
npm test && npm run build
git add -A && git commit -m "docs: iteração 1 concluída"
```
