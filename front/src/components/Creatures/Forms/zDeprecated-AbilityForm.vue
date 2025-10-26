<script setup>
import { ref, computed, onMounted } from "vue";
import { useCreaturesStore } from "@/store/creatureStore";

const store = useCreaturesStore();
const ability = ref({ name: "", origin: "", effect: "", bodyParts: [] });
const searchQuery = ref(""); // 🔍 Estado para la búsqueda
const selectedBodyPart = ref(null); // 📌 Para mostrar detalles antes de agregar

onMounted(() => {
  store.fetchBodyParts();
});

// 📌 Crear una nueva habilidad
const createAbility = async () => {
  if (!ability.value.name || !ability.value.origin || !ability.value.effect)
    return;
  await store.createAbility(ability.value);
  ability.value = { name: "", origin: "", effect: "", bodyParts: [] };
};

// 📌 Computed: Filtrar bodyParts según búsqueda
const filteredBodyParts = computed(() => {
  let results = store.bodyParts.filter((bp) =>
    bp.part.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return searchQuery.value ? results.slice(0, 50) : results.slice(0, 10);
});

// 📌 Seleccionar una parte del cuerpo para vista previa
const previewBodyPart = (bodyPart) => {
  selectedBodyPart.value = bodyPart;
};

// 📌 Agregar una parte del cuerpo a la habilidad
const addBodyPart = (bodyPartId) => {
  if (!ability.value.bodyParts.includes(bodyPartId)) {
    ability.value.bodyParts.push(bodyPartId);
    selectedBodyPart.value = null; // 🔄 Ocultar detalles después de agregar
  }
};

// 📌 Remover una parte del cuerpo seleccionada
const removeBodyPart = (bodyPartId) => {
  ability.value.bodyParts = ability.value.bodyParts.filter(
    (id) => id !== bodyPartId
  );
};
</script>

<template>
  <div class="form-card">
    <h3>2️⃣ Crear Ability</h3>
    <form @submit.prevent="createAbility">
      <label>Nombre de la Habilidad:</label>
      <input
        v-model="ability.name"
        type="text"
        placeholder="Ej: Vuelo"
        required
      />

      <label>Origen:</label>
      <input
        v-model="ability.origin"
        type="text"
        placeholder="Ej: Natural"
        required
      />

      <label>Efecto:</label>
      <input
        v-model="ability.effect"
        type="text"
        placeholder="Ej: Puede volar sin restricciones"
        required
      />

      <!-- 📌 Búsqueda de BodyParts -->
      <label>Buscar Partes del Cuerpo:</label>
      <input v-model="searchQuery" type="text" placeholder="Ej: Alas, Cola" />

      <!-- 📌 Lista de BodyParts filtradas -->
      <div class="multi-select">
        <div
          v-for="bp in filteredBodyParts"
          :key="bp._id"
          class="body-part-option"
          :class="{ selected: ability.bodyParts.includes(bp._id) }"
          @click="previewBodyPart(bp)"
        >
          <span class="body-part-text">{{ bp.part }} - {{ bp.hp }} HP</span>
        </div>
      </div>

      <!-- 📌 Vista previa de BodyPart antes de agregar -->
      <div v-if="selectedBodyPart" class="preview-card">
        <h4>{{ selectedBodyPart.part }}</h4>
        <p><strong>HP:</strong> {{ selectedBodyPart.hp }}</p>
        <button @click="addBodyPart(selectedBodyPart._id)">Agregar</button>
      </div>

      <!-- 📌 Partes del Cuerpo Seleccionadas -->
      <div class="selected-body-parts">
        <span
          v-for="bpId in ability.bodyParts"
          :key="bpId"
          class="selected-tag"
        >
          {{
            store.bodyParts.find((bp) => bp._id === bpId)?.part || "Desconocido"
          }}
          <button @click="removeBodyPart(bpId)">✖</button>
        </span>
      </div>

      <button type="submit">Crear Ability</button>
    </form>
  </div>
</template>

<style scoped>
/* 📌 Estilos de la búsqueda */
label {
  text-align: left;
  display: block; /* Asegura que el label ocupe todo el ancho */
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: left;
}

/* 📌 Estilos de selección */
.multi-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.body-part-option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.3s, color 0.3s;
  text-align: left;
}

.body-part-text {
  flex-grow: 1;
  text-align: left;
}

.body-part-option.selected {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

/* 📌 Estilos de la vista previa */
.preview-card {
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  text-align: left;
}

.preview-card h4 {
  margin: 0;
}

.preview-card button {
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 5px;
}

.preview-card button:hover {
  background-color: #45a049;
}

/* 📌 Estilos de las etiquetas seleccionadas */
.selected-body-parts {
  margin-top: 10px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
  text-align: left;
}

.selected-tag button {
  background-color: transparent;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
}

button {
  background: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}
</style>
