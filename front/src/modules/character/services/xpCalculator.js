import { XP_COSTS } from '../constants/xp';

/**
 * Servicio para cálculos de experiencia
 * Todas las funciones son puras (sin efectos secundarios)
 */
export class XPCalculator {
  /**
   * Calcula el coste de una mejora
   * @param {string} type - Tipo de mejora ('camp', 'skill', 'speciality', 'other')
   * @param {number} amount - Cantidad a mejorar (puede ser negativo para deshacer)
   * @returns {number} Coste total (positivo = gasto, negativo = recuperación)
   */
  static calculateCost(type, amount) {
    const costs = {
      camp: XP_COSTS.CAMP,
      skill: XP_COSTS.SKILL,
      speciality: XP_COSTS.SPECIALITY,
      other: 1, // Para costes directos (competencias, feats, etc)
    };

    const unitCost = costs[type] || 0;
    return unitCost * amount;
  }

  /**
   * Valida si una transacción de XP es posible
   * @param {number} currentFreeXP - XP libre actual
   * @param {number} cost - Coste de la transacción (positivo = gasto)
   * @returns {Object} { valid: boolean, reason?: string }
   */
  static validateTransaction(currentFreeXP, cost) {
    // Si es recuperación de XP (cost negativo), siempre es válido
    if (cost <= 0) {
      return { valid: true };
    }

    // Si es gasto, verificar que hay suficiente XP
    if (currentFreeXP < cost) {
      return {
        valid: false,
        reason: `XP insuficiente. Necesitas ${cost}, tienes ${currentFreeXP}`,
      };
    }

    return { valid: true };
  }

  /**
   * Aplica una transacción de XP
   * @param {Object} metadata - Objeto con freeXP y usedXP
   * @param {number} cost - Coste a aplicar
   * @returns {Object} Nuevo estado de metadata
   */
  static applyTransaction(metadata, cost) {
    // Validar que no se genere XP negativa
    const newFreeXP = metadata.freeXP - cost;
    const newUsedXP = metadata.usedXP + cost;

    if (newFreeXP < 0) {
      throw new Error('No se puede tener XP negativa');
    }

    return {
      ...metadata,
      freeXP: newFreeXP,
      usedXP: newUsedXP,
    };
  }

  /**
   * Calcula el coste total de múltiples transacciones
   * @param {Array<{type: string, amount: number}>} transactions
   * @returns {number} Coste total
   */
  static calculateBatchCost(transactions) {
    return transactions.reduce((total, { type, amount }) => {
      return total + this.calculateCost(type, amount);
    }, 0);
  }
}