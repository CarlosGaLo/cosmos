import { XPCalculator } from '../xpCalculator';

describe('XPCalculator', () => {
  describe('calculateCost', () => {
    it('calcula correctamente el coste de un campo', () => {
      expect(XPCalculator.calculateCost('camp', 1)).toBe(100);
      expect(XPCalculator.calculateCost('camp', 3)).toBe(300);
    });

    it('calcula correctamente el coste de una habilidad', () => {
      expect(XPCalculator.calculateCost('skill', 1)).toBe(30);
      expect(XPCalculator.calculateCost('skill', 5)).toBe(150);
    });

    it('calcula correctamente el coste de una especialidad', () => {
      expect(XPCalculator.calculateCost('speciality', 1)).toBe(10);
      expect(XPCalculator.calculateCost('speciality', 10)).toBe(100);
    });

    it('permite costes negativos para deshacer mejoras', () => {
      expect(XPCalculator.calculateCost('camp', -1)).toBe(-100);
      expect(XPCalculator.calculateCost('skill', -2)).toBe(-60);
    });
  });

  describe('validateTransaction', () => {
    it('permite transacciones con XP suficiente', () => {
      const result = XPCalculator.validateTransaction(200, 100);
      expect(result.valid).toBe(true);
    });

    it('rechaza transacciones con XP insuficiente', () => {
      const result = XPCalculator.validateTransaction(50, 100);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('insuficiente');
    });

    it('permite recuperación de XP (costes negativos)', () => {
      const result = XPCalculator.validateTransaction(50, -100);
      expect(result.valid).toBe(true);
    });
  });

  describe('applyTransaction', () => {
    it('aplica correctamente una transacción de gasto', () => {
      const metadata = { freeXP: 200, usedXP: 0 };
      const result = XPCalculator.applyTransaction(metadata, 100);
      
      expect(result.freeXP).toBe(100);
      expect(result.usedXP).toBe(100);
    });

    it('aplica correctamente una recuperación de XP', () => {
      const metadata = { freeXP: 100, usedXP: 100 };
      const result = XPCalculator.applyTransaction(metadata, -50);
      
      expect(result.freeXP).toBe(150);
      expect(result.usedXP).toBe(50);
    });

    it('lanza error si se intenta tener XP negativa', () => {
      const metadata = { freeXP: 50, usedXP: 0 };
      
      expect(() => {
        XPCalculator.applyTransaction(metadata, 100);
      }).toThrow('No se puede tener XP negativa');
    });
  });
});