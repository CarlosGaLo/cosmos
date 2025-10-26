<template>
  <div>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchName"
        placeholder="Buscar personaje..."
      />
      <button @click="loadCharacter">🔍</button>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="character">
      <button class="toggle-btn" @click="isExpanded = !isExpanded">
        {{ isExpanded ? "⬆ Ocultar detalles" : "⬇ Mostrar detalles" }}
      </button>

      <div v-if="isExpanded" class="character-details">
        <CompleteSheet />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCharacterSheetStore } from "@/store/characterSheetDB"; // 👈 Este es el store correcto
import CompleteSheet from "@/components/sheetComponent/CompleteSheet.vue";

const characterSheetStore = useCharacterSheetStore();
const searchName = ref("");
const isExpanded = ref(false);
const error = ref(null);

const loading = computed(() => characterSheetStore.loading);
const character = computed(() => characterSheetStore.characterSheet); // Se usa characterSheet del store

const loadCharacter = async () => {
  try {
    await characterSheetStore.fetchCharacterSheetByName(searchName.value);
    isExpanded.value = true;
    error.value = null;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = "Personaje no encontrado";
    } else {
      error.value = "Error al cargar el personaje";
    }
    setTimeout(() => {
      error.value = null;
    }, 3000);
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
}

.search-bar input {
  width: 200px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.search-bar input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
}

.search-bar button {
  background: #2563eb;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease-in-out;
}

.search-bar button:hover {
  background: #1e40af;
}

.error-message {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 8px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.toggle-btn {
  background: #2563eb;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  font-size: 14px;
}

.toggle-btn:hover {
  background: #1e40af;
}

.character-details {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  background: #f9f9f9;
  margin-top: 15px;
  transition: all 0.3s ease-in-out;
}

.loading {
  color: #f59e0b;
}
</style>
