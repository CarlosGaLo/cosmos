<script setup>
import { computed, onMounted, ref } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import PowersGeneral from "../powerSheets/PowersGeneral.vue";

import { useCompetencesStore } from "@/store/competencesStore";
import { useFeatStore } from "@/store/featStore";
import { useMartialStore } from "@/store/martialStore";
import { useSpellStore } from "@/store/spellStore";

const characterStore = useCharacterStore();

const competencesStore = useCompetencesStore();
const featStore = useFeatStore();
const martialStore = useMartialStore();
const spellStore = useSpellStore();

// ✅ Estado para colapsar secciones
const isMagicCollapsed = ref(false);

// Computed para XP
const totalXP = computed(() => {
  return characterStore.metaData.freeXP + characterStore.metaData.usedXP;
});

const freeXP = computed(() => characterStore.metaData.freeXP);
const usedXP = computed(() => characterStore.metaData.usedXP);

// ✅ XP de especialidades mágicas (filtrar las que tienen total > 0)
const magicXP = computed(() => {
  const allMagic = characterStore.metaData.magicXP || [];
  return allMagic.filter((magic) => magic.total > 0);
});

// ✅ XP marcial (solo mostrar si > 0)
const martialXP = computed(() => characterStore.metaData.martialXP || 0);
const martialUsed = computed(() => characterStore.metaData.martialUsed || 0);

// ✅ Mostrar sección solo si hay XP disponible
const showMagicXPSection = computed(() => magicXP.value.length > 0);
const showMartialXPSection = computed(() => martialXP.value > 0);

// Cargar datos al montar el componente
onMounted(() => {
  competencesStore.fetchCompetences();
  featStore.fetchFeats();
  martialStore.fetchMartials();
  spellStore.fetchSpells();
});

// Condiciones para mostrar MagicSheet y MartialSheet
const showMagicSheet = computed(() => {
  const sob = characterStore.character.camp.sob;
  if (!sob || !sob.skills?.hechiceria) return false;

  const hechiceria = sob.skills.hechiceria;
  return hechiceria.total >= 5;
});

const showMartialSheet = computed(() => {
  const vig = characterStore.character.camp.vig;
  if (!vig || !vig.skills) return false;

  const energia = vig.skills.energía || vig.skills.energia;
  if (!energia) return false;

  const marcial = energia.specialities?.marcial;
  return marcial && marcial.final >= 5;
});

// ✅ Función para colapsar/expandir magia
function toggleMagicCollapse() {
  isMagicCollapsed.value = !isMagicCollapsed.value;
}
</script>

<template>
  <div class="third-page-container">
    <!-- Panel lateral de XP (fixed) -->
    <aside class="xp-sidebar">
      <div class="xp-panel">
        <h3>Experiencia General</h3>
        <div class="xp-info">
          <div class="xp-item">
            <span class="xp-label">XP Total:</span>
            <span class="xp-value">{{ totalXP }}</span>
          </div>
          <div class="xp-item">
            <span class="xp-label">XP Libre:</span>
            <span class="xp-value" :class="{ negative: freeXP < 0 }">
              {{ freeXP }}
            </span>
          </div>
          <div class="xp-item">
            <span class="xp-label">XP Usada:</span>
            <span class="xp-value">{{ usedXP }}</span>
          </div>
        </div>

        <!-- ✅ Sección de Hechicería (solo si hay especialidades > 0) -->
        <div v-if="showMagicXPSection" class="xp-section">
          <h3 class="collapsible-header" @click="toggleMagicCollapse">
            Hechicería
            <span
              class="collapse-icon"
              :class="{ collapsed: isMagicCollapsed }"
            >
              ▼
            </span>
          </h3>
          <transition name="collapse">
            <div v-show="!isMagicCollapsed" class="xp-info">
              <div
                v-for="magic in magicXP"
                :key="magic.code"
                class="xp-item specialty"
              >
                <span class="xp-label">{{ magic.name }}:</span>
                <span class="xp-value">
                  {{ magic.total - (magic.used || 0) }} / {{ magic.total }}
                </span>
              </div>
            </div>
          </transition>
        </div>

        <!-- ✅ Sección de Marcial (solo si martialXP > 0) -->
        <div v-if="showMartialXPSection" class="xp-section">
          <h3>Marcial</h3>
          <div class="xp-info">
            <div class="xp-item specialty">
              <span class="xp-label">Disponible:</span>
              <span class="xp-value">
                {{ martialXP - martialUsed }} / {{ martialXP }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Contenido principal -->
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

      <!-- Marcial -->
      <PowersGeneral
        v-if="showMartialSheet"
        :items="martialStore.martials"
        :assigned-items="characterStore.martials"
        :calculate-x-p="() => characterStore.recalculateAll()"
        name="Marcial"
        xp-affected="martialXP"
        :uses-specialty-xp="true"
      />

      <!-- Magia -->
      <PowersGeneral
        v-if="showMagicSheet"
        :items="spellStore.spells"
        :assigned-items="characterStore.spells"
        :calculate-x-p="() => characterStore.recalculateAll()"
        name="Magia"
        xp-affected="magicXP"
        :uses-specialty-xp="true"
      />
    </div>
  </div>
</template>

<style scoped>
.third-page-container {
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.xp-sidebar {
  position: fixed;
  top: 40vh;
  left: 20px;
  width: 240px;
  height: fit-content;
  z-index: 100;
  max-height: 80vh;
  overflow-y: auto;
}

.xp-panel {
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

.xp-panel h3 {
  font-size: 1.2em;
  color: #4da6ff;
  margin: 0 0 12px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

/* ✅ Header colapsable */
.collapsible-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: color 0.3s ease;
}

.collapsible-header:hover {
  color: #66c2ff;
}

.collapse-icon {
  font-size: 0.8em;
  transition: transform 0.3s ease;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

/* ✅ Animación de colapso */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.xp-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(77, 166, 255, 0.3);
}

.xp-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.xp-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.xp-item.specialty {
  font-size: 0.9em;
  padding: 4px 0;
}

.xp-item:last-child {
  border-bottom: none;
}

.xp-label {
  font-size: 0.95em;
  color: #f5f5f5;
}

.xp-value {
  font-size: 1.05em;
  font-weight: bold;
  color: #4da6ff;
}

.xp-value.negative {
  color: #ff6b6b;
}

.sheet-container {
  flex: 1;
  min-width: 0;
  background: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin-left: 280px;
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

/* Responsive */
@media (max-width: 1024px) {
  .third-page-container {
    flex-direction: column;
  }

  .xp-sidebar {
    position: static;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .sheet-container {
    margin-left: 0;
    max-width: 800px;
    margin: 20px auto;
  }
}
</style>
