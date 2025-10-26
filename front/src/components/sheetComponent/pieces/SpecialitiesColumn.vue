<template>
  <div class="full-block back-color">
    <table class="dimensions-table">
      <!-- Cabecera normal de tabla -->
      <thead>
        <tr class="dimensions-header">
          <th class="skill-names">Habilidad</th>
          <th class="skill-value">Base</th>
          <th class="skill-value">Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="speciality in props.skill.specialities" :key="speciality.name">
            <SpecialityCell 
              :speciality="speciality" 
            >
              {{ speciality.name }}
            </SpecialityCell>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import SpecialityCell from "./SpecialityCell.vue";
const props = defineProps({
  skill: Object,
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
.dimensions-table {
  width: 30%;
  min-width: 150px;
}

/* Dejar que <tr> y <th> se comporten como tabla */
.dimensions-header {
  /* Quita display:flex; etc. */
}
th {
  /* Quita display:block; */
  font-size: 14px;
}

/* Tus estilos para celdas */
.skill-names, .skill-value {
  text-align: center;
  border: 1px solid var(--color-light-grey);
  padding: 10px 1px;
  color: var(--color-light-grey);
}
.skill-names {
  width: 150px;
}

.back-color {
  background-color: var(--color-medium-white);
}
.capitalize {
  text-transform: capitalize;
}
.full-block {
  display: flex;
  flex-direction: column;
  align-items: left;
}
</style>
