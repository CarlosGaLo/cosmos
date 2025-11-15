<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

const props = defineProps({
  skill: Object,
  campCode: String,
  base: Boolean,
  modif: Boolean,
  specie: Boolean,
  atrib: Boolean,
  final: Boolean,
});

// Computed para el total de la habilidad
const skillTotal = computed(() => {
  return props.skill.base + props.skill.mod + props.skill.atrib;
});

function add() {
  if (props.skill.base < props.skill.cap) {
    characterStore.increaseSkillBase(props.campCode, props.skill.name, 1);
  }
}

function substract() {
  if (props.skill.base > 0) {
    characterStore.increaseSkillBase(props.campCode, props.skill.name, -1);
  }
}
</script>

<template>
  <section class="background-color header-box">
    <article class="main-box" v-if="props.base">
      <img
        :class="{
          'top-arrow-number': props.skill.base,
          'top-arrow-zero': !props.skill.base,
        }"
        src="/images-svg/md-arrow-dropdown.svg"
        alt=""
        @click="add()"
      />
      <img
        :class="{
          'bottom-arrow-number': props.skill.base,
          'bottom-arrow-zero': !props.skill.base,
        }"
        src="/images-svg/md-arrow-dropdown.svg"
        alt=""
        @click="substract()"
      />
      <input
        :class="{
          'light-grey-color': !props.skill.base,
          'main-box': true,
          'input-skill': true,
        }"
        type="number"
        max="50"
        min="0"
        :value="props.skill.base"
        readonly
      />
    </article>
    <article
      :class="{ 'main-box': true, 'light-grey-color': !skillTotal }"
      v-if="props.final"
    >
      {{ skillTotal }}
    </article>
  </section>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input {
  margin: 0;
  padding: 0;
  margin-block: 0;
  border: none;
  padding-block: 0;
  padding-inline: 0;
}

p {
  margin: 0;
  padding: 0;
  margin-block: 0;
}

.light-grey-color {
  font-family: "FedraNumberLight";
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-light-grey);
  text-align: center;
}

.main-box {
  font-family: "FedraNumberLight";
  font-size: 14px;
  text-align: center;
  width: 22px;
  height: 20px;
  margin: 5px;
  overflow: hidden;
}

.background-color {
  background-color: var(--color-medium-white);
}

.top-arrow-number {
  position: absolute;
  transform: rotate(180deg) translate(-8px, 15px);
  height: 12px;
  width: 12px;
  cursor: pointer;
  z-index: 200;
}

.top-arrow-zero {
  position: absolute;
  transform: rotate(180deg) translate(6px, 15px);
  height: 12px;
  width: 12px;
  cursor: pointer;
  z-index: 200;
}

.bottom-arrow-number {
  position: absolute;
  transform: translate(8px, 25px);
  height: 12px;
  width: 12px;
  cursor: pointer;
  z-index: 200;
}

.bottom-arrow-zero {
  position: absolute;
  transform: translate(-6px, 25px);
  height: 12px;
  width: 12px;
  cursor: pointer;
  z-index: 200;
}

.input-skill {
  overflow: hidden;
  height: 16px;
  transform: translate(-2px, -1px);
}

.lower-letter {
  font-size: 15px;
}
</style>
