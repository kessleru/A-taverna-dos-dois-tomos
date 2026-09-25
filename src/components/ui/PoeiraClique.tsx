import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ALTURA_PALCO, LARGURA_PALCO } from '../../engine/palco';
import {
  atualizarParticulas,
  emitirFaiscas,
  emitirPoeira,
  forcaDaSequencia,
  opacidadeAtual,
  proximaSequencia,
  tamanhoAtual,
  type Particula,
  type Sequencia,
} from '../../engine/poeira';
import { useSomDoJogo } from '../../engine/SomContexto';
import { useEscalaPalco } from './Palco';
import { useTremor } from './Tremor';

// O que conta como "clicável": ali o clique solta faíscas, não poeira.
const CLICAVEL = 'button, a[href], [role="button"], label, .cursor-pointer';
// A partir do 4º clique seguido no mesmo lugar, a mesa inteira sente.
const SEQUENCIA_QUE_TREME = 3;
const TAMANHO_SPRITE = 64;

// Nuvem macia pré-desenhada (um degradê só): desenhar o sprite com drawImage
// é bem mais barato que montar um degradê por partícula a cada quadro.
function criarSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = TAMANHO_SPRITE;
  const ctx = sprite.getContext('2d')!;
  const meio = TAMANHO_SPRITE / 2;
  const degrade = ctx.createRadialGradient(meio, meio, 0, meio, meio, meio);
  degrade.addColorStop(0, 'rgb(255 255 255 / 1)');
  degrade.addColorStop(0.45, 'rgb(255 255 255 / 0.5)');
  degrade.addColorStop(1, 'rgb(255 255 255 / 0)');
  ctx.fillStyle = degrade;
  ctx.fillRect(0, 0, TAMANHO_SPRITE, TAMANHO_SPRITE);
  return sprite;
}

// Tinge o sprite branco com a cor da nuvem (um por cor, em cache).
function spriteColorido(branco: HTMLCanvasElement, cor: string, cache: Map<string, HTMLCanvasElement>): HTMLCanvasElement {
  const pronto = cache.get(cor);
  if (pronto) return pronto;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = TAMANHO_SPRITE;
  const ctx = sprite.getContext('2d')!;
  ctx.drawImage(branco, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = cor;
  ctx.fillRect(0, 0, TAMANHO_SPRITE, TAMANHO_SPRITE);
  cache.set(cor, sprite);
  return sprite;
}

function desenhar(ctx: CanvasRenderingContext2D, particulas: Particula[], branco: HTMLCanvasElement, cache: Map<string, HTMLCanvasElement>) {
  for (const p of particulas) {
    const alfa = opacidadeAtual(p);
    if (alfa <= 0.01) continue;
    const r = tamanhoAtual(p);
    ctx.globalAlpha = alfa;
    if (p.tipo === 'nuvem') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(spriteColorido(branco, p.cor, cache), p.x - r, p.y - r * 0.75, r * 2, r * 1.5);
    } else if (p.tipo === 'grao') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.giro);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-r, -r * 0.7, r * 2, r * 1.4);
      ctx.restore();
    } else if (p.tipo === 'anel') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, r, r * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.tipo === 'aro') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Fagulha: ponto quente com rastro curto na direção do voo.
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = p.cor;
      ctx.lineWidth = r;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

// Camada de efeitos do clique, por cima de toda a mesa. Um canvas só, sem
// receber o mouse; o laço de desenho só roda enquanto há partículas vivas,
// então parado não custa nada.
export function PoeiraClique() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const escala = useEscalaPalco();
  const reduzido = useReducedMotion();
  const som = useSomDoJogo();
  const tremer = useTremor();
  const refs = useRef({ som, tremer, reduzido, escala });
  refs.current = { som, tremer, reduzido, escala };

  useEffect(() => {
    const elemento = canvas.current;
    const ctx = elemento?.getContext('2d');
    if (!elemento || !ctx) return;
    const branco = criarSprite();
    const cache = new Map<string, HTMLCanvasElement>();
    let particulas: Particula[] = [];
    let quadro: number | null = null;
    let anterior = 0;
    let sequencia: Sequencia | null = null;
    // Resolução do canvas = tamanho real na tela, para o pó não sair borrado.
    let resolucao = 0;

    function ajustarResolucao() {
      const nova = Math.max(0.25, refs.current.escala * (window.devicePixelRatio || 1));
      if (nova === resolucao || !elemento || !ctx) return;
      resolucao = nova;
      elemento.width = Math.round(LARGURA_PALCO * nova);
      elemento.height = Math.round(ALTURA_PALCO * nova);
    }

    function passo(agora: number) {
      if (!elemento || !ctx) return;
      particulas = atualizarParticulas(particulas, (agora - anterior) / 1000);
      anterior = agora;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, elemento.width, elemento.height);
      ctx.setTransform(resolucao, 0, 0, resolucao, 0, 0);
      desenhar(ctx, particulas, branco, cache);
      quadro = particulas.length > 0 ? requestAnimationFrame(passo) : null;
    }

    function aoApertar(evento: PointerEvent) {
      if (!elemento || (evento.pointerType === 'touch' && !evento.isPrimary)) return;
      const caixa = elemento.getBoundingClientRect();
      const { escala: e } = refs.current;
      if (!(e > 0)) return;
      const x = (evento.clientX - caixa.left) / e;
      const y = (evento.clientY - caixa.top) / e;
      if (x < 0 || y < 0 || x > LARGURA_PALCO || y > ALTURA_PALCO) return;
      const alvo = evento.target instanceof Element ? evento.target : null;
      const clicavel = !!alvo?.closest(CLICAVEL);

      if (clicavel) {
        sequencia = null;
        if (!refs.current.reduzido) particulas.push(...emitirFaiscas(x, y, Math.random));
      } else {
        sequencia = proximaSequencia(sequencia, x, y, performance.now());
        const forca = forcaDaSequencia(sequencia.contagem);
        refs.current.som?.batida(forca);
        if (!refs.current.reduzido) particulas.push(...emitirPoeira(x, y, forca, Math.random));
        if (sequencia.contagem >= SEQUENCIA_QUE_TREME) refs.current.tremer(0.12 + (sequencia.contagem - SEQUENCIA_QUE_TREME) * 0.08);
      }
      if (particulas.length > 0 && quadro === null) {
        ajustarResolucao();
        anterior = performance.now();
        quadro = requestAnimationFrame(passo);
      }
    }

    window.addEventListener('pointerdown', aoApertar, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', aoApertar, true);
      if (quadro !== null) cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className="pointer-events-none absolute left-0 top-0 z-[65]"
      style={{ width: LARGURA_PALCO, height: ALTURA_PALCO }}
      aria-hidden
    />
  );
}
