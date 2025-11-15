<script setup>
import { ref } from "vue";
import SpecialityButton from "./SpecialityButton.vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

const props = defineProps({
  speciality: Object,
  skillName: String,
  campCode: String,
});

function handleChanges(newValue) {
  // El cambio ya se maneja en SpecialityButton
  // Esta función se mantiene por compatibilidad con el evento
  console.log(`Especialidad ${props.speciality.name} actualizada a:`, newValue);
}
</script>

<template>
  <td class="skill-name">
    <slot />
  </td>
  <td>
    <SpecialityButton
      class="button-space"
      :speciality="props.speciality"
      :skill-name="props.skillName"
      :camp-code="props.campCode"
      :base="true"
      @onBaseChange="handleChanges"
    />
  </td>
  <td>
    <SpecialityButton
      class="button-space button-total"
      :speciality="props.speciality"
      :skill-name="props.skillName"
      :camp-code="props.campCode"
      :final="true"
    />
  </td>
</template>

<style scoped>
.skill-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
}

.button-space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 90px;
}

.button-total {
  font-weight: 600;
}
</style>
