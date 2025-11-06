<script setup>
import { computed } from "vue";
import { characterFunctions } from "@/store/characterSheet";
import SaveCharacter from "@/components/Utils/SaveCharacter.vue";
import html2pdf from "html2pdf.js";

const characterStore = characterFunctions();

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

// Función para filtrar habilidades cuyo valor sea distinto a camp.total * 2
const getFilteredSkills = (camp) => {
  if (!camp || !camp.skills) return [];

  const expectedValue = camp.total * 2;

  return Object.values(camp.skills).filter((skill) => {
    // Mostrar si el total es diferente del valor esperado (campo * 2)
    return skill && skill.total !== expectedValue;
  });
};

// Función para filtrar especialidades cuyo valor sea distinto a skill.total
const getFilteredSpecialities = (skill) => {
  if (!skill || !skill.specialities) return [];

  const specialitiesArray = Object.values(skill.specialities);

  return specialitiesArray.filter((speciality) => {
    if (!speciality || typeof speciality !== "object") return false;

    // Obtener el valor final de la especialidad
    const finalValue = speciality.final !== undefined ? speciality.final : 0;

    // Mostrar si el valor final es diferente del total de la habilidad
    return finalValue !== skill.total;
  });
};

// Computed para feats de especie
const specieFeats = computed(() => characterStore.feats || []);

