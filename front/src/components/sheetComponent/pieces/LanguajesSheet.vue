<template>
  <section class="framework">
    <HeaderPiece>Idiomas</HeaderPiece>

    <article class="language-container">
      <ol class="list-name column">
        <li v-for="lang in languages" :key="lang.id">
          <button
            :class="{ selected: lang.selected }"
            @click="toggleLanguage(lang.id, $event)"
          >
            {{ lang.name }}
            <span class="icon" @click.stop="toggleDescription(lang.id)">
              📖
            </span>
          </button>
          <!-- Descripción desplegable -->
          <transition name="fade">
            <p v-if="lang.showDescription" class="description-mobile">
              <b>{{ lang.name }}:</b> {{ lang.description }}
            </p>
          </transition>
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import HeaderPiece from "../../sheetComponent/pieces/HeaderPiece.vue";
import { characterFunctions } from "../../../store/characterSheet.js";

// Lista de idiomas
const languages = ref([]);

// Obtener idiomas desde el backend
const fetchLanguages = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/languages");
    languages.value = response.data.map((lang) => ({
      id: lang.name.toLowerCase(),
      name: lang.name,
      description: lang.description,
      proficiency: lang.proficiency,
      selected: false,
      showDescription: false,
    }));
  } catch (error) {
    console.error("Error al obtener los idiomas:", error);
  }
};

// Llamar a la API cuando el componente se monte
onMounted(fetchLanguages);

// Función para seleccionar/deseleccionar idioma
function toggleLanguage(langId, event) {
  if (event.target.classList.contains("icon")) return;
  const lang = languages.value.find((l) => l.id === langId);
  if (lang) {
    lang.selected = !lang.selected;

    if (lang.selected) {
      characterFunctions().getLanguages.push(langId);
    } else {
      const index = characterFunctions().getLanguages.indexOf(langId);
      if (index > -1) {
        characterFunctions().getLanguages.splice(index, 1);
      }
    }
  }
}

// Función para desplegar/plegar la descripción
function toggleDescription(langId) {
  const lang = languages.value.find((l) => l.id === langId);
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

.phrase p {
  font-size: 18px;
  color: var(--color-medium-grey);
  font-family: "FedraStdBook";
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

/* Ícono dentro del botón */
.icon {
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.2);
}

/* Descripción en responsive */
.description-mobile {
  display: block;
  font-size: 14px;
  font-family: "FedraStdBook";
  color: var(--color-dark-blue);
  margin-top: 8px;
  padding: 5px;
  border-radius: 5px;
  background: var(--color-hard-white);
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

/* Transición de fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Columnas */
.column {
  width: 30%;
}

.descriptions p {
  font-size: 16px;
  font-family: "FedraStdBook";
  color: var(--color-medium-grey);
  margin: 12px 0;
}

.highlight {
  color: var(--color-medium-blue);
  background-color: var(--color-hard-white);
  padding: 8px;
  border-radius: 5px;
}

.highlight b {
  color: var(--color-dark-blue);
}

@media (max-width: 1260px) {
  .hide-1260 {
    display: none;
  }
}

/* Ajuste en responsive */
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
</style>
