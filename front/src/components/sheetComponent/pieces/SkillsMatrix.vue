<script setup>
import SkillsColumn from "./SkillsColumn.vue";
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

// Computed para obtener todos los campos del personaje
const camps = computed(() => characterStore.character.camp);

// Array de códigos de campos para iterar en orden
const campCodes = [
  "art",
  "mov",
  "cul",
  "sup",
  "asa",
  "sob",
  "med",
  "com",
  "vig",
];

// ✅ AÑADIR ESTE COMPUTED
const availableCamps = computed(() => {
  return campCodes.filter(
    (code) => camps.value[code] && camps.value[code].total !== undefined
  );
});
</script>

<template>
  <section class="flex">
    <SkillsColumn
      v-for="campCode in availableCamps"
      :key="campCode"
      :camp-code="campCode"
    />
  </section>
</template>

<style scoped>
.flex {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  align-content: center;
  gap: 50px;
}
</style>
