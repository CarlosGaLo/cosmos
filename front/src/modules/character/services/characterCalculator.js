import { CapCalculator } from './capCalculator';
import { AgeCalculator } from './ageCalculator';

/**
 * Servicio principal para cálculos de personaje
 * Orquesta los diferentes calculadores especializados
 */
export class CharacterCalculator {
  /**
   * Calcula el total de un campo
   * @param {Object} camp - Campo a calcular
   * @returns {number} Total calculado
   */
  static calculateCampTotal(camp) {
    const base = Number(camp.base) || 0;
    const specie = Number(camp.specie) || 0;
    const age = Number(camp.age) || 0;
    const mod = Number(camp.mod) || 0;

    return base + specie + age + mod;
  }

  /**
   * Calcula el total de una habilidad
   * @param {Object} skill - Habilidad a calcular
   * @returns {number} Total calculado
   */
  static calculateSkillTotal(skill) {
    const base = Number(skill.base) || 0;
    const atrib = Number(skill.atrib) || 0;
    const mod = Number(skill.mod) || 0;

    return base + atrib + mod;
  }

  /**
   * Calcula el total de una especialidad
   * @param {Object} speciality - Especialidad a calcular
   * @returns {number} Total calculado
   */
  static calculateSpecialityTotal(speciality) {
    const base = Number(speciality.base) || 0;
    const atrib = Number(speciality.atrib) || 0;
    const mod = Number(speciality.mod) || 0;

    return base + atrib + mod;
  }

  /**
   * Recalcula todos los valores derivados de un campo
   * @param {Object} camp - Campo a recalcular
   * @returns {Object} Campo actualizado con todos los valores recalculados
   */
  static recalculateCamp(camp) {
    // 1. Calcular total del campo
    const campTotal = this.calculateCampTotal(camp);
    
    // 2. Calcular cap de las skills

    // 3. Recalcular cada skill
    const updatedSkills = {};
    Object.entries(camp.skills || {}).forEach(([skillName, skill]) => {
      // Atributo de skill = 2 x total del campo
      
    const skillCap = CapCalculator.calculateSkillCap(campTotal, skill);
      const atrib = campTotal * 2;
      
      // Calcular total de la skill
      const skillTotal = this.calculateSkillTotal({ ...skill, atrib });

      // Recalcular especialidades de esta skill
      const updatedSpecialities = {};
      Object.entries(skill.specialities || {}).forEach(([specName, spec]) => {
        const specCap = CapCalculator.calculateSpecialityCap(skillTotal);
        
        // Ajustar base si excede el cap
        const adjustedBase = Math.min(spec.base, specCap);
        
        const specTotal = this.calculateSpecialityTotal({
          ...spec,
          base: adjustedBase,
          atrib: skillTotal,
        });

        updatedSpecialities[specName] = {
          ...spec,
          base: adjustedBase,
          atrib: skillTotal,
          final: specTotal,
          cap: specCap,
        };
      });

      updatedSkills[skillName] = {
        ...skill,
        atrib,
        total: skillTotal,
        cap: skillCap,
        specialities: updatedSpecialities,
      };
    });

    return {
      ...camp,
      total: campTotal,
      skills: updatedSkills,
    };
  }

  /**
   * Recalcula todos los campos de un personaje
   * @param {Object.<string, Object>} camps - Todos los campos
   * @param {string} ageState - Etapa de edad
   * @returns {Object.<string, Object>} Campos recalculados
   */
  static recalculateAllCamps(camps, ageState) {
    // 1. Aplicar modificadores de edad
    const campsWithAge = AgeCalculator.applyModifiers(camps, ageState);

    // 2. Recalcular cada campo
    const result = {};
    Object.entries(campsWithAge).forEach(([campCode, camp]) => {
      result[campCode] = this.recalculateCamp(camp);
    });

    return result;
  }

  /**
   * Valida que el base de un campo no exceda su límite
   * @param {Object} camp - Campo a validar
   * @returns {number} Base ajustado si es necesario
   */
  static validateCampBase(camp) {
    const maxBase = camp.cap - camp.specie - camp.age;
    return Math.min(camp.base, Math.max(0, maxBase));
  }
}