<script setup>
import { computed } from "vue";
import { characterFunctions } from "@/store/characterSheet";

// Datos del personaje
const magicXP = computed(() => characterFunctions().metaData.magicXP);
</script>

<template>
  <div class="sheet-card">
    <h2 class="sheet-title">Habilidades Mágicas</h2>
    <p class="xp-text">
      <span class="xp-label">Experiencia Mágica Disponible:</span>
    </p>
    <ul class="magic-list">
      <li v-for="(magic, index) in magicXP" :key="index">
        <strong>{{ magic.name }}</strong>: {{ magic.total }} XP
      </li>
    </ul>
    <p>Domina los poderes místicos y la hechicería.</p>
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
  color: #4da6ff;
}

.xp-text {
  font-size: 1.2em;
  margin: 10px 0;
  text-align: center;
}

.magic-list {
  list-style: none;
  padding: 0;
  text-align: center;
}

.magic-list li {
  font-size: 1.1em;
  margin: 5px 0;
  color: #4da6ff;
}
</style>
