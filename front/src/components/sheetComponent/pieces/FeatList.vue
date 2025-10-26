<template>
  <div class="container">
    <h2>Habilidades Disponibles</h2>

    <div v-if="loading" class="loading">Cargando...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="!loading && !error">
      <!-- Sección de Feats -->
      <div class="section">
        <h3>Feats</h3>
        <ul>
          <li v-for="feat in feats" :key="feat._id">
            <div class="item">
              <template v-if="!feat.isEditing">
                <strong>{{ feat.newName }}</strong>
                <span class="edit-icon" @click="toggleEdit(feat)">✏️</span>
              </template>
              <template v-else>
                <input v-model="feat.newName" placeholder="Nombre" />
              </template>
            </div>

            <p v-if="!feat.isEditing">
              {{ feat.newResume || feat.newDescription }}
            </p>
            <template v-else>
              <input
                v-model="feat.newXP"
                type="number"
                placeholder="Costo XP"
              />
              <textarea
                v-model="feat.newResume"
                placeholder="Resumen"
              ></textarea>
              <textarea
                v-model="feat.newDescription"
                placeholder="Descripción"
              ></textarea>
              <input
                v-model="feat.newRequisites"
                placeholder="Requisitos (separados por coma)"
              />
            </template>

            <button
              v-if="feat.isEditing"
              @click="updateFeat(feat)"
              class="save-btn"
            >
              Guardar
            </button>
          </li>
        </ul>
      </div>

      <!-- Sección de Unfeats -->
      <div class="section">
        <h3>Unfeats</h3>
        <ul>
          <li v-for="unfeat in unfeats" :key="unfeat._id">
            <div class="item">
              <template v-if="!unfeat.isEditing">
                <strong>{{ unfeat.newName }}</strong>
                <span class="edit-icon" @click="toggleEdit(unfeat)">✏️</span>
              </template>
              <template v-else>
                <input v-model="unfeat.newName" placeholder="Nombre" />
              </template>
            </div>

            <p v-if="!unfeat.isEditing">
              {{ unfeat.newResume || unfeat.newDescription }}
            </p>
            <template v-else>
              <input
                v-model="unfeat.newXP"
                type="number"
                placeholder="Costo XP"
              />
              <textarea
                v-model="unfeat.newResume"
                placeholder="Resumen"
              ></textarea>
              <textarea
                v-model="unfeat.newDescription"
                placeholder="Descripción"
              ></textarea>
              <input
                v-model="unfeat.newRequisites"
                placeholder="Requisitos (separados por coma)"
              />
            </template>

            <button
              v-if="unfeat.isEditing"
              @click="updateUnfeat(unfeat)"
              class="save-btn"
            >
              Guardar
            </button>
          </li>
        </ul>
      </div>

      <!-- Sección de Competencias -->
      <div class="section">
        <h3>Competencias</h3>
        <ul>
          <li v-for="competence in competences" :key="competence._id">
            <div class="item">
              <template v-if="!competence.isEditing">
                <strong>{{ competence.newName }}</strong>
                <span class="edit-icon" @click="toggleEdit(competence)"
                  >✏️</span
                >
              </template>
              <template v-else>
                <input v-model="competence.newName" placeholder="Nombre" />
              </template>
            </div>

            <p v-if="!competence.isEditing">
              {{ competence.newResume || competence.newDescription }}
            </p>
            <template v-else>
              <input
                v-model="competence.newXP"
                type="number"
                placeholder="Costo XP"
              />
              <textarea
                v-model="competence.newResume"
                placeholder="Resumen"
              ></textarea>
              <textarea
                v-model="competence.newDescription"
                placeholder="Descripción"
              ></textarea>
              <input
                v-model="competence.newRequisites"
                placeholder="Requisitos (separados por coma)"
              />
            </template>

            <button
              v-if="competence.isEditing"
              @click="updateCompetence(competence)"
              class="save-btn"
            >
              Guardar
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const feats = ref([]);
const unfeats = ref([]);
const competences = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    const [featsRes, unfeatsRes, competencesRes] = await Promise.all([
      axios.get("http://localhost:3000/api/feats"),
      axios.get("http://localhost:3000/api/unfeats"),
      axios.get("http://localhost:3000/api/competences"),
    ]);

    const formatData = (data) =>
      data.map((item) => ({
        ...item,
        isEditing: false,
        newName: item.name,
        newXP: item.xp,
        newResume: item.resume,
        newDescription: item.description,
        newRequisites: item.requisites?.join(", ") || "",
      }));

    feats.value = formatData(featsRes.data);
    unfeats.value = formatData(unfeatsRes.data);
    competences.value = formatData(competencesRes.data);
  } catch (err) {
    error.value = "No se pudieron cargar las habilidades.";
    console.error("❌ Error al obtener datos:", err);
  } finally {
    loading.value = false;
  }
};

// Alternar modo edición
const toggleEdit = (item) => {
  item.isEditing = !item.isEditing;
};

// Función para actualizar feats
const updateFeat = async (feat) => {
  try {
    await axios.put(`http://localhost:3000/api/feats/${feat._id}`, {
      newName: feat.newName,
      newXP: feat.newXP,
      newResume: feat.newResume,
      newDescription: feat.newDescription,
      newRequisites: feat.newRequisites.split(",").map((req) => req.trim()),
    });
    feat.isEditing = false;
  } catch (err) {
    console.error("❌ Error al actualizar el feat:", err);
  }
};

// Función para actualizar unfeats
const updateUnfeat = async (unfeat) => {
  try {
    await axios.put(`http://localhost:3000/api/unfeats/${unfeat._id}`, {
      newName: unfeat.newName,
      newXP: unfeat.newXP,
      newResume: unfeat.newResume,
      newDescription: unfeat.newDescription,
      newRequisites: unfeat.newRequisites.split(",").map((req) => req.trim()),
    });
    unfeat.isEditing = false;
  } catch (err) {
    console.error("❌ Error al actualizar el unfeat:", err);
  }
};

// Función para actualizar competencias
const updateCompetence = async (competence) => {
  try {
    await axios.put(`http://localhost:3000/api/competences/${competence._id}`, {
      newName: competence.newName,
      newXP: competence.newXP,
      newResume: competence.newResume,
      newDescription: competence.newDescription,
      newRequisites: competence.newRequisites
        .split(",")
        .map((req) => req.trim()),
    });
    competence.isEditing = false;
  } catch (err) {
    console.error("❌ Error al actualizar la competencia:", err);
  }
};

onMounted(fetchData);
</script>