// Función para descargar PDF
const downloadPDF = () => {
  const element = document.getElementById("character-summary");

  const options = {
    margin: [10, 10, 10, 10],
    filename: `${characterStore.character.name || "personaje"}_ficha.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
};
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
            <span class="value"
              >{{ characterStore.character.age }} ({{
                characterStore.character.ageState
              }})</span
            >
          </div>
          <div class="info-item">
            <span class="label">Sexo:</span>
            <span class="value">{{ characterStore.character.sex }}</span>
          </div>
        </div>
      </section>

      <!-- Características de especie -->
      <section v-if="specieFeats.length" class="section">
        <h2>Características de Especie</h2>
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
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.life }}</sub
                  >
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Sobrenatural:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.vida
                      ?.specialities?.sobrenatural?.final || 0
                  }}
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.life }}</sub
                  >
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Anímica:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.vida
                      ?.specialities?.animica?.final || 0
                  }}
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.life }}</sub
                  >
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
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.energy }}</sub
                  >
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Maná:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.energia
                      ?.specialities?.mana?.final || 0
                  }}
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.mana }}</sub
                  >
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Marcial:</span>
                <span class="stat-value">
                  {{
                    characterStore.character.camp.vig?.skills?.energia
                      ?.specialities?.marcial?.final || 0
                  }}
                  <sub class="regen-sub"
                    >+{{ characterStore.character.regen.energy }}</sub
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Campos, Habilidades y Especialidades -->
      <section v-if="Object.keys(visibleCamps).length" class="section">
        <h2>Campos y Habilidades</h2>
        <div
          v-for="(camp, key) in visibleCamps"
          :key="key"
          class="camp-compact"
        >
          <div class="camp-header">
            <strong>{{ camp.name }}</strong>
            <span class="value-tag">{{ camp.total }}</span>
          </div>

          <!-- Habilidades filtradas -->
          <div v-if="getFilteredSkills(camp).length" class="skills-compact">
            <div
              v-for="skill in getFilteredSkills(camp)"
              :key="skill.name"
              class="skill-line"
            >
              <span class="skill-name">{{ skill.name }}:</span>
              <span class="value-tag">{{ skill.total }}</span>

              <!-- Especialidades filtradas -->
              <span
                v-if="getFilteredSpecialities(skill).length"
                class="specialities-inline"
              >
                <span
                  v-for="spec in getFilteredSpecialities(skill)"
                  :key="spec.name"
                  class="spec-mini"
                >
                  {{ spec.name }}: {{ getSpecialityValue(spec) }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Idiomas -->
      <section
        v-if="characterStore.languages && characterStore.languages.length"
        class="section"
      >
        <h2>Idiomas</h2>
        <div class="tags-row">
          <span
            v-for="lang in characterStore.languages"
            :key="lang"
            class="tag"
          >
            {{ lang }}
          </span>
        </div>
      </section>

      <!-- Competencias -->
      <section
        v-if="characterStore.competences && characterStore.competences.length"
        class="section"
      >
        <h2>Competencias</h2>
        <ul class="compact-list">
          <li v-for="comp in characterStore.competences" :key="comp.name">
            {{ comp.name }} <span class="xp-mini">({{ comp.xp }} XP)</span>
          </li>
        </ul>
      </section>

      <!-- Méritos -->
      <section
        v-if="characterStore.feats && characterStore.feats.length"
        class="section"
      >
        <h2>Méritos</h2>
        <ul class="compact-list">
          <li v-for="feat in characterStore.feats" :key="feat.name">
            {{ feat.name }} <span class="xp-mini">({{ feat.xp }} XP)</span>
          </li>
        </ul>
      </section>

      <!-- Defectos -->
      <section
        v-if="characterStore.unfeats && characterStore.unfeats.length"
        class="section"
      >
        <h2>Defectos</h2>
        <ul class="compact-list">
          <li v-for="unfeat in characterStore.unfeats" :key="unfeat.name">
            {{ unfeat.name }} <span class="xp-mini">({{ unfeat.xp }} XP)</span>
          </li>
        </ul>
      </section>

      <!-- Hechizos -->
      <section
        v-if="characterStore.spells && characterStore.spells.length"
        class="section"
      >
        <h2>Hechizos</h2>
        <ul class="compact-list">
          <li v-for="spell in characterStore.spells" :key="spell.name">
            <strong>{{ spell.name }}</strong> (Nv.{{ spell.lvl }})
            <span class="spell-mini"
              >Maná: {{ spell.manaCost }} | Umbral: {{ spell.threshold }} |
              {{ spell.xp }} XP</span
            >
          </li>
        </ul>
      </section>

      <!-- Técnicas Marciales -->
      <section
        v-if="characterStore.martials && characterStore.martials.length"
        class="section"
      >
        <h2>Técnicas Marciales</h2>
        <ul class="compact-list">
          <li v-for="martial in characterStore.martials" :key="martial.name">
            {{ martial.name }}
            <span class="xp-mini">({{ martial.xp }} XP)</span>
          </li>
        </ul>
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
/* Contenedor principal */
.fourth-page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Resumen del personaje */
.character-summary {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "FedraStdBook", Arial, sans-serif;
}

/* Nombre del personaje */
.character-name {
  font-size: 2em;
  text-align: center;
  color: var(--color-dark-blue);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--color-medium-blue);
  padding-bottom: 10px;
}

/* Sección básica */
.basic-section {
  margin-bottom: 20px;
}

.basic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.info-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.info-item .label {
  font-weight: 600;
  color: var(--color-medium-grey);
}

.info-item .value {
  color: var(--color-dark-blue);
}

/* Secciones */
.section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-light-grey);
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  font-size: 1.3em;
  color: var(--color-medium-blue);
  margin-bottom: 10px;
  font-weight: 600;
}

/* Feats compactos */
.feats-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feat-tag {
  padding: 4px 12px;
  background: var(--color-light-blue);
  color: var(--color-dark-blue);
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 500;
}

/* Grid inline */
.inline-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.inline-item {
  font-size: 0.95em;
  color: var(--color-medium-grey);
}

.inline-item strong {
  color: var(--color-dark-blue);
  font-weight: 600;
}

/* Campos compactos */
.camp-compact {
  margin-bottom: 15px;
}

.camp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
  color: var(--color-dark-blue);
  margin-bottom: 8px;
  padding: 5px 0;
  border-bottom: 1px solid var(--color-light-grey);
}

.value-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--color-medium-blue);
  color: white;
  border-radius: 10px;
  font-size: 0.85em;
  font-weight: 600;
}

/* Habilidades compactas */
.skills-compact {
  margin-left: 15px;
}

.skill-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 0.95em;
}

.skill-name {
  font-weight: 500;
  color: var(--color-dark-blue);
  min-width: 120px;
}

/* Especialidades inline */
.specialities-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: 10px;
}

.spec-mini {
  padding: 2px 8px;
  background: var(--color-light-grey);
  color: var(--color-dark-blue);
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 500;
}

/* Tags row */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: var(--color-light-white);
  border: 1px solid var(--color-light-grey);
  color: var(--color-dark-blue);
  border-radius: 12px;
  font-size: 0.9em;
}

/* Lista compacta */
.compact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.compact-list li {
  padding: 4px 0;
  padding-left: 15px;
  position: relative;
  font-size: 0.95em;
  color: var(--color-dark-blue);
}

.compact-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-medium-blue);
  font-weight: bold;
}

.xp-mini {
  font-size: 0.85em;
  color: var(--color-medium-grey);
  font-weight: normal;
}

.spell-mini {
  font-size: 0.85em;
  color: var(--color-medium-grey);
  font-weight: normal;
  margin-left: 5px;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "FedraStdBook", Arial, sans-serif;
}

.action-btn.download {
  background: var(--color-medium-blue);
  color: white;
}

.action-btn.download:hover {
  background: var(--color-dark-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .character-summary {
    padding: 15px;
  }

  .character-name {
    font-size: 1.5em;
  }

  .basic-grid {
    grid-template-columns: 1fr;
  }

  .inline-grid {
    flex-direction: column;
    gap: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

/* Vida y Energía */
.vida-energia-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.subsection {
  background: var(--color-light-white);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--color-light-grey);
}

.subsection h3 {
  font-size: 1.1em;
  color: var(--color-medium-blue);
  margin-bottom: 12px;
  font-weight: 600;
  border-bottom: 2px solid var(--color-light-grey);
  padding-bottom: 5px;
}

.stats-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid var(--color-light-grey);
}

.stat-label {
  font-weight: 500;
  color: var(--color-medium-grey);
  font-size: 0.95em;
}

.stat-value {
  font-weight: 600;
  color: var(--color-dark-blue);
  font-size: 1.1em;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.regen-sub {
  font-size: 0.75em;
  color: var(--color-medium-blue);
  font-weight: 500;
  margin-left: 2px;
}

/* Responsive para vida y energía */
@media (max-width: 768px) {
  .vida-energia-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos para impresión/PDF */
@media print {
  .action-buttons {
    display: none !important;
  }

  .character-summary {
    box-shadow: none;
    padding: 15px;
  }

  .section {
    page-break-inside: avoid;
  }

  .camp-compact {
    page-break-inside: avoid;
  }
}
</style>
