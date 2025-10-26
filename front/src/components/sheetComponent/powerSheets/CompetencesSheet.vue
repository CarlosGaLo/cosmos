<script setup>
import { ref, computed, onMounted } from "vue";
import { useCompetencesStore } from "@/store/competencesStore";
import { characterFunctions } from "@/store/characterSheet";

// Instancia de la store
const competencesStore = useCompetencesStore();

// Cargar las competencias al montar el componente
onMounted(() => {
  competencesStore.fetchCompetences();
});

// Estado para competencias asignadas
const characterCompetences = ref(characterFunctions().competences || []);

// Estado del modal
const showModal = ref(false);
const selectedCompetence = ref(null);

// Estado para desplegables
const isCompetencesOpen = ref(false);
const openTypes = ref({});

// Computed para agrupar competencias por `group`
const groupedCompetences = computed(() => {
  const grouped = {};
  competencesStore.competences.forEach((competence) => {
    if (!grouped[competence.group]) {
      grouped[competence.group] = [];
    }
    grouped[competence.group].push(competence);
  });
  return grouped;
});

// Computed para filtrar las competencias disponibles
const availableCompetences = computed(() =>
  competencesStore.competences.filter(
    (competence) =>
      !characterCompetences.value.some((c) => c.name === competence.name)
  )
);

// Función para alternar una competencia
const toggleCompetence = (competence, event) => {
  event.stopPropagation(); // Detiene la propagación del evento para no abrir el modal

  const index = characterCompetences.value.findIndex(
    (c) => c.name === competence.name
  );

  if (index === -1) {
    characterCompetences.value.push(competence);
    characterFunctions().calculateXP(0, 0, 0, competence.xp);
    characterFunctions().metaData.competencesXP -= competence.xp;
  } else {
    characterCompetences.value.splice(index, 1);
    characterFunctions().calculateXP(0, 0, 0, -competence.xp);
    characterFunctions().metaData.competencesXP += competence.xp;
  }
};

// Función para abrir el modal
const openModal = (competence) => {
  selectedCompetence.value = competence;
  showModal.value = true;
  document.body.style.overflow = "hidden"; // Evita scroll en la página al abrir el modal
};

// Función para cerrar el modal
const closeModal = () => {
  showModal.value = false;
  selectedCompetence.value = null;
  document.body.style.overflow = "auto"; // Restaura el scroll al cerrar el modal
};

// Función para alternar visibilidad de un tipo de competencia
const toggleType = (group) => {
  openTypes.value[group] = !openTypes.value[group];
};
</script>

<template>
  <div class="competences-container">
    <h2 class="title">Competencias Asignadas</h2>
    <div v-if="characterCompetences.length > 0" class="assigned-list">
      <div
        v-for="competence in characterCompetences"
        :key="competence.name"
        class="competence-card assigned"
        @click="openModal(competence)"
      >
        <div class="competence-content">
          <h3>{{ competence.name }}</h3>
          <span class="cost">Coste: {{ competence.xp }} XP</span>
          <p>{{ competence.resume }}</p>
        </div>
        <label class="switch" @click.stop>
          <input
            type="checkbox"
            :checked="true"
            @change="toggleCompetence(competence, $event)"
          />
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <p v-else class="empty">No hay competencias asignadas.</p>

    <button
      class="dropdown-header"
      @click="isCompetencesOpen = !isCompetencesOpen"
    >
      Lista de Competencias Disponibles
      <span :class="{ rotate: isCompetencesOpen }">▼</span>
    </button>

    <div v-show="isCompetencesOpen" class="competence-list">
      <div v-for="(competences, group) in groupedCompetences" :key="group">
        <button class="group-header" @click="toggleType(group)">
          {{ group }}
          <span :class="{ rotate: openTypes[group] }">▼</span>
        </button>

        <div v-show="openTypes[group]" class="group-content">
          <div
            v-for="competence in competences"
            :key="competence.name"
            class="competence-card"
            @click="openModal(competence)"
          >
            <div class="competence-content">
              <h3>{{ competence.name }}</h3>
              <span class="cost">Coste: {{ competence.xp }} XP</span>
              <p>{{ competence.resume }}</p>
            </div>
            <label class="switch" @click.stop>
              <input
                type="checkbox"
                @change="toggleCompetence(competence, $event)"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">✖</button>
        <h2>{{ selectedCompetence.name }}</h2>
        <p class="modal-description">{{ selectedCompetence.description }}</p>
        <p><strong>Coste XP:</strong> {{ selectedCompetence.xp }}</p>
        <p><strong>Requisitos:</strong></p>
        <ul>
          <li v-for="req in selectedCompetence.requisites" :key="req.name">
            {{ req.name }} ({{ req.value }} XP)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.competences-container {
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 20px auto;
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

/* Botón desplegable */
.dropdown-header,
.group-header {
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
  margin: 5px 0;
}

.dropdown-header:hover,
.group-header:hover {
  background: #0056b3;
}

.rotate {
  transform: rotate(180deg);
}

/* Lista de competencias */
.group-content {
  padding: 10px;
  background: #1a1a2e;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Switch minimalista */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #888;
  border-radius: 22px;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #66ff66;
}
</style>
