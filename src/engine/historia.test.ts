import { describe, expect, it } from 'vitest';
import { ateAqui } from './historia';
import { etapas, eventos } from '../data/rodada';
import { regras } from '../data/rodada';

describe('fio da história', () => {
  it('o primeiro capítulo não tem "até aqui"', () => {
    expect(ateAqui(0, [], false)).toBeNull();
  });

  it('lembra a escolha e o destino da etapa anterior', () => {
    expect(ateAqui(2, ['adaptar', 'planejar'], false, 'Máquinas caras demais')).toEqual({ fase: 'Primeiros anos', logica: 'planejar', destino: 'Máquinas caras demais' });
  });

  it('quem descobriu a Bricolagem na fundação a vê lembrada no capítulo II', () => {
    expect(ateAqui(1, ['adaptar'], true)?.logica).toBe('bricolagem');
  });

  it('todo capítulo tem número, período e uma abertura que não repete o desafio', () => {
    for (const etapa of etapas) {
      expect(etapa.capitulo.abertura.length).toBeGreaterThan(20);
      expect(etapa.situacao).not.toContain(etapa.capitulo.abertura);
    }
  });

  it('todo destino explica a causa, e a causa bate com o desfecho', () => {
    const ind = { ...regras.inicial };
    for (const evento of eventos) {
      for (const escolhas of [['adaptar', 'adaptar', 'planejar'], ['planejar', 'planejar', 'adaptar']] as const) {
        const causa = evento.causa([...escolhas], ind);
        expect(causa.length).toBeGreaterThan(10);
        const desfecho = evento.condicao([...escolhas], ind) ? evento.seSim : evento.seNao;
        // A causa não repete o texto do desfecho: explica, não duplica.
        expect(desfecho.texto).not.toContain(causa);
      }
    }
  });
});

describe('passagem do tempo', () => {
  it('folheia os anos de um capítulo ao outro', async () => {
    const { anosEntre } = await import('./historia');
    expect(anosEntre(2017, 2019)).toEqual([2017, 2018, 2019]);
    expect(anosEntre(2019, 2020)).toEqual([2019, 2020]);
    expect(anosEntre(2020, 2020)).toEqual([2020]);
  });

  it('os capítulos andam para a frente no tempo, e só o primeiro não tem passagem', () => {
    etapas.forEach((etapa, i) => {
      if (i === 0) expect(etapa.capitulo.passagem).toBeUndefined();
      else {
        expect(etapa.capitulo.ano).toBeGreaterThan(etapas[i - 1].capitulo.ano);
        expect(etapa.capitulo.passagem).toBeTruthy();
        // A passagem não repete a abertura do capítulo.
        expect(etapa.capitulo.abertura).not.toContain(etapa.capitulo.passagem!);
      }
    });
  });
});
