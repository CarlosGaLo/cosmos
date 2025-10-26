<script setup>
import { computed } from "vue";
import { characterFunctions } from "@/store/characterSheet";

const characterStore = characterFunctions();
const character = computed(() => characterStore.character);
</script>

<template>
  <div v-if="character" class="character-sheet">
    <!-- Información General -->
    <section class="section">
      <h1>{{ character.name }}</h1>
      <table class="info-table">
        <tr>
          <td>Edad:</td>
          <td>{{ character.age }} ({{ character.ageState }})</td>
        </tr>
        <tr>
          <td>Sexo:</td>
          <td>{{ character.sex }}</td>
        </tr>
        <tr>
          <td>Especie:</td>
          <td>{{ character.specie || "Desconocida" }}</td>
        </tr>
      </table>
    </section>

    <!-- Habilidades Comunes -->
    <section class="section">
      <h2>Habilidades Comunes</h2>
      <table class="stats-table">
        <tr>
          <th>Habilidad</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>V. Natural</td>
          <td>
            {{ character.camp.vig.skills.vida.specialities.natural.total }}
          </td>
        </tr>
        <tr>
          <td>V. Anímica</td>
          <td>
            {{ character.camp.vig.skills.vida.specialities.sobrenatural.total }}
          </td>
        </tr>
        <tr>
          <td>V. Sobrenatural</td>
          <td>
            {{ character.camp.vig.skills.vida.specialities.animica.total }}
          </td>
        </tr>
        <tr>
          <td>Reg. Vida</td>
          <td>{{ character.regen.life }}</td>
        </tr>
        <tr>
          <td>Reg. Maná</td>
          <td>{{ character.regen.mana }}</td>
        </tr>
        <tr>
          <td>Reg. energia</td>
          <td>{{ character.regen.energy }}</td>
        </tr>
        <tr>
          <td>Ataque</td>
          <td>{{ character.camp.mov.skills.ataque.total }}</td>
        </tr>
        <tr>
          <td>Defensa</td>
          <td>{{ character.camp.sup.skills.defensa.total }}</td>
        </tr>
        <tr>
          <td>Alerta</td>
          <td>
            {{ character.camp.sup.skills.percepcion.specialities.alerta.total }}
          </td>
        </tr>
      </table>
    </section>

    <!-- Campos de habilidades -->
    <section class="section">
      <h2>Habilidades</h2>
      <div v-for="(camp, key) in character.camp" :key="key" class="camp-block">
        <h3>{{ camp.name }} ({{ camp.code }})</h3>
        <table class="stats-table">
          <tr>
            <td>total:</td>
            <td>{{ camp.total }}</td>
          </tr>
        </table>
        <table class="skills-table">
          <tr>
            <th>Habilidad</th>
            <th>total</th>
            <th>Base</th>
            <th>Mod</th>
            <th>Atrib</th>
          </tr>
          <tr v-for="(skill, skillKey) in camp.skills" :key="skillKey">
            <td v-if="skill.base">{{ skill.name }}</td>
            <td v-if="skill.base">{{ skill.total }}</td>
            <td v-if="skill.base">{{ skill.base }}</td>
            <td v-if="skill.base">{{ skill.mod }}</td>
            <td v-if="skill.base">{{ skill.atrib }}</td>
          </tr>
        </table>
      </div>
    </section>

    <!-- Idiomas -->
    <section class="section">
      <h2>Idiomas</h2>
      <table class="stats-table">
        <tr>
          <th>Idioma</th>
        </tr>
        <tr v-for="(language, index) in character.lang.languages" :key="index">
          <td>{{ language.name }}</td>
        </tr>
      </table>
    </section>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

* {
  text-transform: capitalize;
}

.character-sheet {
  font-family: "Poppins", sans-serif;
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h1,
h2,
h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
  font-weight: 600;
}

.info-table td:first-child {
  font-weight: 600;
  width: 30%;
}

.stats-table th,
.skills-table th {
  text-align: center;
}

.stats-table td,
.skills-table td {
  text-align: center;
}

.skills-table th,
.skills-table td {
  padding: 6px;
}

.camp-block {
  padding: 10px;
  margin-top: 15px;
  border-left: 5px solid #3498db;
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
