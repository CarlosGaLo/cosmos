<script setup>
import SkillCell from "./SkillCell.vue";
import NumericStepper from "./NumericStepper.vue";
import { ref } from "vue";
import { characterFunctions } from "@/store/characterSheet";
import { nextTick } from "vue";

const characterSheet = characterFunctions();

const props = defineProps({
  camp: Object,
});

const showSkills = ref(false);
function toggleShowSkills() {
  showSkills.value = !showSkills.value;
}

function handleUpdate() {
  nextTick(() => {
    characterSheet.fullfillSheet();
  });
}
</script>

<template>
  <div class="full-block back-color">
    <section class="upper-texts-and-image">
      <p class="uppercase left-align camp-title">{{ props.camp?.name }}</p>
      <div class="flex-base-total">
        <div>
          <p>Base:</p>
          <NumericStepper
            v-model="camp.base"
            :min="0"
            :hideMaxIndicator="true"
            @update:modelValue="handleUpdate"
            :max="camp.cap - camp.specie - camp.age"
          />
        </div>
        <div>
          <p>Total:</p>
          <NumericStepper
            v-model="camp.total"
            :min="0"
            :max="camp.cap"
            :modificable="false"
            :hideMaxIndicator="false"
          />
        </div>
      </div>
    </section>
    <p
      class="field clickable collapsed"
      @click="toggleShowSkills"
      v-if="!showSkills"
    >
      Ver habilidades ▼
    </p>
    <section class="field big-field" v-if="showSkills">
      <p class="clickable hide-skills" @click="toggleShowSkills">
        Ocultar habilidades ▲
      </p>
      <table class="dimensions-table back-color">
        <tr class="dimensions-header">
          <th class="skill-names">Habilidad</th>
          <th class="skill-value">Base</th>
          <th class="skill-value">Total</th>
        </tr>
        <tr v-for="skill in props.camp?.skills">
          <td>
            <SkillCell class="capitalize" :skill="skill">{{
              skill.name
            }}</SkillCell>
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  background-color: var(--color-light-white);
}
th {
  display: block;
  font-family: "FedraStdBook";
  font-size: 14px;
}

p {
  font-size: 18px;
}

.collapsed {
  height: 25px;
  background-color: var(--color-light-blue);
  font-family: "FedraSansLight";
  font-size: 12px;
  border: 1px solid var(--color-medium-blue);
  align-items: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.capitalize {
  text-transform: capitalize;
}

.skill-button {
  border: 1px solid var(--color-medium-grey);
}

.full-block {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: left;
}
.dimensions-table {
  width: 30%;
}

.dimensions-header {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.skill-names {
  font-family: FedraStdBook;
  color: var(--color-light-grey);
  background-color: transparent;
  text-align: center;
  width: 120px;
  padding: 10px 5px;
}

.skill-value {
  font-family: FedraStdBook;
  color: var(--color-light-grey);
  padding: 10px 5px;
  background-color: transparent;
}

.field {
  margin-top: 20px;
  background-color: var(--color-light-blue);
  min-width: 350px;
  max-width: 500px;
}

.big-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.clickable {
  cursor: pointer;
}

.uppercase {
  text-transform: uppercase;
}

.left-align {
  text-align: left;
}

.upper-texts-and-image {
  width: 350px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.camp-img {
  position: absolute;
  width: 400px;
  transform: translate(0, 15px);
  z-index: -100;
}

.up-attributes-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  height: 52px;
  margin-top: 25px;
}

.up-attributes-values {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  gap: 5px;
  height: 52px;
  overflow: hidden;
}

.camp-title {
  margin: 0;
  margin-left: 30px;
  font-size: 20px;
}

.tittle-values {
  font-family: "FedraSansLight";
  font-size: 14px;
}

.hide-skills {
  width: 100%;
  font-size: 12px;
  margin-bottom: 25px;
  margin-right: 30px;
  text-align: end;
  color: var(--color-light-grey);
}

.flex-base-total {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
