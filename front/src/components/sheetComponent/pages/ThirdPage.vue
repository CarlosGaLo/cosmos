<script setup>
import { computed } from "vue";
import { characterFunctions } from "@/store/characterSheet";

// Importar los componentes
import PowersGeneral from "../powerSheets/PowersGeneral.vue";

import { useCompetencesStore } from "@/store/competencesStore";
import { useFeatStore } from "@/store/featStore";
import { useMartialStore } from "@/store/martialStore";
import { useSpellStore } from "@/store/spellStore";

// Traemos la DB
useCompetencesStore().fetchCompetences();
useFeatStore().fetchFeats();
useMartialStore().fetchMartials();
useSpellStore().fetchSpells();

// Condiciones para mostrar MagicSheet y MartialSheet
const showMagicSheet = computed(() => {
  return (
    characterFunctions().character.camp.sup?.base > 0 &&
    characterFunctions().character.camp.sup.skills?.hechiceria?.base > 0
  );
});

const showMartialSheet = computed(() => {
  return (
    characterFunctions().character.camp.vig > 0 &&
    characterFunctions().character.camp.vig?.skills?.energia?.marcial?.base > 0
  );
});
</script>

<template>
  <div class="sheet-container" v-if="characterFunctions().character.camp">
    <h2 class="sheet-title">Habilidades del Personaje</h2>

    <PowersGeneral
      :items="useCompetencesStore().competences"
      :assignedItems="characterFunctions().competences"
      :calculateXP="() => characterFunctions().calculateXP()"
      name="Competencias"
      :xpAffected="'competencesXP'"
    ></PowersGeneral>
    <!-- Méritos -->
    <PowersGeneral
      :items="useFeatStore().feats"
      :assignedItems="characterFunctions().feats"
      :calculateXP="() => characterFunctions().calculateXP()"
      name="Méritos"
      :xpAffected="'featXP'"
    ></PowersGeneral>
    <!-- Defectos -->
    <PowersGeneral
      :items="useFeatStore().unfeats"
      :assignedItems="characterFunctions().unfeats"
      :calculateXP="() => characterFunctions().calculateXPInverted()"
      name="Defectos"
      :xpAffected="'featXP'"
      :inverted="true"
    ></PowersGeneral>
    <PowersGeneral
      :items="useMartialStore().martials"
      :assignedItems="characterFunctions().martials"
      :calculateXP="() => characterFunctions().calculateXP()"
      name="Marcial"
      :xpAffected="'martialXP'"
      :inverted="true"
    ></PowersGeneral>
    <PowersGeneral
      :items="useSpellStore().spells"
      :assignedItems="characterFunctions().spells"
      :calculateXP="() => characterFunctions().calculateXP()"
      name="Magia"
      :xpAffected="'magicXP'"
      :inverted="true"
    ></PowersGeneral>
    <!-- v-if="characterFunctions().character.camp.vig.skills.energia.base || characterFunctions().character.camp.vig.skills.energia.specialities.marcial.base"
    v-if="characterFunctions().character.camp.sob.skills.hechiceria.base || characterFunctions().character.camp.sob.skills.hechiceria.specialities.arcanomancia.base" -->
  </div>
</template>

<style scoped>
.sheet-container {
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 20px auto;
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

.sheet-title {
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #4da6ff;
}
</style>
