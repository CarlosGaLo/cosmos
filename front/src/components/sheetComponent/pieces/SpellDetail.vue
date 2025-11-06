<template>
  <div v-if="loading" class="loading">Cargando hechizo...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else-if="spell" class="spell-container">
    <div class="spell-header">
      <h1>{{ spell.newName }}</h1>
      <p class="spell-level">Nivel {{ spell.newLvl }}</p>
    </div>

    <div class="spell-metadata">
      <p><strong>XP Coste:</strong> {{ spell.newXP }}</p>
      <p><strong>Maná Coste:</strong> {{ spell.newManaCost }}</p>
      <p><strong>Umbral:</strong> {{ spell.newThreshold }}</p>
    </div>

    <div class="spell-groups">
      <p><strong>Grupos:</strong></p>
      <span class="tag" v-for="group in spell.newGroup.split(',')" :key="group">
        {{ group.trim() }}
      </span>
    </div>

    <div v-if="spell.newRequisites" class="spell-requisites">
      <p><strong>Requisitos:</strong> {{ spell.newRequisites }}</p>
    </div>

    <div class="spell-description">
      <h3>📖 Resumen</h3>
      <p>{{ spell.newResume }}</p>
      <h3>📝 Descripción</h3>
      <p>{{ spell.newDescription }}</p>
    </div>

    <button class="back-btn" @click="$router.push('/spell')">⬅ Volver</button>
  </div>
  <div v-else class="not-found">❌ No se encontró el hechizo.</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const spell = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchSpell = async () => {
  try {
    const API_URL = process.env.VUE_APP_API_URL;
    const spellId = route.params.id;
    const response = await axios.get(`${API_URL}/spells/${spellId}`);

    if (response.data) {
      spell.value = {
        ...response.data,
        newName: response.data.name || "Hechizo sin nombre",
        newLvl: response.data.lvl || "Desconocido",
        newXP: response.data.xp || "N/A",
        newManaCost: response.data.manaCost || "N/A",
        newThreshold: response.data.threshold || "N/A",
        newChallenge: response.data.challenge || "N/A",
        newGroup: response.data.group?.join(", ") || "Sin grupo",
        newResume: response.data.resume || "No hay resumen disponible.",
        newDescription: response.data.description || "No hay descripción.",
        newRequisites: response.data.requisites?.join(", ") || "Sin requisitos",
      };
    } else {
      error.value = "No se encontró el hechizo.";
    }
  } catch (err) {
    error.value = "Error al cargar el hechizo.";
    console.error("❌ Error al obtener el hechizo:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSpell);
</script>

<style scoped>
.spell-container {
  max-width: 800px;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.spell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

h1 {
  font-size: 24px;
  color: #1f2937;
}

.spell-level {
  background: #2563eb;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}

.spell-metadata p {
  font-size: 16px;
  color: #374151;
}

.spell-groups {
  margin-top: 10px;
}

.tag {
  display: inline-block;
  background: #e0f2fe;
  color: #0ea5e9;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 5px;
}

.spell-description h3 {
  color: #1f2937;
  margin-top: 15px;
}

.spell-description p {
  font-size: 16px;
  color: #374151;
}

.back-btn {
  margin-top: 20px;
  background: #2563eb;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
}

.back-btn:hover {
  background: #1e40af;
}

.loading,
.error,
.not-found {
  text-align: center;
  font-size: 18px;
  color: #dc2626;
  margin-top: 20px;
}
</style>
