/**
 * @typedef {Object} Camp
 * @property {string} name - Nombre del campo
 * @property {string} code - Código del campo (art, mov, etc)
 * @property {number} base - Puntos base asignados
 * @property {number} specie - Bonificador de especie
 * @property {number} age - Bonificador de edad
 * @property {number} mod - Modificadores varios
 * @property {number} total - Total calculado
 * @property {number} cap - Máximo permitido
 * @property {Object.<string, Skill>} skills - Habilidades del campo
 */

/**
 * @typedef {Object} Skill
 * @property {string} name - Nombre de la habilidad
 * @property {number} base - Puntos base
 * @property {number} mod - Modificadores
 * @property {number} atrib - Bonificador del campo
 * @property {number} total - Total calculado
 * @property {number} cap - Máximo permitido
 * @property {Object.<string, Speciality>} specialities - Especialidades
 */

/**
 * @typedef {Object} Speciality
 * @property {string} name - Nombre de la especialidad
 * @property {number} base - Puntos base
 * @property {number} atrib - Bonificador de habilidad
 * @property {number} mod - Modificadores
 * @property {number} final - Total calculado
 */

/**
 * @typedef {Object} Character
 * @property {string} name - Nombre del personaje
 * @property {number} age - Edad numérica
 * @property {string} ageState - Etapa (Joven, Adulto, Anciano)
 * @property {string} sex - Sexo del personaje
 * @property {string} specie - Especie del personaje
 * @property {Object.<string, Camp>} camp - Campos del personaje
 * @property {Object} regen - Regeneración de recursos
 * @property {Object} lang - Idiomas conocidos
 */

/**
 * @typedef {Object} MetaData
 * @property {number} freeXP - Experiencia libre disponible
 * @property {number} usedXP - Experiencia ya gastada
 * @property {number} featXP - Experiencia para méritos
 * @property {number} competencesXP - Experiencia para competencias
 * @property {Object} characterType - Tipo de personaje seleccionado
 */

export {}; // Hace que este archivo sea un módulo