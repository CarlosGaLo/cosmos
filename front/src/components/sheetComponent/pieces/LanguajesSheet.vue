<template>
  <section class="framework">
    <HeaderPiece>Idiomas</HeaderPiece>

    <article class="language-container">
      <ol class="list-name column">
        <li v-for="lang in availableLanguages" :key="lang.id">
          <button
            :class="{ selected: isLanguageSelected(lang.id) }"
            @click="toggleLanguage(lang.id, $event)"
          >
            {{ lang.name }}
            <span class="icon" @click.stop="toggleDescription(lang.id)">
              📖
            </span>
          </button>
          <transition name="fade">
            <div
              v-if="lang.showDescription"
              class="description-mobile"
              v-html="lang.description"
            ></div>
          </transition>
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import HeaderPiece from "./HeaderPiece.vue";

const characterStore = useCharacterStore();
const API_URL = process.env.VUE_APP_API_URL;

// Idiomas y descripciones
const LANGUAGE_DESCRIPTIONS = {
  Manarel: "Lengua común de los humanos.",
  Kroakar: "Idioma basado en duros golpes de garganta, propia de los Kordún.",
  Gardel:
    "<h2>Lengua en comunión con la naturaleza</h2><p>Gardel es un idioma cercano al mundo animal, compuesto por palabras elongadas y sin grandes adornos. Su función principal es facilitar la conexión espiritual con la naturaleza.</p><p>Se emplea sobre todo con fines religiosos.</p>",
  Venatar: "Idioma noble de Venatar.",
  Atiria: "Lengua de las tierras de Atiria.",
  Ietabal: "Idioma de Ietabal.",
  Zanet: "Lengua de la especie Zannin.",
};

// ✅ Solo para almacenar datos de la API (sin estado de selección)
const availableLanguages = ref([]);

// ✅ Computed para verificar si un idioma está seleccionado (lee de la store)
const isLanguageSelected = computed(() => {
  return (langId) => {
    return characterStore.character.lang.languages.includes(langId);
  };
});

// Obtener idiomas desde el backend
const fetchLanguages = async () => {
  try {
    const response = await fetch(`${API_URL}/languages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    availableLanguages.value = data.map((lang) => ({
      id: lang.name.toLowerCase(),
      name: lang.name,
      description:
        lang.description ||
        LANGUAGE_DESCRIPTIONS[lang.name] ||
        "Sin descripción",
      proficiency: lang.proficiency,
      showDescription: false,
    }));
  } catch (error) {
    console.error("❌ Error fetching languages:", error);

    // ⚠️ FALLBACK: Usar idiomas predefinidos
    availableLanguages.value = Object.keys(LANGUAGE_DESCRIPTIONS).map(
      (name) => ({
        id: name.toLowerCase(),
        name: name,
        description: LANGUAGE_DESCRIPTIONS[name],
        proficiency: 1,
        showDescription: false,
      })
    );

    console.warn("⚠️ Using fallback languages (frontend only)");
  }
};

onMounted(fetchLanguages);

// ✅ Función para seleccionar/deseleccionar idioma (trabaja directamente con la store)
function toggleLanguage(langId, event) {
  if (event.target.classList.contains("icon")) return;

  const isSelected = characterStore.character.lang.languages.includes(langId);

  if (isSelected) {
    characterStore.removeLanguage(langId);
  } else {
    characterStore.addLanguage(langId);
  }
}

// Función para desplegar/plegar la descripción
function toggleDescription(langId) {
  const lang = availableLanguages.value.find((l) => l.id === langId);
  if (lang) {
    lang.showDescription = !lang.showDescription;
  }
}
</script>

<style scoped>
.framework {
  margin-bottom: 80px;
  text-align: center;
}

.language-container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
}

.list-name {
  text-transform: uppercase;
  text-align: center;
}

.list-name li {
  list-style: none;
}

.list-name li button {
  width: 250px;
  height: 50px;
  margin: 12px 0;
  border: 2px solid var(--color-medium-blue);
  font-family: "FedraSansLight";
  font-size: 18px;
  color: var(--color-dark-blue);
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  transition: all 0.3s ease-in-out;
}

.list-name li button:hover {
  background-color: var(--color-hard-white);
  color: var(--color-dark-blue);
}

.list-name li button.selected {
  background-color: var(--color-medium-blue);
  color: white;
  font-weight: bold;
  border: 2px solid var(--color-dark-blue);
}

.icon {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.2);
}

.description-mobile {
  display: block;
  font-size: 2px;
  font-family: "FedraStdBook";
  color: var(--color-dark-blue);
  margin-top: 8px;
  padding: 5px;
  border-radius: 5px;
  background: var(--color-hard-white);
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.column {
  width: 30%;
}

@media (max-width: 1260px) {
  .hide-1260 {
    display: none;
  }
}

@media (max-width: 768px) {
  .language-container {
    flex-direction: column;
    gap: 15px;
  }

  .column {
    width: 100%;
  }

  .list-name li button {
    width: 100%;
    font-size: 16px;
  }
}

.description-mobile {
  display: block;
  font-family: "FedraStdBook";
  color: var(--color-dark-blue);
  margin-top: 8px;
  padding: 5px;
  border-radius: 5px;
  background: var(--color-hard-white);
}

.description-mobile {
  display: block;
  font-family: "FedraStdBook";
  color: var(--color-dark-blue);
  margin-top: 8px;
  padding: 5px;
  border-radius: 5px;
  background: var(--color-hard-white);
}

/* Aplica a los h2 que estén justo detrás del bloque */
.description-mobile + h2 {
  font-size: 10px;
  margin: 4px 0;
}

/* Aplica a todos los párrafos inyectados después del h2 */
.description-mobile + h2 + p,
.description-mobile + h2 + p + p {
  font-size: 7px;
}
</style>
