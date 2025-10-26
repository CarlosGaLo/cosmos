<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCreaturesStore } from "@/store/creatureStore";

const route = useRoute();
const router = useRouter();
const store = useCreaturesStore();
const creatureId = route.params.id;

const loading = ref(true);
const error = ref(null);
const previewImage = ref(null);
const creature = ref({
  name: "",
  habitat: [],
  bodyParts: [],
  camps: [],
  turn: null,
  damage: "",
  image: null,
});

onMounted(async () => {
  try {
    await store.fetchCreature(creatureId);
    creature.value = { ...store.creature };
    previewImage.value = creature.value.image
      ? `http://localhost:3000${creature.value.image}`
      : null;
  } catch (err) {
    error.value = "Error al cargar la criatura.";
    console.error("❌ Error en ModifyCreature:", err);
  } finally {
    loading.value = false;
  }
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  creature.value.image = file; // ✅ Guardar el archivo correctamente

  // Vista previa de la imagen
  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const updateCreature = async () => {
  try {
    await store.updateCreature(creatureId, creature.value);
    router.push(`/creature/show/${creatureId}`);
  } catch (error) {
    console.error("❌ Error al actualizar criatura:", error);
  }
};
</script>

<template>
  <div class="form-card">
    <h3>✏️ Modificar Criatura</h3>
    <form @submit.prevent="updateCreature">
      <label>Nombre de la Criatura:</label>
      <input v-model="creature.name" type="text" required />

      <label>Hábitats:</label>
      <input
        v-model="creature.habitat"
        type="text"
        @change="creature.habitat = creature.habitat.split(',')"
      />

      <label>Turno:</label>
      <input v-model="creature.turn" type="number" min="1" />

      <label>Daño:</label>
      <input v-model="creature.damage" type="text" />

      <h4>📷 Modificar Imagen</h4>
      <input type="file" @change="handleImageUpload" accept="image/*" />
      <div v-if="previewImage">
        <h5>Vista Previa:</h5>
        <img
          :src="previewImage"
          alt="Vista previa de la imagen"
          class="image-preview"
        />
      </div>

      <button type="submit">Actualizar Criatura</button>
    </form>
  </div>
</template>
