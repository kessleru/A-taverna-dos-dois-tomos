# Iteração 2 — Cartas e HUD: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Plano enxuto por pedido do usuário (economia de tokens): cada task traz arquivos, interfaces, testes e critério de pronto; o código sai direto na implementação, sempre com o teste escrito e visto falhando antes.

**Goal:** Trocar as molduras das cartas pelas molduras pintadas dos pacotes (bronze, prata, ouro) e o HUD da rodada por orbes e um mapa da jornada, no tema da taverna.

**Spec:** `docs/redesign/00-visao-geral.md` §5 (iteração 2), `01-tema-e-hud.md` §7 (HUD) e §8 (cartas), `08-assets.md` §7 (molduras). A ampliação de carta (04 §2.4) já existe ao segurar o cursor; a tecla `Z` depende do foco por passo e fica para a iteração 3. A Tapeçaria (Canvas) depende dos dados da iteração 3 e fica para lá.

## Decisões de desenho

- **Moldura por raridade:** comum = bronze, rara = prata, lendária = ouro (`public/assets/molduras/carta-*.webp`, 1024×1440, 5:7).
- **Medidas da moldura** (em % da carta): gema de cima centrada em (16,5%, 11%), diâmetro 20%; janela de arte 20–80% × 13,8–54,7%; placa do nome 12–88% × 58,5–64,5%; área de texto 14–86% × 66,5–88%; gemas de baixo centradas em (16%, 86,5%) e (84%, 86,5%), diâmetro 17%.
- **Uso das gemas:** tomos (prata): em cima a letra do tomo; embaixo Abrangência (esq.) e Profundidade (dir.), como ataque e vida (01 §8.2). Decisões: em cima a tecla (1, 2, 3; ferramenta na Bricolagem); embaixo o sigilo da lógica (esq.) e o risco (dir., `orbeDecisao`). Lendária: em cima o troféu; embaixo ✦.
- A moldura é desenhada numa base fixa de 260×364 px e o tamanho "pequena" aplica zoom 170/260 sobre ela; o `ESCALA_CARTA` geral continua valendo.
- **Orbe do HUD:** anel `public/assets/ui/orbe.webp` com líquido colorido em SVG (altura = valor), número em Cinzel e rótulo embaixo. Caixa ouro, Clientes violeta, Moral brasa. Abaixo de 15: pulsa em `--dano`.
- **Mapa da jornada:** estrada com 4 marcos; atual pulsa; concluídos mostram o sigilo da carta jogada e um selo quando bateu com a história real.

## Tasks

### Task 1: Moldura de carta pintada
- Create: `src/components/cartas/moldura.ts` (+ teste): `MOLDURA_POR_RARIDADE`, `urlMoldura(raridade)`, constantes de posição `SLOTS_MOLDURA`.
- Rewrite: `src/components/cartas/MolduraCarta.tsx` com a imagem da moldura por cima da arte e os slots `gemaTopo`, `gemaEsquerda`, `gemaDireita`, `nome`, `subtitulo`, `children` (texto).
- Modify: `CartaArtigo.tsx`, `CartaDecisao.tsx`, `CartaLendaria.tsx` para os slots novos; `src/data/assets.ts` inclui as molduras no carregamento.
- Teste: cada raridade aponta para um arquivo existente em `molduras/`; slots dentro de 0–100%; `IMAGENS` inclui as molduras.
- Pronto: vitrine e F1/F2 mostram as cartas novas legíveis; build e testes verdes; commit.

### Task 2: Orbe do HUD
- Create: `src/engine/indicador.ts` (+ teste): `nivelLiquido(valor, min, max)` (0–1, limitado), `emAlerta(valor)`.
- Create: `src/components/hud/OrboIndicador.tsx`.
- Pronto: F2 usa os orbes no lugar das barras; commit.

### Task 3: Mapa da jornada
- Create: `src/engine/jornada.ts` (+ teste): `marcosDaJornada(etapaAtual, escolhas, ideais)` → estado de cada marco (`futuro | atual | feito`), sigilo e se bateu com a história real.
- Create: `src/components/hud/MapaJornada.tsx`.
- Pronto: F2 usa o mapa no lugar da trilha; commit.

### Task 4: Vitrine atualizada
- Modify: `src/fases/Vitrine.tsx`: todos os tipos de carta nas três raridades, trancada, verso, orbes em vários valores (inclusive alerta) e o mapa em etapas diferentes.
- Pronto: `#vitrine` mostra tudo sem erro; commit.
