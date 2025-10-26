<script setup>
import { characterFunctions } from "@/store/characterSheet";
import { ref, computed } from "vue";

// Estado del dropdown (desplegado o plegado)
const isOpen = ref(false);

// Opciones de tipo de ficha
const characterTypes = [
  { label: "Héroe", freeXP: 1000, competencesXP: 200, featXP: 100 },
  { label: "Avanzado", freeXP: 600, competencesXP: 100, featXP: 0 },
  { label: "Normal", freeXP: 200, competencesXP: 0, featXP: 0 },
];

// Función para actualizar los valores en la store
const selectCharacterType = (type) => {
  characterFunctions().selectCharacterType(type);
  isOpen.value = false; // Plegar el dropdown después de seleccionar
};

// Computed para mostrar datos actualizados
const xpCompetence = computed(
  () => characterFunctions().metaData.competencesXP
);
const featCompetence = computed(() => characterFunctions().metaData.featXP);
const magicXP = computed(() => characterFunctions().metaData.magicXP);
const martialXP = computed(() => characterFunctions().metaData.martialXP);
</script>

<template>
  <div class="xp-card">
    <div
      class="dropdown-container"
      v-if="!characterFunctions().metaData.characterType.label"
    >
      <button class="dropdown-header" @click="isOpen = !isOpen">
        {{ isOpen ? "Seleccionar Tipo de Ficha" : "Ficha Seleccionada" }}
        <span
          :class="{
            rotate: isOpen || characterFunctions().metaData.characterType,
          }"
          >▼</span
        >
      </button>

      <ul v-show="isOpen" class="dropdown-menu">
        <li
          v-for="type in characterTypes"
          :key="type.label"
          @click="selectCharacterType(type)"
          class="dropdown-item"
        >
          {{ type.label }} ({{ type.freeXP }} XP)
        </li>
      </ul>
    </div>

    <h2 class="xp-title">Experiencia</h2>

    <div class="xp-info">
      <p>
        <span class="xp-label">Experiencia Competencia:</span>
        <span class="xp-value">{{ xpCompetence }}</span>
      </p>
      <p>
        <span class="xp-label">Experiencia Feat:</span>
        <span class="xp-value">{{ featCompetence }}</span>
      </p>
    </div>

    <div class="xp-section" v-if="magicXP">
      <h3 class="cost-title">Experiencia Mágica</h3>
      <p v-for="(magic, index) in magicXP" :key="index">
        <span class="cost-label">{{ magic.name }}:</span>
        {{ magic.total }} XP
      </p>
    </div>

    <div class="xp-section" v-if="martialXP">
      <h3 class="cost-title">Experiencia Marcial</h3>
      <p>
        <span v-if="martialXP.total != '0'" class="cost-label"
          >{{ martialXP.name }}:</span
        >
        {{ martialXP.total }} XP
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
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

/* Dropdown */
.dropdown-container {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
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
  transition: background 0.3s ease;
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
  transition: background 0.3s ease, transform 0.2s ease;
}

.dropdown-item:hover {
  background: #4da6ff;
  transform: scale(1.05);
  border-radius: 8px;
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

/* Información de XP */
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

/* Sección de experiencia mágica y marcial */
.xp-section {
  margin-top: 15px;
}

.xp-section p {
  display: flex;
  justify-content: space-between;
  font-size: 1.1em;
  padding: 5px 0;
}

.cost-label {
  font-weight: bold;
  color: #f5f5f5;
}
</style>
