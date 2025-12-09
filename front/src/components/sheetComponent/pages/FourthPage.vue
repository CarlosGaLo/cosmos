<script setup>
import { computed, ref } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import html2pdf from "html2pdf.js";
import { useUserStore } from "@/store/userStore";
import { useCharacterSheetStore } from "@/store/characterSheetDB";

const characterStore = useCharacterStore();
const userStore = useUserStore();
const sheetStore = useCharacterSheetStore();

// Feats de especie
const specieFeats = computed(() => {
  const allFeats = characterStore.feats || [];
  return allFeats.filter((f) => f.group === "especie" || f.type === "especie");
});

// Competencias, Méritos, Defectos
const selectedCompetences = computed(() => characterStore.competences || []);
const selectedFeats = computed(() => {
  const allFeats = characterStore.feats || [];
  return allFeats.filter((f) => f.group !== "especie" && f.type !== "especie");
});
const selectedUnfeats = computed(() => characterStore.unfeats || []);
const selectedSpells = computed(() => characterStore.spells || []);
const selectedMartials = computed(() => characterStore.martials || []);

// TODOS los campos
const allCamps = computed(() => {
  return characterStore.character.camp || {};
});

// TODAS las habilidades del campo
const getAllSkills = (camp) => {
  if (!camp || !camp.skills) return [];
  return Object.values(camp.skills).filter((skill) => skill);
};

// Especialidades filtradas
const getFilteredSpecialities = (skill) => {
  if (!skill || !skill.specialities) return [];

  return Object.values(skill.specialities).filter((spec) => {
    if (!spec || typeof spec !== "object") return false;
    const finalValue = spec.final !== undefined ? spec.final : 0;
    return finalValue !== skill.total;
  });
};

const getSpecialityValue = (spec) => {
  return spec.final !== undefined ? spec.final : spec.total || 0;
};

// Verificar si tiene magia o marcial
const hasMagic = computed(() => selectedSpells.value.length > 0);
const hasMartial = computed(() => selectedMartials.value.length > 0);

