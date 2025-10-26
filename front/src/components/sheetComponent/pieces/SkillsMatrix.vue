<script setup>
import SkillsColumn from "./SkillsColumn.vue";
import { characterFunctions } from "../../../store/characterSheet.js";
import { ref } from "vue";

const characterSheet = characterFunctions();

const character = ref(characterSheet.getcharacterSheet);
</script>

<template>
  <section class="flex">
    <SkillsColumn v-for="camp in character.camp" :camp="camp"></SkillsColumn>
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