<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

const props = defineProps({
  skill: Object,
  campCode: String,
  base: Boolean,
  mod: Boolean,
  final: Boolean,
});

// Total del campo
const campTotal = computed(() => {
  return characterStore.character.camp[props.campCode]?.total || 0;
});

// MOD = 2 × campo(total) + mod_original
const skillMod = computed(() => {
  const atrib = campTotal.value * 2;
  const modOriginal = props.skill.mod || 0;
  return atrib + modOriginal;
});

// Cap máximo para esta skill: 5 × campo(total) + race
const maxSkillValue = computed(
  () => campTotal.value * 5 + (props.skill.race || 0) + (props.skill.atrib || 0)
);

// Máximo para base: maxSkillValue - mod_calculado
const maxBase = computed(() => maxSkillValue.value - skillMod.value);

// Valor final: base + mod_calculado
const skillFinal = computed(() => {
  return (props.skill.base || 0) + skillMod.value;
});

function add() {
  if (props.skill.base < maxBase.value) {
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
    <!-- BASE (editable) -->
    <article class="main-box" v-if="props.base">
      <img
        :class="{
          'top-arrow-number': props.skill.base,
          'top-arrow-zero': !props.skill.base,
        }"
        src="/images-svg/md-arrow-dropdown.svg"
        alt="Incrementar"
        @click="add()"
      />
      <img
        :class="{
          'bottom-arrow-number': props.skill.base,
          'bottom-arrow-zero': !props.skill.base,
        }"
        src="/images-svg/md-arrow-dropdown.svg"
        alt="Decrementar"
        @click="substract()"
      />
      <input
        :class="{
          'light-grey-color': !props.skill.base,
          'main-box': true,
          'input-skill': true,
        }"
        type="number"
        :value="props.skill.base"
        readonly
      />
    </article>

    <!-- MOD (2×campo + mod_original) -->
    <article
      :class="{ 'main-box': true, 'mod-display': true }"
      v-if="props.mod"
    >
      {{ skillMod }}
    </article>

    <!-- FINAL (base + mod) -->
    <article
      :class="{ 'main-box': true, 'light-grey-color': !skillFinal }"
      v-if="props.final"
    >
      {{ skillFinal }}
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
  border: none;
}

p {
  margin: 0;
  padding: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.mod-display {
  color: var(--color-medium-blue);
  font-weight: 600;
}

.background-color {
  background-color: var(--color-medium-white);
}

.top-arrow-number,
.top-arrow-zero {
  position: absolute;
  transform: rotate(180deg) translate(2px, 20px);
  height: 12px;
  width: 12px;
  cursor: pointer;
  z-index: 200;
}

.bottom-arrow-number,
.bottom-arrow-zero {
  position: absolute;
  transform: translate(-2px, 20px);
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
</style>
