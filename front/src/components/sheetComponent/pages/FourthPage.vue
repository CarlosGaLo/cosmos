<script setup>
import { computed, onMounted } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import SaveCharacter from "@/components/Utils/SaveCharacter.vue";
import html2pdf from "html2pdf.js";

const characterStore = useCharacterStore();

// ==================== LISTAS DE ITEMS SELECCIONADOS ====================

// Feats de especie
const specieFeats = computed(() => {
  const allFeats = characterStore.feats || [];

  const filtered = allFeats.filter((f) => {
    const isSpecieFeat = f.group === "especie" || f.type === "especie";
    return isSpecieFeat;
  });

  return filtered;
});

// Competencias seleccionadas
const selectedCompetences = computed(() => {
  const comps = characterStore.competences || [];
  return comps;
});

// Méritos seleccionados (excluyendo feats de especie)
const selectedFeats = computed(() => {
  const allFeats = characterStore.feats || [];

  const filtered = allFeats.filter((f) => {
    const isNotSpecieFeat = f.group !== "especie" && f.type !== "especie";
    return isNotSpecieFeat;
  });

  return filtered;
});

// Defectos seleccionados
const selectedUnfeats = computed(() => {
  const unfeats = characterStore.unfeats || [];

  return unfeats;
});

// Hechizos seleccionados
const selectedSpells = computed(() => {
  const spells = characterStore.spells || [];
  return spells;
});

// Técnicas marciales seleccionadas
const selectedMartials = computed(() => {
  const martials = characterStore.martials || [];
  return martials;
});

// Computed para filtrar campos con valor total > 0
const visibleCamps = computed(() => {
  const camps = {};
  Object.entries(characterStore.character.camp).forEach(([key, camp]) => {
    if (camp && camp.total > 0) {
      camps[key] = camp;
    }
  });
  return camps;
});

// Función para obtener TODAS las habilidades
const getAllSkills = (camp) => {
  if (!camp || !camp.skills) return [];
  return Object.values(camp.skills).filter((skill) => skill);
};

// Función para filtrar especialidades cuyo valor sea distinto a skill.total
const getFilteredSpecialities = (skill) => {
  if (!skill || !skill.specialities) return [];

  const specialitiesArray = Object.values(skill.specialities);

  return specialitiesArray.filter((speciality) => {
    if (!speciality || typeof speciality !== "object") return false;

    const finalValue = speciality.final !== undefined ? speciality.final : 0;

    return finalValue !== skill.total;
  });
};

// Función para obtener el valor final de una especialidad
const getSpecialityValue = (spec) => {
  return spec.final !== undefined ? spec.final : spec.total || 0;
};

// ==================== PDF EXPORT ====================

