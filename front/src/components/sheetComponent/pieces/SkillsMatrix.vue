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
</script>

<template>
  <section class="flex">
    <!-- ✅ CAMBIADO: Mostrar TODOS los campos, incluso con total = 0 -->
    <SkillsColumn
      v-for="campCode in campCodes"
      :key="campCode"
      :camp-code="campCode"
      v-show="camps[campCode]"
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
