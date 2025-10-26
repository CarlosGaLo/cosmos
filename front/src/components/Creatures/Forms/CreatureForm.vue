<script setup>
import { ref } from "vue";
import { useCreaturesStore } from "@/store/creatureStore";

const store = useCreaturesStore();
const creature = ref({
  name: "",
  habitat: [],
  bodyParts: [],
  camps: [],
  turn: null,
  damage: "",
  image: null,
});

// 📌 Estado para crear una nueva `BodyPart`
const bodyPart = ref({ part: "", hp: null, abilities: [] });
const ability = ref({ name: "", description: "", effect: "" });

// 📌 Estado para crear un `Camp`
const camp = ref({ name: "", total: 0 });

// 📌 Manejar la imagen seleccionada
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  creature.value.image = file; // 📌 Guardar el archivo para enviarlo correctamente

  // Generar una URL temporal para la vista previa
  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result; // Muestra la imagen correctamente en el frontend
  };
  reader.readAsDataURL(file);
};

const previewImage = ref(null); // 📌 Variable para la vista previa en el frontend

// 📌 Crear una criatura
const createCreature = async () => {
  if (!creature.value.name) return;
  try {
    await store.createCreature(creature.value);
    creature.value = {
      name: "",
      habitat: [],
      bodyParts: [],
      camps: [],
      turn: null,
      damage: "",
      image: null,
    };
  } catch (error) {
    console.error("❌ Error al crear criatura:", error);
  }
};

// 📌 Agregar `BodyPart` con habilidades
const addBodyPart = () => {
  if (!bodyPart.value.part || bodyPart.value.hp <= 0) return;
  creature.value.bodyParts.push({ ...bodyPart.value });
  bodyPart.value = { part: "", hp: null, abilities: [] };
};

// 📌 Agregar habilidad a una `BodyPart`
const addAbility = () => {
  if (!ability.value.name) return;
  bodyPart.value.abilities.push({ ...ability.value });
  ability.value = { name: "", description: "", effect: "" };
};

// 📌 Agregar `Camp`
const addCamp = () => {
  if (!camp.value.name) return;
  creature.value.camps.push({ ...camp.value });
  camp.value = { name: "", total: 0 };
};

// 📌 Eliminar elementos de listas
const removeBodyPart = (index) => creature.value.bodyParts.splice(index, 1);
const removeAbility = (index) => bodyPart.value.abilities.splice(index, 1);
const removeCamp = (index) => creature.value.camps.splice(index, 1);
</script>

<template>
  <div class="form-card">
    <h3>3️⃣ Crear Criatura</h3>
    <form @submit.prevent="createCreature">
      <label>Nombre de la Criatura:</label>
      <input v-model="creature.name" type="text" required />

      <label>Hábitats:</label>
      <input
        v-model="creature.habitat"
        type="text"
        placeholder="Separar por comas"
        @change="creature.habitat = creature.habitat.split(',')"
      />

      <h4>🦴 Agregar Parte del Cuerpo</h4>
      <label>Nombre de la Parte:</label>
      <input v-model="bodyPart.part" type="text" />

      <label>Puntos de Vida Totales:</label>
      <input v-model="bodyPart.hp" type="number" min="1" />

      <h5>⚡ Agregar Habilidad</h5>
      <input v-model="ability.name" type="text" placeholder="Nombre" />
      <input
        v-model="ability.description"
        type="text"
        placeholder="Descripción"
      />
      <input v-model="ability.effect" type="text" placeholder="Efecto" />
      <button type="button" @click="addAbility">Añadir Habilidad</button>

      <ul>
        <li v-for="(ab, i) in bodyPart.abilities" :key="i">
          {{ ab.name }} <button @click="removeAbility(i)">✖</button>
        </li>
      </ul>
      <button type="button" @click="addBodyPart">
        Añadir Parte del Cuerpo
      </button>

      <ul>
        <li v-for="(bp, i) in creature.bodyParts" :key="i">
          {{ bp.part }} ({{ bp.hp }} HP)
          <button @click="removeBodyPart(i)">✖</button>
        </li>
      </ul>

      <h4>🏕️ Agregar Camp</h4>
      <input v-model="camp.name" type="text" placeholder="Nombre del Camp" />
      <input v-model="camp.total" type="number" min="0" />
      <button type="button" @click="addCamp">Agregar Camp</button>

      <ul>
        <li v-for="(c, i) in creature.camps" :key="i">
          {{ c.name }} (Total: {{ c.total }})
          <button @click="removeCamp(i)">✖</button>
        </li>
      </ul>

      <label>Turno:</label>
      <input v-model="creature.turn" type="number" min="1" />

      <label>Daño:</label>
      <input v-model="creature.damage" type="text" />

      <h4>📷 Agregar Imagen</h4>
      <input type="file" @change="handleImageUpload" accept="image/*" />
      <div v-if="creature.image">
        <h5>Vista Previa:</h5>
        <div v-if="previewImage">
          <h5>Vista Previa:</h5>
          <img
            :src="previewImage"
            alt="Vista previa de la imagen"
            class="image-preview"
          />
        </div>
      </div>

      <button type="submit">Crear Criatura</button>
    </form>
  </div>
</template>

<style scoped>
label {
  text-align: left;
  display: block;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  background: #f3f3f3;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
}

button {
  background: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  padding: 8px;
  border: none;
  border-radius: 4px;
}

button:hover {
  background: #45a049;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
