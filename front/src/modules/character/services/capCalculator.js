import { SKILL_CAP_MULTIPLIER } from "../constants/xp";

/**
 * Servicio para cálculo de límites (caps)
 */
export class CapCalculator {
  /**
   * Calcula el cap de una habilidad basado en el total del campo
   * @param {number} campTotal - Total del campo padre
   * @returns {number} Cap de la habilidad
   */
  static calculateSkillCap(campTotal, skill) {
    return campTotal * SKILL_CAP_MULTIPLIER + skill.race;
  }

  /**
   * Calcula el cap de una especialidad basado en el total de la habilidad
   * @param {number} skillTotal - Total de la habilidad padre
   * @returns {number} Cap de la especialidad
   */
  static calculateSpecialityCap(skillTotal) {
    return skillTotal; // El cap es igual al total de la habilidad
  }

  /**
   * Valida si un valor base está dentro del cap permitido
   * @param {number} currentBase - Valor base actual
   * @param {number} increment - Incremento a aplicar
   * @param {number} cap - Límite máximo
   * @returns {Object} { valid: boolean, reason?: string, maxAllowed?: number }
   */
  static validateIncrement(currentBase, increment, cap) {
    const newBase = currentBase + increment;

    // Si es decremento, solo validar que no sea negativo
    if (increment < 0) {
      if (newBase < 0) {
        return {
          valid: false,
          reason: "El valor base no puede ser negativo",
          maxAllowed: 0,
        };
      }
      return { valid: true };
    }

    // Si es incremento, validar contra el cap
    if (newBase > cap) {
      return {
        valid: false,
        reason: `Excede el límite máximo de ${cap}`,
        maxAllowed: cap - currentBase,
      };
    }

    return { valid: true };
  }

  /**
   * Calcula cuánto puede incrementarse un valor sin exceder el cap
   * @param {number} currentBase - Valor base actual
   * @param {number} cap - Límite máximo
   * @returns {number} Incremento máximo permitido
   */
  static getMaxIncrement(currentBase, cap) {
    return Math.max(0, cap - currentBase);
  }
}
