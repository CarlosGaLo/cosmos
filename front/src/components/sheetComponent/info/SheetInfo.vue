<script setup>
import { characterFunctions } from "@/store/characterSheet";
import { ref, computed } from "vue";

const allowNegativeXP = ref(false);
const characterStore = characterFunctions();

// Estado del dropdown
const isOpen = ref(false);

// Opciones disponibles
const characterTypes = [
  { label: "Héroe", xp: 1000, competencesXP: 200, featXP: 100 },
  { label: "Avanzado", xp: 600, competencesXP: 100, featXP: 0 },
  { label: "Normal", xp: 200, competencesXP: 0, featXP: 0 },
];

// Input manual de XP
const manualXP = ref(
  characterStore.metaData.freeXP + characterStore.metaData.usedXP || 0
);

// Computed para saber si ya hay un tipo seleccionado
const hasSelectedType = computed(
  () => characterStore.metaData.characterType?.label
);

// Función para seleccionar el tipo de ficha
const selectCharacterType = (type) => {
  characterStore.selectCharacterType(type);
  manualXP.value = type.xp;
  isOpen.value = false;
};

// Función para establecer XP manualmente
const setManualXP = () => {
  const xpValue = parseInt(manualXP.value) || 0;

  // Crear un tipo personalizado
  const customType = {
    label: "Personalizado",
    xp: xpValue,
    competencesXP: 0,
    featXP: 0,
  };

  characterStore.metaData.characterType = customType;
  characterStore.metaData.freeXP = xpValue - characterStore.metaData.usedXP;
  characterStore.fullfillSheet();
};
</script>

<template>
  <div class="xp-card">
    <!-- XP Manual Input -->
    <div class="manual-xp-section">
      <h3 class="section-title">Establecer XP Total</h3>
      <div class="input-group">
        <input
          type="number"
          v-model.number="manualXP"
          class="xp-input"
          placeholder="Ingresa XP total"
          min="0"
        />
        <button @click="setManualXP" class="apply-button">Aplicar</button>
      </div>
    </div>

    <div class="divider">O</div>

    <!-- Dropdown de tipos predefinidos -->
    <div class="dropdown-container">
      <button class="dropdown-header" @click="isOpen = !isOpen">
        {{
          hasSelectedType
            ? `Tipo: ${characterStore.metaData.characterType.label}`
            : "Seleccionar Tipo de Ficha"
        }}
        <span :class="{ rotate: isOpen }">▼</span>
      </button>

      <ul v-show="isOpen" class="dropdown-menu">
        <li
          v-for="type in characterTypes"
          :key="type.label"
          @click="selectCharacterType(type)"
          class="dropdown-item"
        >
          {{ type.label }} ({{ type.xp }} XP)
        </li>
      </ul>
    </div>

    <h2 class="xp-title">Experiencia</h2>

    <div class="xp-info">
      <p>
        <span class="xp-label">Experiencia Total:</span>
        <span class="xp-value">{{
          characterStore.metaData.freeXP + characterStore.metaData.usedXP
        }}</span>
      </p>
      <p>
        <span class="xp-label">Experiencia Restante:</span>
        <span class="xp-value">{{ characterStore.metaData.freeXP }}</span>
      </p>
      <p>
        <span class="xp-label">Experiencia Consumida:</span>
        <span class="xp-value">
          {{ characterStore.metaData.usedXP }}
        </span>
      </p>
    </div>

    <div class="xp-cost">
      <h3 class="cost-title">Coste de Mejoras</h3>
      <p><span class="cost-label">Campo:</span> 100 XP</p>
      <p><span class="cost-label">Habilidad:</span> 30 XP</p>
      <p><span class="cost-label">Especialidad:</span> 15 XP</p>
      <p><span class="cost-label">Competencia:</span> Especial</p>
    </div>
  </div>
</template>

<style scoped>
/* Sección de XP Manual */
.manual-xp-section {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(30, 30, 50, 0.5);
  border-radius: 8px;
}

.section-title {
  font-size: 1.2em;
  color: #4da6ff;
  margin-bottom: 10px;
  text-align: center;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.xp-input {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #4da6ff;
  border-radius: 6px;
  color: #f5f5f5;
  font-size: 1.1em;
  text-align: center;
}

.xp-input:focus {
  outline: none;
  border-color: #66c2ff;
  background: rgba(255, 255, 255, 0.15);
}

.apply-button {
  padding: 10px 20px;
  background: #4da6ff;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.apply-button:hover {
  background: #66c2ff;
}

.divider {
  text-align: center;
  color: #4da6ff;
  font-size: 1.2em;
  font-weight: bold;
  margin: 15px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 2px;
  background: rgba(77, 166, 255, 0.3);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* Estilos del dropdown */
.dropdown-container {
  width: 100%;
  max-width: 350px;
  margin: 0 auto 20px;
  font-family: "Poppins", sans-serif;
  background: rgba(10, 10, 20, 0.9);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.dropdown-header {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.dropdown-header:hover {
  background: #0056b3;
}

.dropdown-header span {
  transition: transform 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  list-style: none;
  padding: 0;
  margin-top: 5px;
  background: #1a1a2e;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  padding: 10px;
  color: #ffffff;
  font-size: 1.1em;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.dropdown-item:hover {
  background: #4da6ff;
  transform: scale(1.05);
  border-radius: 8px;
}

/* Estilos generales del contenedor */
.xp-card {
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  margin: 0 auto;
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

/* Títulos */
.xp-title {
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #4da6ff;
}

.cost-title {
  font-size: 1.4em;
  font-weight: bold;
  margin-top: 15px;
  color: #ffcc00;
}

/* Sección de información de experiencia */
.xp-info p {
  display: flex;
  justify-content: space-between;
  font-size: 1.1em;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.xp-label {
  font-weight: bold;
  color: #f5f5f5;
}

.xp-value {
  font-weight: bold;
  color: #4da6ff;
  transition: color 0.3s ease-in-out, transform 0.2s ease;
}

.xp-value:hover {
  color: #66c2ff;
}

/* Experiencia negativa en rojo */
.negative {
  color: #ff6b6b;
}

/* Costes de mejora */
.xp-cost p {
  display: flex;
  justify-content: space-between;
  font-size: 1.1em;
  padding: 5px 0;
}

.cost-label {
  font-weight: bold;
  color: #f5f5f5;
}

.xp-cost p:hover {
  color: #ffcc00;
  transition: color 0.2s ease, transform 0.2s ease;
}

.free-xp-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
  margin-left: 10px;
  cursor: pointer;
}

.free-xp-checkbox input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.checkbox-label {
  color: #f5f5f5;
  font-weight: normal;
}
</style>
