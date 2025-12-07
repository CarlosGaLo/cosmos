<script setup>
import { ref, computed, onMounted } from "vue";
import { useCreaturesStore } from "@/store/creatureStore";
import { useRouter } from "vue-router";

const store = useCreaturesStore();
const router = useRouter();
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    await store.fetchCreatures();
  } catch (err) {
    error.value = "Error al cargar las criaturas.";
    console.error("❌ Error en SearchCreature:", err);
  } finally {
    loading.value = false;
  }
});

const filteredCreatures = computed(() => {
  if (!searchQuery.value) return store.creatures;
  return store.creatures.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const goToCreature = (id) => {
  router.push(`/creature/show/${id}`);
};
</script>

<template>
  <div
    class="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-900 to-gray-900 p-8 text-white"
  >
    <h2 class="xp-title">Buscar Criatura</h2>
    <div class="dropdown-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Ingrese el nombre de la criatura..."
        class="dropdown-header"
      />
    </div>

    <div v-if="loading" class="mt-6 text-gray-300 text-lg">
      Cargando criaturas...
    </div>
    <div v-else-if="error" class="mt-6 text-red-400 text-lg">{{ error }}</div>
    <ul
      v-else
      class="mt-8 w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-4 dropdown-menu"
    >
      <li
        v-for="creature in filteredCreatures"
        :key="creature._id"
        @click="goToCreature(creature._id)"
        class="dropdown-item"
      >
        {{ creature.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.xp-title {
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-dark-blue);
}

/* Input de búsqueda */
.dropdown-container {
  width: 100%;
  max-width: 350px;
  margin: 0 2vw;
}

.dropdown-header {
  width: 100%;
  background-color: rgba(255, 215, 0, 0.2);
  color: white;
  border: 2px solid var(--color-hard-white);
  padding: 12px;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.dropdown-header:focus {
  background-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 10px var(--color-dark-blue);
}

/* Lista de criaturas */
.dropdown-menu {
  list-style: none;
  padding: 0;
  margin-top: 5px;
  background-color: #1a1a2e;
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
  background-color: var(--color-hard-white);
  color: #1a1a2e;
  transform: scale(1.05);
  border-radius: 8px;
}
</style>
