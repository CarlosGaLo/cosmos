<script setup>
import { computed } from "vue";
import { characterFunctions } from "@/store/characterSheet";

// Datos del personaje
const martialXP = computed(() => characterFunctions().metaData.martialXP);
</script>

<template>
  <div class="sheet-card">
    <h2 class="sheet-title">Habilidades Marciales</h2>
    <p class="xp-text">
      <span class="xp-label">Experiencia Marcial Disponible:</span>
      <span class="xp-value">{{ martialXP.total }}</span>
    </p>
    <p>Nombre de la especialización: <strong>{{ martialXP.name }}</strong></p>
    <p>Desarrolla habilidades de combate y resistencia física.</p>
  </div>
</template>

<style scoped>
.sheet-card {
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 20px auto;
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

.sheet-title {
  text-align: center;
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #ff5733;
}

.xp-text {
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
}

.xp-label {
  font-weight: bold;
}

.xp-value {
  font-weight: bold;
  color: #ff5733;
}
</style>
