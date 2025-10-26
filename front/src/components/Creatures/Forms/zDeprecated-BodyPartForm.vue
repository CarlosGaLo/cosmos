<script setup>
import { ref } from "vue";
import { useCreaturesStore } from "@/store/creatureStore";

const store = useCreaturesStore();
const bodyPart = ref({ part: "", hp: null });

const createBodyPart = async () => {
  if (!bodyPart.value.part || !bodyPart.value.hp) return;
  await store.createBodyPart(bodyPart.value);
  bodyPart.value = { part: "", hp: null };
};
</script>

<template>
  <div class="form-card">
    <h3>1️⃣ Crear BodyPart</h3>
    <form @submit.prevent="createBodyPart">
      <label>Nombre de la Parte del Cuerpo:</label>
      <input v-model="bodyPart.part" type="text" placeholder="Ej: Cabeza" required />

      <label>Puntos de Vida:</label>
      <input v-model="bodyPart.hp" type="number" min="1" required />

      <button type="submit">Crear BodyPart</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.form-card {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

h3 {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

input,
select,
button {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #45a049;
}

/* ✅ Mejoras en selección múltiple */
.multi-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.body-part-option {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.body-part-option.selected {
  background: #4caf50;
  color: white;
  font-weight: bold;
}

/* ✅ Estilos para los tags de BodyParts seleccionadas */
.selected-body-parts {
  margin-top: 10px;
}

.selected-tag {
  display: inline-block;
  padding: 5px 10px;
  margin-right: 5px;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

/* ✅ Contenedor general de selección múltiple */
.multi-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

/* ✅ Estilos para las opciones de selección */
.body-part-option,
.ability-option {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  transition: background 0.3s, color 0.3s;
}

/* ✅ Resaltar elementos seleccionados */
.body-part-option.selected,
.ability-option.selected {
  background: #4caf50;
  color: white;
  font-weight: bold;
}

/* ✅ Contenedor de etiquetas seleccionadas */
.selected-body-parts,
.selected-abilities {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* ✅ Estilos para etiquetas de selección */
.selected-tag {
  display: inline-block;
  padding: 5px 10px;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: default;
}

</style>
