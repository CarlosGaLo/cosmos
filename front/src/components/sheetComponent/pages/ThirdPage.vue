<script setup>
import { computed, onMounted } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import PowersGeneral from "../powerSheets/PowersGeneral.vue";

import { useCompetencesStore } from "@/store/competencesStore";
import { useFeatStore } from "@/store/featStore";
import { useMartialStore } from "@/store/martialStore";
import { useSpellStore } from "@/store/spellStore";

const characterStore = useCharacterStore();

// Traemos las stores de las bases de datos
const competencesStore = useCompetencesStore();
const featStore = useFeatStore();
const martialStore = useMartialStore();
const spellStore = useSpellStore();

// Cargar datos al montar el componente
onMounted(() => {
  competencesStore.fetchCompetences();
  featStore.fetchFeats();
  martialStore.fetchMartials();
  spellStore.fetchSpells();
});

// Condiciones para mostrar MagicSheet y MartialSheet
const showMagicSheet = computed(() => {
  const sobCamp = characterStore.character.camp.sob;
  return sobCamp && sobCamp.base > 0 && sobCamp.skills?.hechiceria?.base > 0;
});

const showMartialSheet = computed(() => {
  const vigCamp = characterStore.character.camp.vig;
  return (
    vigCamp &&
    vigCamp.base > 0 &&
    vigCamp.skills?.energia?.specialities?.marcial?.base > 0
  );
});
</script>

<template>
  <div class="sheet-container" v-if="characterStore.character.camp">
    <h2 class="sheet-title">Habilidades del Personaje</h2>

    <!-- Competencias -->
    <PowersGeneral
      :items="competencesStore.competences"
      :assigned-items="characterStore.competences"
      :calculate-x-p="() => characterStore.recalculateAll()"
      name="Competencias"
      :xp-affected="'competencesXP'"
    />

    <!-- Méritos -->
    <PowersGeneral
      :items="featStore.feats"
      :assigned-items="characterStore.feats"
      :calculate-x-p="() => characterStore.recalculateAll()"
      name="Méritos"
      :xp-affected="'featXP'"
    />

    <!-- Defectos -->
    <PowersGeneral
      :items="featStore.unfeats"
      :assigned-items="characterStore.unfeats"
      :calculate-x-p="() => characterStore.recalculateAll()"
      name="Defectos"
      :xp-affected="'featXP'"
      :inverted="true"
    />

    <!-- Marcial (solo si cumple condiciones) -->
    <PowersGeneral
      v-if="showMartialSheet"
      :items="martialStore.martials"
      :assigned-items="characterStore.martials"
      :calculate-x-p="() => characterStore.recalculateAll()"
      name="Marcial"
      :xp-affected="'martialXP'"
    />

    <!-- Magia (solo si cumple condiciones) -->
    <PowersGeneral
      v-if="showMagicSheet"
      :items="spellStore.spells"
      :assigned-items="characterStore.spells"
      :calculate-x-p="() => characterStore.recalculateAll()"
      name="Magia"
      :xp-affected="'magicXP'"
    />
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
