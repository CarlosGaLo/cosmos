<script setup>
import XPBoxes from "../pieces/XPBoxes.vue";
import SkillsMatrix from "../pieces/SkillsMatrix.vue";
import { characterFunctions } from "../../../store/characterSheet.js";

const characterSheet = characterFunctions();
</script>

<template>
  <section>
    <h2 class="little-margin">
      Personaje: {{ characterSheet.character.name }}
    </h2>
    <XPBoxes class="margins"></XPBoxes>
    <SkillsMatrix class="margins"></SkillsMatrix>
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