function downloadPDF() {
  const element = document.getElementById("character-summary");

  const options = {
    margin: [10, 10, 10, 10],
    filename: `${characterStore.character.name || "personaje"}_ficha.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
}
</script>

<template>
  <div class="fourth-page-container">
    <!-- Resumen del personaje -->
    <div id="character-summary" class="character-summary">
      <!-- Información básica -->
      <section class="basic-section">
        <h1 class="character-name">{{ characterStore.character.name }}</h1>
        <div class="basic-grid">
          <div class="info-item">
            <span class="label">Especie:</span>
            <span class="value">{{ characterStore.character.specie }}</span>
          </div>
          <div class="info-item">
            <span class="label">Edad:</span>
            <span class="value">{{ characterStore.character.ageState }}</span>
          </div>
          <div class="info-item">
            <span class="label">Sexo:</span>
            <span class="value">{{ characterStore.character.sex }}</span>
          </div>
        </div>
      </section>

      <!-- Características de especie -->
      <section v-if="specieFeats.length" class="section">
        <h2>Características de Especie ({{ specieFeats.length }})</h2>
        <div class="feats-compact">
          <span v-for="feat in specieFeats" :key="feat.name" class="feat-tag">
            {{ feat.name }}
          </span>
        </div>
      </section>

      <!-- Vida y Energía -->
      <section class="section">
        <h2>Vida y Energía</h2>

        <div class="vida-energia-grid">
          <!-- Vida -->
          <div class="subsection">
            <h3>Vida</h3>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-label">Natural:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.vida
                      ?.specialities?.natural?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.lifeRegen }}</sub>
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Sobrenatural:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.vida
                      ?.specialities?.sobrenatural?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.lifeRegen }}</sub>
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Anímica:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.vida
                      ?.specialities?.animica?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.lifeRegen }}</sub>
                </span>
              </div>
            </div>
          </div>

          <!-- Energía -->
          <div class="subsection">
            <h3>Energía</h3>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-label">Cansancio:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.energia
                      ?.specialities?.cansancio?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.energyRegen }}</sub>
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Maná:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.energia
                      ?.specialities?.mana?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.manaRegen }}</sub>
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Marcial:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.energia
                      ?.specialities?.marcial?.final || 0
                  }}
                  <sub class="regen-sub">+{{ characterStore.energyRegen }}</sub>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Campos, Habilidades y Especialidades -->
      <section v-if="Object.keys(visibleCamps).length" class="section">
        <h2>Campos y Habilidades</h2>

        <div v-for="(camp, key) in visibleCamps" :key="key" class="camp-block">
          <!-- Header del campo -->
          <div class="camp-header">
            <span class="camp-name">{{ camp.name }}</span>
            <span class="camp-value">{{ camp.total }}</span>
          </div>

          <!-- Habilidades (TODAS) -->
          <div v-if="getAllSkills(camp).length" class="skills-container">
            <div
              v-for="skill in getAllSkills(camp)"
              :key="skill.name"
              class="skill-block"
            >
              <!-- Nombre y valor de la habilidad -->
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-value">{{ skill.total }}</span>
              </div>

              <!-- Especialidades filtradas -->
              <div
                v-if="getFilteredSpecialities(skill).length"
                class="specialities-list"
              >
                <div
                  v-for="spec in getFilteredSpecialities(skill)"
                  :key="spec.name"
                  class="speciality-item"
                >
                  <span class="spec-name">{{ spec.name }}:</span>
                  <span class="spec-value">{{ getSpecialityValue(spec) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Idiomas -->
      <section
        v-if="
          characterStore.character.lang.languages &&
          characterStore.character.lang.languages.length
        "
        class="section"
      >
        <h2>Idiomas ({{ characterStore.character.lang.languages.length }})</h2>
        <div class="tags-row">
          <span
            v-for="lang in characterStore.character.lang.languages"
            :key="lang"
            class="tag"
          >
            {{ lang }}
          </span>
        </div>
      </section>

      <!-- Competencias -->
      <section v-if="selectedCompetences.length" class="section">
        <h2>Competencias ({{ selectedCompetences.length }})</h2>
        <div class="items-grid">
          <span
            v-for="comp in selectedCompetences"
            :key="comp.name"
            class="item-badge"
          >
            {{ comp.name }}
            <span class="xp-badge">{{ comp.xp }} XP</span>
          </span>
        </div>
      </section>

      <!-- Méritos -->
      <section v-if="selectedFeats.length" class="section">
        <h2>Méritos ({{ selectedFeats.length }})</h2>
        <div class="items-grid">
          <span
            v-for="feat in selectedFeats"
            :key="feat.name"
            class="item-badge merit"
          >
            {{ feat.name }}
            <span class="xp-badge">{{ feat.xp }} XP</span>
          </span>
        </div>
      </section>

      <!-- Defectos -->
      <section v-if="selectedUnfeats.length" class="section">
        <h2>Defectos ({{ selectedUnfeats.length }})</h2>
        <div class="items-grid">
          <span
            v-for="unfeat in selectedUnfeats"
            :key="unfeat.name"
            class="item-badge flaw"
          >
            {{ unfeat.name }}
            <span class="xp-badge">{{ unfeat.xp }} XP</span>
          </span>
        </div>
      </section>

      <!-- Hechizos -->
      <section v-if="selectedSpells.length" class="section">
        <h2>Hechizos ({{ selectedSpells.length }})</h2>
        <div class="spells-grid">
          <div
            v-for="spell in selectedSpells"
            :key="spell.name"
            class="spell-card"
          >
            <div class="spell-header">
              <strong class="spell-name">{{ spell.name }}</strong>
              <span class="spell-level">Nv.{{ spell.lvl }}</span>
            </div>
            <div class="spell-stats">
              <span>Maná: {{ spell.manaCost }}</span>
              <span>Umbral: {{ spell.threshold }}</span>
              <span class="xp-badge">{{ spell.xp }} XP</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Técnicas Marciales -->
      <section v-if="selectedMartials.length" class="section">
        <h2>Técnicas Marciales ({{ selectedMartials.length }})</h2>
        <div class="items-grid">
          <span
            v-for="martial in selectedMartials"
            :key="martial.name"
            class="item-badge martial"
          >
            {{ martial.name }}
            <span class="xp-badge">{{ martial.xp }} XP</span>
          </span>
        </div>
      </section>

      <!-- Experiencia -->
      <section class="section">
        <h2>Experiencia</h2>
        <div class="inline-grid">
          <span class="inline-item"
            >XP Libre:
            <strong>{{ characterStore.metaData.freeXP }}</strong></span
          >
          <span class="inline-item"
            >XP Usada:
            <strong>{{ characterStore.metaData.usedXP }}</strong></span
          >
          <span class="inline-item"
            >XP Competencias:
            <strong>{{ characterStore.metaData.competencesXP }}</strong></span
          >
          <span class="inline-item"
            >XP Méritos:
            <strong>{{ characterStore.metaData.featXP }}</strong></span
          >
        </div>
      </section>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <button @click="downloadPDF" class="action-btn download">
        📥 Descargar PDF
      </button>
      <SaveCharacter />
    </div>
  </div>
</template>

<style scoped>
/* ==================== DEBUG SECTION ==================== */
.debug-section {
  background: #fff3cd;
  border: 2px solid #ffc107;
  padding: 15px;
  border-radius: 8px;
}

.debug-info {
  font-family: monospace;
  font-size: 0.9em;
}

.debug-info p {
  margin: 5px 0;
  color: #856404;
}

/* ==================== CONTENEDOR PRINCIPAL ==================== */
.fourth-page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* ==================== RESUMEN DEL PERSONAJE ==================== */
.character-summary {
  background: #ffffff;
  padding: 28px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: "FedraStdBook", Arial, sans-serif;
}

/* ==================== NOMBRE DEL PERSONAJE ==================== */
.character-name {
  font-size: 2em;
  text-align: center;
  color: #1a2332;
  margin-bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 3px solid #3b5998;
  padding-bottom: 10px;
  font-weight: 700;
}

/* ==================== SECCIÓN BÁSICA ==================== */
.basic-section {
  margin-bottom: 22px;
}

.basic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 9px 13px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3b5998;
}

.info-item .label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9em;
}

.info-item .value {
  color: #1a2332;
  font-weight: 600;
  font-size: 0.9em;
}

/* ==================== SECCIONES ==================== */
.section {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid #dee2e6;
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  font-size: 1.25em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
  padding-bottom: 5px;
  border-bottom: 2px solid #3b5998;
}

/* ==================== FEATS COMPACTOS ==================== */
.feats-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.feat-tag {
  padding: 5px 12px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 14px;
  font-size: 0.85em;
  font-weight: 600;
  border: 1px solid #90caf9;
}

/* ==================== VIDA Y ENERGÍA ==================== */
.vida-energia-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.subsection {
  background: #f8f9fa;
  padding: 13px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.subsection h3 {
  font-size: 1em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 4px;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.stat-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.88em;
}

.stat-value {
  font-weight: 700;
  color: #1a2332;
  font-size: 1em;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.regen-sub {
  font-size: 0.72em;
  color: #3b5998;
  font-weight: 600;
  margin-left: 2px;
}

/* ==================== CAMPOS Y HABILIDADES ==================== */
.camp-block {
  margin-bottom: 18px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 13px;
  border-left: 4px solid #3b5998;
}

.camp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 7px;
  border-bottom: 2px solid #dee2e6;
}

.camp-name {
  font-size: 1.1em;
  font-weight: 700;
  color: #1a2332;
}

.camp-value {
  font-size: 1.2em;
  font-weight: 700;
  color: #3b5998;
  background: #ffffff;
  padding: 3px 10px;
  border-radius: 8px;
  border: 2px solid #3b5998;
}

/* ==================== HABILIDADES ==================== */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-block {
  background: #ffffff;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}

.skill-name {
  font-size: 0.95em;
  font-weight: 600;
  color: #1a2332;
}

.skill-value {
  font-size: 1em;
  font-weight: 700;
  color: #3b5998;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #90caf9;
}

/* ==================== ESPECIALIDADES ==================== */
.specialities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 7px;
  padding-left: 12px;
}

.speciality-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-size: 0.83em;
}

.spec-name {
  color: #2c3e50;
  font-weight: 600;
}

.spec-value {
  color: #1a2332;
  font-weight: 700;
}

/* ==================== INLINE GRID ==================== */
.inline-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
}

.inline-item {
  font-size: 0.88em;
  color: #2c3e50;
  font-weight: 500;
}

.inline-item strong {
  color: #1a2332;
  font-weight: 700;
}

/* ==================== TAGS ROW ==================== */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.tag {
  padding: 5px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #1a2332;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

/* ==================== ITEMS GRID (Competencias, Méritos, Defectos) ==================== */
.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 14px;
  font-size: 0.85em;
  font-weight: 600;
  border: 1px solid #90caf9;
}

.item-badge.merit {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #a5d6a7;
}

.item-badge.flaw {
  background: #ffebee;
  color: #c62828;
  border-color: #ef9a9a;
}

.item-badge.martial {
  background: #fff3e0;
  color: #e65100;
  border-color: #ffcc80;
}

.xp-badge {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 700;
}

/* ==================== SPELLS GRID ==================== */
.spells-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
}

.spell-card {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  border-left: 3px solid #7e57c2;
}

.spell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.spell-name {
  font-size: 0.9em;
  color: #1a2332;
  font-weight: 700;
}

.spell-level {
  background: #7e57c2;
  color: #ffffff;
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 0.8em;
  font-weight: 700;
}

.spell-stats {
  display: flex;
  gap: 8px;
  font-size: 0.8em;
  color: #2c3e50;
  font-weight: 600;
  flex-wrap: wrap;
}

/* ==================== BOTONES DE ACCIÓN ==================== */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 13px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 0.98em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "FedraStdBook", Arial, sans-serif;
}

.action-btn.download {
  background: #3b5998;
  color: #ffffff;
}

.action-btn.download:hover {
  background: #2d4373;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .character-summary {
    padding: 18px;
  }

  .character-name {
    font-size: 1.5em;
  }

  .basic-grid {
    grid-template-columns: 1fr;
  }

  .vida-energia-grid {
    grid-template-columns: 1fr;
  }

  .inline-grid {
    flex-direction: column;
    gap: 7px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .spells-grid {
    grid-template-columns: 1fr;
  }
}

/* ==================== ESTILOS PARA IMPRESIÓN/PDF ==================== */
@media print {
  .action-buttons {
    display: none !important;
  }

  .debug-section {
    display: none !important;
  }

  .character-summary {
    box-shadow: none;
    padding: 13px;
  }

  .section {
    page-break-inside: avoid;
  }

  .camp-block {
    page-break-inside: avoid;
  }

  .spell-card {
    page-break-inside: avoid;
  }
}
</style>
