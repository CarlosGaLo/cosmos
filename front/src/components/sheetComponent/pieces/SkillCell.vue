<script setup>
import { ref } from "vue";
import SkillButton from "./SkillButton.vue";
import SpecialitiesColumn from "./SpecialitiesColumn.vue";

const hasSpecialities = ref(false);

const props = defineProps({
  skill: Object,
  campCode: String,
});

function toggleSpecialities() {
  hasSpecialities.value = !hasSpecialities.value;
}
</script>

<template>
  <article>
    <section class="flex back-color bottom-border">
      <div class="main-box header-cell">
        <slot />
      </div>
      <div class="flex-inside">
        <SkillButton
          class="button-space back-color"
          :skill="props.skill"
          :camp-code="props.campCode"
          :base="true"
        ></SkillButton>
        <SkillButton
          class="button-space back-color"
          :skill="props.skill"
          :camp-code="props.campCode"
          :mod="true"
        ></SkillButton>
        <SkillButton
          class="button-space back-color"
          :skill="props.skill"
          :camp-code="props.campCode"
          :final="true"
        ></SkillButton>
      </div>
    </section>
    <section class="back-color">
      <p
        v-if="!hasSpecialities"
        @click="toggleSpecialities()"
        class="specialities show-specialities clickable"
      >
        Ver especialidades ▼
      </p>
      <div v-if="hasSpecialities">
        <SpecialitiesColumn
          :skill="props.skill"
          :camp-code="props.campCode"
        ></SpecialitiesColumn>
        <p class="clickable hide-specialities" @click="toggleSpecialities()">
          Ocultar especialidades ▲
        </p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.flex {
  display: flex;
  justify-content: flex-start;
}

.flex .header-cell {
  text-align: center;
  width: 120px;
}

.flex .flex-inside {
  display: flex;
  text-align: center;
  width: 160px; /* Ajustado para 3 columnas */
}

.main-box {
  padding: 15px 10px;
}

.header-cell {
  font-size: 18px;
  border: 1px solid var(--color-light-grey);
}

.back-color {
  background-color: var(--color-light-white);
}

.bottom-border {
  border-bottom: 1px solid var(--color-light-grey);
}

.button-space {
  height: 65px;
  width: 53px; /* Ancho uniforme para las 3 columnas */
  border: 1px solid var(--color-light-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.specialities {
  margin: 0;
  padding: 0;
  font-size: 10px;
  background-color: var(--color-light-blue);
}

.show-specialities {
  background-color: var(--color-hard-white);
  border: 1px solid var(--color-light-grey);
}

.hide-specialities {
  display: flex;
  margin: 0;
  padding: 0;
  height: 20px;
  font-size: 10px;
  background-color: var(--color-hard-white);
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-light-grey);
}
</style>
