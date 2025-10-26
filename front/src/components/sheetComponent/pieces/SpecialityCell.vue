<script setup>
import { ref } from "vue";
import SpecialityButton from "./SpecialityButton.vue";
import { characterFunctions } from "@/store/characterSheet";

const hasSpecialities = ref(false);

const props = defineProps({
  speciality: Object,
});

function toggleSpecialities() {
  hasSpecialities.value = !hasSpecialities.value;
}

function handleChanges(newValue) {
  characterFunctions().updateSpeciality(props.speciality.name, newValue);
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
      :base="true"
      @onBaseChange="handleChanges"
    />
  </td>
  <td>
    <SpecialityButton
      class="button-space button-total"
      :speciality="props.speciality"
      :final="true"
    />
  </td>
</template>

<style scoped>
/* Contenedor flexible para una sola “fila” de la habilidad */
.speciality-row {
  display: flex;
  align-items: center;
  gap: 12px; /* Espacio horizontal */
  padding: 8px;
  background-color: var(--color-medium-white);
  border-bottom: 1px solid var(--color-light-grey);
}

/* Nombre de la habilidad (slot) */
.skill-name {
  flex: 1; /* Ocupar todo el espacio disponible */
  font-size: 16px;
  font-weight: 600;
}

/* Botones especiales (base o final) */
.button-space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; /* Ajusta a tu gusto */
  height: 90px; /* Ajusta si necesitas más compacto */
}

/* Botón final, si deseas darle un estilo distinto */
.button-total {
  font-weight: 600;
}
</style>
