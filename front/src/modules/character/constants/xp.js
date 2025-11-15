/**
 * Costes de experiencia para mejoras de personaje
 * @constant
 */
export const XP_COSTS = {
  CAMP: 100,
  SKILL: 30,
  SPECIALITY: 10,
};

/**
 * Tipos de personaje con sus valores iniciales
 * @constant
 */
export const CHARACTER_TYPES = {
  HERO: {
    label: "Héroe",
    baseXP: 1000,
    competencesXP: 200,
    featXP: 100,
  },
  ADVANCED: {
    label: "Avanzado",
    baseXP: 600,
    competencesXP: 100,
    featXP: 0,
  },
  NORMAL: {
    label: "Normal",
    baseXP: 200,
    competencesXP: 0,
    featXP: 0,
  },
};

/**
 * Multiplicador para calcular el cap de skills basado en camp total
 * @constant
 */
export const SKILL_CAP_MULTIPLIER = 5;

/**
 * Modificadores de edad por etapa
 * @constant
 */
export const AGE_MODIFIERS = {
  JOVEN: {
    mov: 1,
    sup: 1,
  },
  ADULTO: {
    mov: 1,
    vig: 1,
  },
  ANCIANO: {
    cul: 1,
    sup: 1,
  },
};
