import { AGE_MODIFIERS } from '../constants/xp';

/**
 * Servicio para cálculo de modificadores de edad
 */
export class AgeCalculator {
  /**
   * Obtiene los modificadores de edad para una etapa específica
   * @param {string} ageState - Etapa de edad ('JOVEN', 'ADULTO', 'ANCIANO')
   * @returns {Object.<string, number>} Modificadores por campo
   */
  static getModifiers(ageState) {
    const normalizedAge = ageState?.toUpperCase();
    return AGE_MODIFIERS[normalizedAge] || {};
  }

  /**
   * Aplica modificadores de edad a los campos de un personaje
   * @param {Object.<string, Object>} camps - Campos del personaje
   * @param {string} ageState - Etapa de edad
   * @returns {Object.<string, Object>} Campos con modificadores aplicados
   */
  static applyModifiers(camps, ageState) {
    // Primero, limpiar todos los modificadores de edad
    const clearedCamps = this.clearModifiers(camps);

    // Obtener los modificadores de la nueva etapa
    const modifiers = this.getModifiers(ageState);

    // Aplicar los nuevos modificadores
    Object.entries(modifiers).forEach(([campCode, modifier]) => {
      if (clearedCamps[campCode]) {
        clearedCamps[campCode] = {
          ...clearedCamps[campCode],
          age: modifier,
        };
      }
    });

    return clearedCamps;
  }

  /**
   * Limpia todos los modificadores de edad de los campos
   * @param {Object.<string, Object>} camps - Campos del personaje
   * @returns {Object.<string, Object>} Campos sin modificadores de edad
   */
  static clearModifiers(camps) {
    const result = {};
    Object.entries(camps).forEach(([key, camp]) => {
      result[key] = {
        ...camp,
        age: 0,
      };
    });
    return result;
  }

  /**
   * Valida si una etapa de edad es válida
   * @param {string} ageState - Etapa a validar
   * @returns {boolean}
   */
  static isValidAgeState(ageState) {
    const normalized = ageState?.toUpperCase();
    return Object.keys(AGE_MODIFIERS).includes(normalized);
  }
}