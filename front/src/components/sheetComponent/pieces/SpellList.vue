<template>
  <div class="container">
    <SearchBar :apiUrl="`${API_URL}/spells`"></SearchBar>
    <h2>📜 Hechizos Disponibles</h2>

    <div v-if="selectedGroup" class="filter-tag" @click="clearFilter">
      🔍 Filtrando por: <strong>{{ selectedGroup }}</strong> ✖
    </div>

    <div v-if="loading" class="loading">Cargando hechizos...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <div v-if="!loading && !error" class="grid">
      <div v-for="spell in filteredSpells" :key="spell._id" class="spell-card">
        <div class="header">
          <router-link :to="'/spell/' + spell._id" class="spell-title">
            <h3 v-if="!spell.isEditing">{{ spell.newName }}</h3>
          </router-link>
          <input
            v-if="spell.isEditing"
            v-model="spell.newName"
            class="edit-input"
            placeholder="Nombre"
          />
          <span class="edit-icon" @click="toggleEdit(spell)">✏️</span>
        </div>

        <div class="spell-details">
          <div class="detail-row">
            <p><strong>Nivel:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newLvl }}</span>
            <input
              v-else
              v-model="spell.newLvl"
              type="number"
              class="edit-input"
            />
          </div>

          <div class="detail-row">
            <p><strong>XP:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newXP }}</span>
            <input
              v-else
              v-model="spell.newXP"
              type="number"
              class="edit-input"
            />
          </div>

          <div class="detail-row">
            <p><strong>Maná:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newManaCost }}</span>
            <input
              v-else
              v-model="spell.newManaCost"
              type="number"
              class="edit-input"
            />
          </div>

          <div class="detail-row">
            <p><strong>Umbral:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newThreshold }}</span>
            <input
              v-else
              v-model="spell.newThreshold"
              type="number"
              class="edit-input"
            />
          </div>

          <div class="detail-row">
            <p><strong>Desafío:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newChallenge }}</span>
            <input v-else v-model="spell.newChallenge" class="edit-input" />
          </div>

          <div class="detail-row">
            <p><strong>Grupo:</strong></p>
            <span v-if="!spell.isEditing">
              <span
                class="tag clickable"
                v-for="group in spell.newGroup.split(',')"
                :key="group"
                @click="filterByGroup(group.trim())"
              >
                {{ group.trim() }}
              </span>
            </span>
            <input
              v-else
              v-model="spell.newGroup"
              class="edit-input"
              placeholder="Grupo separado por comas"
            />
          </div>

          <div class="detail-row">
            <p><strong>Requisitos:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newRequisites }}</span>
            <input
              v-else
              v-model="spell.newRequisites"
              class="edit-input"
              placeholder="Requisitos separados por comas"
            />
          </div>

          <div class="description-section">
            <p><strong>Resumen:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newResume }}</span>
            <textarea
              v-else
              v-model="spell.newResume"
              class="edit-textarea"
            ></textarea>
          </div>

          <div class="description-section">
            <p><strong>Descripción:</strong></p>
            <span v-if="!spell.isEditing">{{ spell.newDescription }}</span>
            <textarea
              v-else
              v-model="spell.newDescription"
              class="edit-textarea"
            ></textarea>
          </div>
        </div>

        <div v-if="spell.isEditing" class="actions">
          <button @click="saveChanges(spell)" class="save-button">
            💾 Guardar
          </button>
          <button @click="toggleEdit(spell)" class="cancel-button">
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SearchBar from "../../Utils/SearchBar.vue";

// Obtener la URL de la API desde variables de entorno
const API_URL = process.env.VUE_APP_API_URL;

const spells = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedGroup = ref(null);

const fetchData = async () => {
  try {
    const spellsRes = await axios.get(`${API_URL}/spells`);
    spells.value = spellsRes.data.map((spell) => ({
      ...spell,
      isEditing: false,
      newName: spell.name,
      newLvl: spell.lvl,
      newXP: spell.xp,
      newManaCost: spell.manaCost,
      newThreshold: spell.threshold,
      newChallenge: spell.challenge,
      newGroup: spell.group?.join(", ") || "",
      newResume: spell.resume,
      newDescription: spell.description,
      newRequisites: spell.requisites?.join(", ") || "",
    }));
  } catch (err) {
    error.value = "No se pudieron cargar los hechizos.";
    console.error("❌ Error al obtener datos:", err);
  } finally {
    loading.value = false;
  }
};

const toggleEdit = (spell) => {
  spell.isEditing = !spell.isEditing;
};

const saveChanges = async (spell) => {
  try {
    await axios.put(`${API_URL}/spells/${spell._id}`, {
      name: spell.newName,
      lvl: spell.newLvl,
      xp: spell.newXP,
      manaCost: spell.newManaCost,
      threshold: spell.newThreshold,
      challenge: spell.newChallenge,
      group: spell.newGroup.split(",").map((g) => g.trim()),
      resume: spell.newResume,
      description: spell.newDescription,
      requisites: spell.newRequisites.split(",").map((r) => r.trim()),
    });

    spell.isEditing = false;
  } catch (err) {
    console.error("❌ Error al guardar cambios:", err);
  }
};

const filterByGroup = (group) => {
  selectedGroup.value = group;
};

const clearFilter = () => {
  selectedGroup.value = null;
};

const filteredSpells = computed(() => {
  if (!selectedGroup.value) return spells.value;
  return spells.value.filter((spell) =>
    spell.newGroup.includes(selectedGroup.value)
  );
});

onMounted(fetchData);
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background: #f8fafc;
  border-radius: 12px;
}

h2 {
  text-align: center;
  font-size: 26px;
  color: #1f2937;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 25px;
}

.spell-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spell-title {
  text-decoration: none;
}

.spell-title h3 {
  color: #2563eb;
  font-size: 20px;
}

.edit-icon {
  cursor: pointer;
  font-size: 18px;
  color: #2563eb;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.tag {
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 14px;
  margin-right: 5px;
}

.description-section {
  margin-top: 10px;
}

.edit-input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.edit-textarea {
  width: 100%;
  height: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
}

.actions {
  margin-top: 15px;
  text-align: right;
}

.save-button {
  background: #16a34a;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button {
  background: #dc2626;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
</style>
