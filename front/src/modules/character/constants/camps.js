/**
 * Códigos de campos de personaje
 * @constant
 */
export const CAMP_CODES = {
  ARTE: 'art',
  MOVIMIENTO: 'mov',
  CULTURA: 'cul',
  SUPERVIVENCIA: 'sup',
  SOBRENATURAL: 'sob',
  VIGOR: 'vig',
};

/**
 * Mapeo de nombres completos a códigos
 * @constant
 */
export const CAMP_NAME_TO_CODE = {
  arte: 'art',
  movimiento: 'mov',
  cultura: 'cul',
  supervivencia: 'sup',
  sobrenatural: 'sob',
  vigor: 'vig',
};

/**
 * Lista de todos los campos válidos
 * @constant
 */
export const ALL_CAMPS = Object.values(CAMP_CODES);