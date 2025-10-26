<script setup>
import { characterFunctions } from "@/store/characterSheet";
import { ref } from "vue";

// Estado del dropdown (desplegado o plegado)
const isOpen = ref(true);

// Opciones disponibles
const characterTypes = [
  { label: "Héroe", xp: 1000 },
  { label: "Avanzado", xp: 600 },
  { label: "Normal", xp: 200 },
];

// Función para seleccionar el tipo de ficha
const selectCharacterType = (type) => {
  characterFunctions().selectCharacterType(type);
  isOpen.value = false; // Plegar el dropdown después de seleccionar
};
</script>

<template>
  <div class="xp-card">
    <div class="dropdown-container">
      <button class="dropdown-header" @click="isOpen = !isOpen">
        {{ isOpen ? "Seleccionar Tipo de Ficha" : "Ficha Seleccionada" }}
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
        <span class="xp-label">Experiencia restante:</span>
        <span class="xp-value">{{ characterFunctions().metaData.freeXP }}</span>
      </p>
      <p>
        <span class="xp-label">Experiencia Consumida:</span>
        <span class="xp-value">
          {{ characterFunctions().metaData.usedXP }}
        </span>
      </p>
    </div>

    <div class="xp-cost">
      <h3 class="cost-title">Coste de Mejoras</h3>
      <p><span class="cost-label">Atributo:</span> 100 XP</p>
      <p><span class="cost-label">Habilidad:</span> 30 XP</p>
      <p><span class="cost-label">Especialidad:</span> 15 XP</p>
      <p><span class="cost-label">Competencia:</span> Especial</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
.dropdown-container {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
  background: rgba(10, 10, 20, 0.9); /* Fondo oscuro translúcido */
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Botón del dropdown */
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

/* Flecha de apertura/cierre */
.dropdown-header span {
  transition: transform 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

/* Lista de opciones */
.dropdown-menu {
  list-style: none;
  padding: 0;
  margin-top: 5px;
  background: #1a1a2e;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Estilo de cada opción */
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
  background: rgba(10, 10, 20, 0.9); /* Fondo oscuro translúcido */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  margin: 0 auto;
  color: #f5f5f5; /* Texto claro */
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
  color: #4da6ff; /* Azul vibrante */
}

.cost-title {
  font-size: 1.4em;
  font-weight: bold;
  margin-top: 15px;
  color: #ffcc00; /* Amarillo dorado */
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

/* Animación al pasar el cursor sobre los valores de XP */
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

/* Pequeña animación al pasar el cursor sobre los costes */
.xp-cost p:hover {
  color: #ffcc00;
  transition: color 0.2s ease, transform 0.2s ease;
}
</style>
