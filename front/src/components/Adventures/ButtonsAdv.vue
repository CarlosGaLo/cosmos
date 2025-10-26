<template>
  <div class="btn-container-adv">
    <div v-for="(option, index) in pageSelectors">
      <router-link :to="`/adventures/${option.page}`">
        <button class="btn-adv">
          {{ option.text }}
        </button></router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const options = ref();
const optionsModifiers = ref();

const pageSelectors = [
  {
    text: "hola",
    id: 1,
    mod: "vig",
    page: "1",
  },
  {
    text: "aaaa",
    id: 2,
    mod: "vig",
    page: "2",
  },
  {
    text: "bbbb",
    id: 3,
    mod: "cul",
    page: "3",
  },
  {
    text: "cccc",
    id: 4,
    mod: "",
    page: "4",
  },
];
</script>

<style lang="scss">
.btn-container-adv {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: space-around;
  align-items: center;
  justify-content: space-evenly;
}
.btn-adv {
  margin: 4px;
}
</style>
