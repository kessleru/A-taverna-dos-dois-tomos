import { describe, expect, it } from 'vitest';
import {
  estadoInicial,
  escolher,
  rolarDado,
  proximoPasso,
  resolverEvento,
  pontuacao,
  forcarFaixa,
  bonusDoContexto,
  faixaDoDado,
  ajustarEfeito,
  type EstadoRodada,
  type Faixa,
} from './motor';
import { calcularPerfil, combinarDesbloqueado, type Escolha } from '../data/rodada';

// Joga a rodada inteira forçando a faixa de cada dado (padrão: sucesso, que
// aplica o efeito da carta sem mudança).
function jogarRodada(escolhas: Escolha[], faixa: Faixa = 'sucesso'): EstadoRodada {
  let estado = estadoInicial();
  for (const escolha of escolhas) {
    estado = proximoPasso(estado); // situacao -> votacao
    estado = escolher(estado, escolha); // votacao -> dado
    estado = rolarDado(forcarFaixa(estado, faixa)); // dado -> consequencia
    estado = proximoPasso(estado); // consequencia -> cronica | bricolagem (fundação)
    if (estado.passo === 'bricolagem') estado = proximoPasso(estado); // bricolagem -> cronica
    estado = proximoPasso(estado); // cronica -> evento | avança etapa
    if (estado.passo === 'evento') estado = proximoPasso(estado); // resolve -> avança
    if (estado.passo === 'forja') estado = proximoPasso(estado); // forja -> situacao
  }
  return estado;
}

describe('rodada completa com dado em sucesso', () => {
  it('adaptar, adaptar, planejar, combinar => lendário e rank máximo', () => {
    const escolhas: Escolha[] = ['adaptar', 'adaptar', 'planejar', 'combinar'];
    const estado = jogarRodada(escolhas);
    expect(estado.terminou).toBe(true);
    expect(estado.ind).toEqual({ caixa: 100, clientes: 100, moral: 100 });
    expect(pontuacao(estado.ind).estrelas).toBe(3);
    expect(calcularPerfil(escolhas)).toBe('lendario');
  });

  it('adaptar x4 => improvisador; Combinar continua trancado', () => {
    const escolhas: Escolha[] = ['adaptar', 'adaptar', 'adaptar', 'adaptar'];
    const estado = jogarRodada(escolhas);
    expect(estado.terminou).toBe(true);
    expect(calcularPerfil(escolhas)).toBe('improvisador');
    expect(combinarDesbloqueado(escolhas.slice(0, 3))).toBe(false);
  });

  it('planejar x4 => planejador, rank mínimo e nenhum indicador abaixo de 5', () => {
    const escolhas: Escolha[] = ['planejar', 'planejar', 'planejar', 'planejar'];
    const estado = jogarRodada(escolhas);
    expect(calcularPerfil(escolhas)).toBe('planejador');
    expect(pontuacao(estado.ind).estrelas).toBe(1);
    for (const valor of Object.values(estado.ind)) expect(valor).toBeGreaterThanOrEqual(5);
  });

  it('planejar, planejar, adaptar, adaptar => invertido', () => {
    expect(calcularPerfil(['planejar', 'planejar', 'adaptar', 'adaptar'])).toBe('invertido');
  });
});

describe('escolha e dado', () => {
  it('escolher leva ao dado sem aplicar o efeito ainda', () => {
    const estado = escolher(proximoPasso(estadoInicial()), 'adaptar');
    expect(estado.passo).toBe('dado');
    expect(estado.ind).toEqual(estadoInicial().ind);
  });

  it('escolher combinar sem desbloqueio lança erro', () => {
    expect(() => escolher(proximoPasso(estadoInicial()), 'combinar')).toThrowError();
  });

  it('bônus do contexto soma as setas da Leitura do Mapa (etapa 1: Adaptar +4, Planejar −2)', () => {
    expect(bonusDoContexto(0, 'adaptar')).toBe(4);
    expect(bonusDoContexto(0, 'planejar')).toBe(-2);
  });

  it('Combinar ganha +2 de experiência além das setas', () => {
    expect(bonusDoContexto(3, 'combinar')).toBe(3 + 2);
  });

  it('faixa: 20 natural é crítico; total ≥ 19 crítico; ≥ 11 sucesso; abaixo, falha', () => {
    expect(faixaDoDado(20, 18)).toBe('critico');
    expect(faixaDoDado(15, 19)).toBe('critico');
    expect(faixaDoDado(9, 11)).toBe('sucesso');
    expect(faixaDoDado(8, 10)).toBe('falha');
  });

  it('crítico multiplica ganhos por 1,5; falha divide ganhos por 2; perdas não mudam', () => {
    const efeito = { caixa: -5, clientes: 10, moral: 5 };
    expect(ajustarEfeito(efeito, 'critico')).toEqual({ caixa: -5, clientes: 15, moral: 8 });
    expect(ajustarEfeito(efeito, 'sucesso')).toEqual(efeito);
    expect(ajustarEfeito(efeito, 'falha')).toEqual({ caixa: -5, clientes: 5, moral: 3 });
  });

  it('rolarDado aplica o efeito ajustado e guarda o resultado', () => {
    const estado = escolher(proximoPasso(estadoInicial()), 'adaptar'); // caixa −5, clientes +5, moral +20
    const depois = rolarDado(estado, () => 0.5); // d20 = 11, +4 => 15, sucesso
    expect(depois.ultimoDado).toEqual({ d20: 11, bonus: 4, total: 15, faixa: 'sucesso' });
    expect(depois.ind).toEqual({ caixa: 45, clientes: 55, moral: 70 });
    expect(depois.passo).toBe('consequencia');
  });

  it('forcarFaixa vale só para o próximo dado', () => {
    const estado = forcarFaixa(escolher(proximoPasso(estadoInicial()), 'adaptar'), 'falha');
    const depois = rolarDado(estado, () => 0.99);
    expect(depois.ultimoDado?.faixa).toBe('falha');
    expect(depois.faixaForcada).toBeUndefined();
  });
});

