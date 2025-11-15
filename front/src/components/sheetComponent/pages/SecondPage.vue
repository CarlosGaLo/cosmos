<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import XPBoxes from "../pieces/XPBoxes.vue";
import SkillsMatrix from "../pieces/SkillsMatrix.vue";

const characterStore = useCharacterStore();

const characterName = computed(
  () => characterStore.character.name || "Sin nombre"
);
</script>

<template>
  <section>
    <h2 class="little-margin">Personaje: {{ characterName }}</h2>
    <XPBoxes class="margins" />
    <SkillsMatrix class="margins" />
  </section>
</template>

<style scoped>
.little-margin {
  margin: 100px;
  font-size: 18px;
  font-weight: lighter;
}

.margins {
  margin-bottom: 200px;
}
</style>
