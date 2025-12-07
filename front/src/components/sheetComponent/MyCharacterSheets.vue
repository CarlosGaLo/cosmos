<template>
  <div class="my-sheets-container">
    <h1>Mis Fichas de Personaje</h1>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="sheets.length === 0" class="empty">
      No tienes fichas guardadas
    </div>

    <div v-else class="sheets-grid">
      <div v-for="sheet in sheets" :key="sheet._id" class="sheet-card">
        <div class="card-header">
          <h3>{{ sheet.character.name }}</h3>
          <span class="specie">{{
            sheet.character.specie?.name || "Sin especie"
          }}</span>
        </div>
        <div class="card-info">
          <p>
            Nivel: {{ sheet.character.age }} ({{ sheet.character.ageState }})
          </p>
          <p>XP Libre: {{ sheet.metaData.freeXP }}</p>
          <p>Actualizado: {{ formatDate(sheet.updatedAt) }}</p>
        </div>
        <div class="card-actions">
          <button @click="loadSheet(sheet._id)" class="btn-load">Cargar</button>
          <button @click="deleteSheet(sheet._id)" class="btn-delete">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCharacterSheetStore } from "@/store/characterSheetDB";

const router = useRouter();
const sheetStore = useCharacterSheetStore();

const loading = ref(true);
const error = ref(null);
const sheets = ref([]);

onMounted(async () => {
  try {
    sheets.value = await sheetStore.fetchUserCharacterSheets();
  } catch (err) {
    error.value = "Error al cargar fichas";
  } finally {
    loading.value = false;
  }
});

async function loadSheet(id) {
  await sheetStore.fetchCharacterSheet(id);
  router.push("/characterSheet");
}

async function deleteSheet(id) {
  if (!confirm("¿Eliminar esta ficha?")) return;
  try {
    await sheetStore.deleteCharacterSheet(id);
    sheets.value = sheets.value.filter((s) => s._id !== id);
  } catch (err) {
    alert("Error al eliminar");
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES");
}
</script>

<style scoped>
.my-sheets-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.sheets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.sheet-card {
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 20px;
}
.card-header h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}
.specie {
  background: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.btn-load {
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