describe('Canvas da turma', () => {
  it('acumula os blocos tocados por cada carta, na lógica da carta', () => {
    const estado = jogarRodada(['adaptar', 'planejar']);
    // O Adaptar da fundação vira Bricolagem na tapeçaria.
    expect(estado.canvas.parcerias).toEqual(['bricolagem']);
    expect(estado.canvas.custos).toEqual(['planejar']);
    expect(estado.canvas.atividades).toEqual(['planejar']);
  });
});

describe('eventos', () => {
  it('a incubadora depende dos indicadores do momento', () => {
    const base: EstadoRodada = {
      ...estadoInicial(),
      etapa: 2,
      passo: 'evento',
      ind: { caixa: 60, clientes: 50, moral: 70 },
      escolhas: ['adaptar', 'adaptar'],
    };
    expect(resolverEvento(base).ultimoEvento?.titulo).toBe('Portas abertas');
    expect(resolverEvento({ ...base, ind: { caixa: 10, clientes: 50, moral: 70 } }).ultimoEvento?.titulo).toBe('Não foi dessa vez');
  });

  it('o evento 2 é o do fabricante e depende da rede de contatos da etapa 1', () => {
    const base: EstadoRodada = { ...estadoInicial(), etapa: 1, passo: 'evento', escolhas: ['adaptar', 'planejar'] };
    expect(resolverEvento(base).ultimoEvento?.titulo).toBe('Perda Aceitável!');
    expect(resolverEvento({ ...base, escolhas: ['planejar', 'adaptar'] }).ultimoEvento?.titulo).toBe('Máquinas caras demais');
  });
});

describe('Bricolagem na fundação', () => {
  function ateConsequencia(escolha: Escolha): EstadoRodada {
    return rolarDado(forcarFaixa(escolher(proximoPasso(estadoInicial()), escolha), 'sucesso'));
  }

  it('Adaptar revela a Bricolagem: devolve o caixa e repinta os blocos da jogada', () => {
    const antes = ateConsequencia('adaptar');
    const estado = proximoPasso(antes);
    expect(estado.passo).toBe('bricolagem');
    expect(estado.bricolagem).toBe(true);
    expect(estado.ind.caixa).toBe(antes.ind.caixa + 5);
    expect(estado.canvas.parcerias).toEqual(['bricolagem']);
    expect(estado.canvas.recursos).toEqual(['bricolagem']);
    expect(estado.canvas.proposta).toEqual(['bricolagem']);
    expect(proximoPasso(estado).passo).toBe('cronica');
  });

  it('Planejar mostra a carta perdida, sem bônus nem mudança na tapeçaria', () => {
    const antes = ateConsequencia('planejar');
    const estado = proximoPasso(antes);
    expect(estado.passo).toBe('bricolagem');
    expect(estado.bricolagem).toBe(false);
    expect(estado.ind).toEqual(antes.ind);
    expect(estado.canvas).toEqual(antes.canvas);
  });

  it('só acontece na fundação', () => {
    let estado = jogarRodada(['adaptar']);
    estado = rolarDado(forcarFaixa(escolher(proximoPasso(estado), 'adaptar'), 'sucesso'));
    expect(proximoPasso(estado).passo).toBe('cronica');
  });

  it('descobrir a Bricolagem não muda o perfil nem o desbloqueio da Combinar', () => {
    const estado = jogarRodada(['adaptar', 'adaptar', 'planejar', 'combinar']);
    expect(estado.bricolagem).toBe(true);
    expect(estado.escolhas[0]).toBe('adaptar');
    expect(combinarDesbloqueado(estado.escolhas.slice(0, 3))).toBe(true);
  });
});
