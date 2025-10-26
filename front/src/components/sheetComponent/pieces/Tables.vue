<script setup>
import { computed, toRefs } from "vue";
import { characterFunctions } from "@/store/characterSheet";

const props = defineProps({
  adquired: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  dataBase: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["updateAdquired"]);

// Computed para obtener los IDs de los adquiridos
const adquiredIds = computed(() => props.adquired.map((item) => item.id));

// Función para gestionar el checkbox
const toggleItem = (value) => {
  value.isAdquired = !value.isAdquired;
  if (value.isAdquired) {
    characterFunctions()[props.dataBase].push(value);
    characterFunctions().metaData.freeXP -= value.xp;
  } else {
    const index = characterFunctions()[props.dataBase].findIndex(
      (item) => item.id === value.id
    );
    if (index !== -1) {
      characterFunctions()[props.dataBase].splice(index, 1);
      characterFunctions().metaData.freeXP += value.xp;
    }
  }

  emit("updateAdquired", value.isAdquired);
};
</script>

<template>
  <div>
    <!-- Tabla de elementos adquiridos -->
    <table v-if="adquired.length" class="background-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Requisitos</th>
          <th>Coste</th>
          <th>Resumen</th>
        </tr>
      </thead>
      <tbody class="orange-background">
        <tr v-for="(item, key) in adquired" :key="key">
          <td>{{ item.name }}</td>
          <td v-if="!item.requisites.length">-</td>
          <td v-else>{{ item.requisites.join(", ") }}</td>
          <td>{{ item.xp }}</td>
          <td>{{ item.resume }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Tabla de todos los elementos con checkbox -->
    <table v-if="items.length" class="background-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Requisitos</th>
          <th>Coste</th>
          <th>Descripción</th>
          <th>Comprado</th>
        </tr>
      </thead>
      <tbody class="blue-background">
        <tr v-for="(item, key) in items" :key="key">
          <td>{{ item.name }}</td>
          <td v-if="!item.requisites.length">-</td>
          <td v-else>{{ item.requisites.join(", ") }}</td>
          <td>{{ item.xp }}</td>
          <td>{{ item.description }}</td>
          <td>
            <input
              type="checkbox"
              :checked="item.isAdquired"
              @change="toggleItem(item)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.orange-background {
  background-color: var(--color-hard-white);
}

.blue-background tr td {
  border: 1px solid var(--color-medium-blue);
  background-color: #dbeff4;
}

.background-table {
  border-spacing: 0;
  width: 100%;
  border-collapse: collapse;
}

.background-table th,
.background-table td {
  padding: 8px;
  text-align: left;
}

.background-table th {
  background-color: #f0f0f0;
  border-bottom: 2px solid var(--color-medium-blue);
}
</style>