// Función para descargar PDF
function downloadPDF() {
  const element = document.getElementById("character-pdf-export");

  const options = {
    margin: 0,
    filename: `${characterStore.character.name || "personaje"}_ficha.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: { mode: "avoid-all" },
  };

  html2pdf().set(options).from(element).save();
}

// GUARDAR FICHA
const saving = ref(false);
const saveSuccess = ref(false);
const saveError = ref(null);

const isAuthenticated = computed(() => userStore.isAuthenticated);

async function saveCharacter() {
  if (!isAuthenticated.value) {
    router.push("/login");
    return;
  }

  saving.value = true;
  saveSuccess.value = false;
  saveError.value = null;

  try {
    await sheetStore.saveCurrentCharacterSheet();
    saveSuccess.value = true;
    setTimeout(() => (saveSuccess.value = false), 3000);
  } catch (error) {
    saveError.value = error.response?.data?.message || "Error al guardar";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="fifth-page-container">
    <!-- Botón de descarga PDF -->
    <div class="download-button-container">
      <button @click="downloadPDF" class="download-pdf-btn">
        📥 Descargar PDF
      </button>
    </div>

    <div id="character-pdf-export" class="pdf-page">
      <!-- HEADER ULTRA COMPACTO -->
      <header class="pdf-header">
        <div class="title-line">
          <h1>{{ characterStore.character.name }}</h1>
          <div class="xp-inline">
            <span
              >XP Libre: <b>{{ characterStore.metaData.freeXP }}</b></span
            >
            <span
              >XP Usada: <b>{{ characterStore.metaData.usedXP }}</b></span
            >
            <span
              >Comp: <b>{{ characterStore.metaData.competencesXP }}</b></span
            >
            <span
              >Méritos: <b>{{ characterStore.metaData.featXP }}</b></span
            >
          </div>
        </div>
        <div class="header-meta">
          <span>{{ characterStore.character.specie }}</span> •
          <span>{{ characterStore.character.ageState }}</span> •
          <span>{{ characterStore.character.sex }}</span>
        </div>
      </header>

      <!-- VIDA Y ENERGÍA - HORIZONTAL COMPACTO -->
      <section class="vida-energia-horizontal">
        <div class="vida-group">
          <strong>VIDA</strong>
          <div class="stat-inline">
            <span>Nat:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.vida?.specialities
                ?.natural?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.lifeRegen }}</small
            >
          </div>
          <div class="stat-inline">
            <span>Sob:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.vida?.specialities
                ?.sobrenatural?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.lifeRegen }}</small
            >
          </div>
          <div class="stat-inline">
            <span>Aní:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.vida?.specialities
                ?.animica?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.lifeRegen }}</small
            >
          </div>
        </div>

        <div class="energia-group">
          <strong>ENERGÍA</strong>
          <div class="stat-inline">
            <span>Can:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.energia?.specialities
                ?.cansancio?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.energyRegen }}</small
            >
          </div>
          <div class="stat-inline">
            <span>Man:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.energia?.specialities
                ?.mana?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.manaRegen }}</small
            >
          </div>
          <div class="stat-inline">
            <span>Mar:</span
            ><b>{{
              characterStore.character.camp.vig?.skills?.energia?.specialities
                ?.marcial?.final || 0
            }}</b
            ><input type="text" class="box" /><small
              >+{{ characterStore.energyRegen }}</small
            >
          </div>
        </div>
      </section>

      <!-- SECCIÓN PRINCIPAL: 2/3 PARA CAMPOS -->
      <div class="main-content">
        <!-- CAMPOS Y HABILIDADES - 2 COLUMNAS, ALTURA AUTOMÁTICA -->
        <section class="campos-section">
          <h2>CAMPOS Y HABILIDADES</h2>
          <div class="campos-grid">
            <div v-for="(camp, key) in allCamps" :key="key" class="camp-block">
              <div class="camp-header">
                <strong>{{ camp.name }}</strong>
                <span class="total">{{ camp.total }}</span>
              </div>

              <div class="skills-list">
                <div
                  v-for="skill in getAllSkills(camp)"
                  :key="skill.name"
                  class="skill-row"
                >
                  <div class="skill-main">
                    <span class="skill-name">{{ skill.name }}</span>
                    <b class="skill-val">{{ skill.total }}</b>
                  </div>

                  <div
                    v-if="getFilteredSpecialities(skill).length"
                    class="specs-wrap"
                  >
                    <span
                      v-for="spec in getFilteredSpecialities(skill)"
                      :key="spec.name"
                      class="spec-tag"
                    >
                      {{ spec.name.substring(0, 3) }}:
                      {{ getSpecialityValue(spec) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- RASGOS Y PODERES - 1/3 RESTANTE, DINÁMICO -->
        <aside class="traits-section">
          <!-- Características de Especie -->
          <div v-if="specieFeats.length" class="trait-block">
            <h3>Especie ({{ specieFeats.length }})</h3>
            <div class="trait-tags">
              <span
                v-for="feat in specieFeats"
                :key="feat.name"
                class="trait-tag"
                >{{ feat.name }}</span
              >
            </div>
          </div>

          <!-- Idiomas -->
          <div
            v-if="characterStore.character.lang.languages?.length"
            class="trait-block"
          >
            <h3>
              Idiomas ({{ characterStore.character.lang.languages.length }})
            </h3>
            <div class="trait-tags">
              <span
                v-for="lang in characterStore.character.lang.languages"
                :key="lang"
                class="trait-tag"
                >{{ lang }}</span
              >
            </div>
          </div>

          <!-- Competencias -->
          <div v-if="selectedCompetences.length" class="trait-block">
            <h3>Competencias ({{ selectedCompetences.length }})</h3>
            <div class="trait-list">
              <div
                v-for="comp in selectedCompetences"
                :key="comp.name"
                class="trait-item"
              >
                {{ comp.name }} <small>{{ comp.xp }}</small>
              </div>
            </div>
          </div>

          <!-- Méritos -->
          <div v-if="selectedFeats.length" class="trait-block">
            <h3>Méritos ({{ selectedFeats.length }})</h3>
            <div class="trait-list">
              <div
                v-for="feat in selectedFeats"
                :key="feat.name"
                class="trait-item merit"
              >
                {{ feat.name }} <small>{{ feat.xp }}</small>
              </div>
            </div>
          </div>

          <!-- Defectos -->
          <div v-if="selectedUnfeats.length" class="trait-block">
            <h3>Defectos ({{ selectedUnfeats.length }})</h3>
            <div class="trait-list">
              <div
                v-for="unfeat in selectedUnfeats"
                :key="unfeat.name"
                class="trait-item flaw"
              >
                {{ unfeat.name }} <small>{{ unfeat.xp }}</small>
              </div>
            </div>
          </div>

          <!-- Hechizos (solo si tiene) -->
          <div v-if="hasMagic" class="trait-block">
            <h3>Hechizos ({{ selectedSpells.length }})</h3>
            <div class="spell-list">
              <div
                v-for="spell in selectedSpells"
                :key="spell.name"
                class="spell-item"
              >
                <strong>{{ spell.name }}</strong>
                <div class="spell-stats">
                  <span>Nv{{ spell.lvl }}</span>
                  <span>M{{ spell.manaCost }}</span>
                  <span>U{{ spell.threshold }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Técnicas Marciales (solo si tiene) -->
          <div v-if="hasMartial" class="trait-block">
            <h3>Marcial ({{ selectedMartials.length }})</h3>
            <div class="trait-list">
              <div
                v-for="martial in selectedMartials"
                :key="martial.name"
                class="trait-item martial"
              >
                {{ martial.name }} <small>{{ martial.xp }}</small>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    <div class="save-section">
      <button
        @click="saveCharacter"
        :disabled="saving || !isAuthenticated"
        class="save-btn"
      >
        {{ saving ? "Guardando..." : "Guardar Ficha" }}
      </button>
      <p v-if="!isAuthenticated" class="warning">
        Debes iniciar sesión para guardar fichas
      </p>
      <p v-if="saveSuccess" class="success">✅ Ficha guardada correctamente</p>
      <p v-if="saveError" class="error">❌ {{ saveError }}</p>
    </div>
  </div>
</template>

<style scoped>
/* ==================== BOTÓN DE DESCARGA ==================== */
.download-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.download-pdf-btn {
  padding: 12px 30px;
  background: #3b5998;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 89, 152, 0.3);
  font-family: "Arial", sans-serif;
}

.download-pdf-btn:hover {
  background: #2d4373;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 89, 152, 0.4);
}

.download-pdf-btn:active {
  transform: translateY(0);
}

/* ==================== PÁGINA A4 EXACTA ==================== */
.fifth-page-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
}

.pdf-page {
  width: 210mm;
  height: 297mm;
  background: white;
  padding: 8mm;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  font-size: 7pt;
  line-height: 1.2;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ==================== HEADER CON XP VISIBLE ==================== */
.pdf-header {
  border-bottom: 2px solid #000;
  padding-bottom: 2mm;
  margin-bottom: 2mm;
}

.title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1mm;
}

.pdf-header h1 {
  font-size: 16pt;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.xp-inline {
  display: flex;
  gap: 3mm;
  font-size: 7pt;
  background: #f0f0f0;
  padding: 1mm 2mm;
  border-radius: 1mm;
  border: 1px solid #999;
}

.xp-inline span {
  white-space: nowrap;
}

.xp-inline b {
  font-weight: 700;
  color: #000;
}

.header-meta {
  font-size: 8pt;
  color: #333;
}

/* ==================== VIDA Y ENERGÍA HORIZONTAL ==================== */
.vida-energia-horizontal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3mm;
  margin-bottom: 2mm;
  padding: 2mm;
  background: #f0f0f0;
  border: 1px solid #999;
  border-radius: 2mm;
}

.vida-group strong,
.energia-group strong {
  display: block;
  font-size: 8pt;
  font-weight: 700;
  margin-bottom: 1mm;
  text-transform: uppercase;
}

.stat-inline {
  display: flex;
  align-items: center;
  gap: 2mm;
  margin-bottom: 1mm;
  font-size: 7pt;
}

.stat-inline span {
  min-width: 8mm;
  font-weight: 600;
}

.stat-inline b {
  font-weight: 700;
  min-width: 6mm;
  text-align: center;
}

.stat-inline .box {
  width: 10mm;
  height: 4mm;
  border: 1px solid #666;
  text-align: center;
  font-size: 7pt;
  padding: 0;
}

.stat-inline small {
  font-size: 6pt;
  color: #3b5998;
  font-weight: 600;
}

/* ==================== CONTENIDO PRINCIPAL: 2/3 vs 1/3 ==================== */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3mm;
  overflow: hidden;
}

/* ==================== CAMPOS Y HABILIDADES (2/3) ==================== */
.campos-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.campos-section h2 {
  font-size: 9pt;
  font-weight: 700;
  margin: 0 0 2mm 0;
  padding-bottom: 1mm;
  border-bottom: 2px solid #000;
  text-transform: uppercase;
}

.campos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2mm;
  overflow: hidden;
}

.camp-block {
  background: #e8f4f8;
  border: 1.5px solid #3b5998;
  border-radius: 2mm;
  padding: 1.5mm;
  display: flex;
  flex-direction: column;
}

.camp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1mm 2mm;
  background: #3b5998;
  color: white;
  border-radius: 1mm;
  margin-bottom: 1mm;
}

.camp-header strong {
  font-size: 7.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.camp-header .total {
  background: white;
  color: #3b5998;
  padding: 0.5mm 2mm;
  border-radius: 2mm;
  font-weight: 700;
  font-size: 8pt;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 0.5mm;
}

.skill-row {
  background: white;
  border-radius: 1mm;
  padding: 1mm;
}

.skill-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 6.5pt;
  margin-bottom: 0.5mm;
}

.skill-name {
  font-weight: 600;
  flex: 1;
}

.skill-val {
  font-weight: 700;
  color: #3b5998;
  font-size: 7.5pt;
  min-width: 8mm;
  text-align: right;
}

.specs-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1mm;
}

.spec-tag {
  font-size: 5.5pt;
  background: #e0e0e0;
  padding: 0.5mm 1mm;
  border-radius: 1mm;
  white-space: nowrap;
}

/* ==================== RASGOS Y PODERES (1/3, DINÁMICO) ==================== */
.traits-section {
  display: flex;
  flex-direction: column;
  gap: 2mm;
  overflow: hidden;
  border-left: 1px solid #ccc;
  padding-left: 2mm;
}

.trait-block {
  padding: 1.5mm;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 1mm;
}

.trait-block h3 {
  font-size: 7pt;
  font-weight: 700;
  margin: 0 0 1mm 0;
  padding-bottom: 0.5mm;
  border-bottom: 1px solid #bbb;
  text-transform: uppercase;
}

.trait-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1mm;
}

.trait-tag {
  font-size: 6pt;
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.5mm 1.5mm;
  border-radius: 1mm;
  border: 0.5px solid #90caf9;
}

.trait-list {
  display: flex;
  flex-direction: column;
  gap: 0.5mm;
}

.trait-item {
  display: flex;
  justify-content: space-between;
  font-size: 6pt;
  padding: 0.5mm 1mm;
  background: #e3f2fd;
  border-radius: 1mm;
  border: 0.5px solid #90caf9;
}

.trait-item.merit {
  background: #e8f5e9;
  border-color: #a5d6a7;
}

.trait-item.flaw {
  background: #ffebee;
  border-color: #ef9a9a;
}

.trait-item.martial {
  background: #fff3e0;
  border-color: #ffcc80;
}

.trait-item small {
  font-weight: 700;
  color: #555;
}

.spell-list {
  display: flex;
  flex-direction: column;
  gap: 1mm;
}

.spell-item {
  background: #f3e5f5;
  border: 0.5px solid #ce93d8;
  padding: 1mm;
  border-radius: 1mm;
}

.spell-item strong {
  font-size: 6.5pt;
  color: #6a1b9a;
  display: block;
  margin-bottom: 0.5mm;
}

.spell-stats {
  display: flex;
  gap: 1mm;
  font-size: 5.5pt;
}

.spell-stats span {
  background: white;
  padding: 0.5mm 1mm;
  border-radius: 1mm;
}

/* ==================== PRINT ==================== */
@media print {
  .fifth-page-container {
    padding: 0;
    background: white;
  }

  .download-button-container {
    display: none;
  }

  .pdf-page {
    box-shadow: none;
    page-break-after: always;
  }

  .box {
    border: 1px solid #000 !important;
  }
}
.save-section {
  margin: 40px 0;
  text-align: center;
}

.save-btn {
  padding: 16px 32px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.warning {
  color: #ff9800;
  margin-top: 10px;
}
.success {
  color: #4caf50;
  margin-top: 10px;
}
.error {
  color: #f44336;
  margin-top: 10px;
}
</style>
