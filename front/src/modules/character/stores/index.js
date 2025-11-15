import { defineStore } from 'pinia';
import { useCharacterState } from './characterState';
import { useCharacterActions } from './characterActions';

/**
 * Store principal del personaje
 * Versión modular y refactorizada
 */
export const useCharacterStore = defineStore('character-v2', () => {
  // Inicializar estado
  const state = useCharacterState();
  
  // Inicializar acciones
  const actions = useCharacterActions(state);

  // Exponer todo
  return {
    // State
    ...state,
    
    // Actions
    ...actions,
  };
});

// Export para compatibilidad con código legacy
export { useCharacterState, useCharacterActions };