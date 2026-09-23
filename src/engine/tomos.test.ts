import { describe, expect, it } from 'vitest';
import { proximoEstadoTomo } from './tomos';

describe('proximoEstadoTomo', () => {
  it('carta fechada abre (vira) no primeiro clique', () => {
    expect(proximoEstadoTomo('fechado')).toBe('aberto');
  });

  it('carta aberta mostra estratégia e solução no segundo clique', () => {
    expect(proximoEstadoTomo('aberto')).toBe('detalhes');
  });

  it('com os detalhes à mostra, o clique volta para a fala do narrador', () => {
    expect(proximoEstadoTomo('detalhes')).toBe('aberto');
  });
});
