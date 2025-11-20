<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";
import HeaderPiece from "./HeaderPiece.vue";

const characterStore = useCharacterStore();

const selectedSpecie = computed(() => characterStore.character.specie);
const specImagePath = computed(() => characterStore.metaData.specImagePath);
const specShieldPath = computed(() => characterStore.metaData.specShieldPath);
const specieFeats = computed(() => characterStore.feats);

const availableSpecies = [
  "humano",
  "kordun",
  "urcan",
  "nergal",
  "zannin",
  "námester",
];

async function loadSpecie(specie) {
  const sex = characterStore.character.sex;
  const ageState = characterStore.character.ageState;

  if (!sex) {
    alert("⚠️ Debes seleccionar un sexo antes");
    return;
  }

  if (!ageState) {
    alert("⚠️ Debes seleccionar una edad antes");
    return;
  }

  // ✅ AWAIT aquí
  await characterStore.loadSpecieTemplate(specie, sex);
}

function isSelected(specie) {
  return selectedSpecie.value?.toLowerCase() === specie.toLowerCase();
}
</script>

<template>
  <article class="framework">
    <HeaderPiece>Especie</HeaderPiece>

    <!-- Menú de selección de especie -->
    <section class="spec-list">
      <button
        v-for="specie in availableSpecies"
        :key="specie"
        @click="loadSpecie(specie)"
        :class="['specie-box', { selected: isSelected(specie) }]"
      >
        {{ specie.charAt(0).toUpperCase() + specie.slice(1) }}
      </button>
    </section>

    <!-- Separador visual -->
    <div class="separator"></div>

    <!-- Información de la especie seleccionada -->
    <div class="spec-info" v-if="selectedSpecie">
      <h2 class="spec-title">{{ selectedSpecie }}</h2>
      <p class="spec-description">
        Breve descripción de la especie. Texto introductorio claro y conciso.
      </p>
    </div>

    <!-- Contenido visual estructurado -->
    <section class="flex-imgs" v-if="specImagePath">
      <div class="image-wrapper">
        <img
          class="species-image"
          :src="specImagePath"
          alt="Imagen de la especie"
        />
      </div>

      <div class="shield-wrapper" v-if="specShieldPath">
        <img class="shield" :src="specShieldPath" alt="Escudo de la especie" />
      </div>
    </section>

    <!-- Habilidades y efectos de la especie -->
    <section class="skills-container" v-if="specieFeats && specieFeats.length">
      <figure v-for="feat in specieFeats" :key="feat.name" class="spec-skills">
        <img
          class="skill-icon"
          :src="feat.image"
          :alt="feat.alt || feat.name"
        />
        <p class="skill-description">{{ feat.effect }}</p>
      </figure>
    </section>
  </article>
</template>

<style scoped>
.framework {
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-light-white);
}

.spec-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 30px;
}

.spec-list button {
  font-size: 18px;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid var(--color-medium-blue);
  background: transparent;
  color: var(--color-medium-blue);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.spec-list button:hover {
  background-color: var(--color-medium-blue);
  color: white;
}

.specie-box {
  width: 70%;
  min-width: 160px;
  max-width: 250px;
}

.spec-list .selected {
  background-color: var(--color-medium-blue);
  color: white;
}

.separator {
  width: 60%;
  height: 3px;
  background: var(--color-medium-blue);
  margin: 30px 0;
  border-radius: 3px;
}

.spec-info {
  text-align: center;
  max-width: 600px;
  margin-bottom: 30px;
}

.spec-title {
  font-size: 32px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-dark-blue);
}

.spec-description {
  font-size: 18px;
  color: var(--color-medium-grey);
  line-height: 1.8;
}

.flex-imgs {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  width: 100%;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.species-image {
  width: 500px;
  height: auto;
  border-radius: 12px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.species-image:hover {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.shield-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.shield {
  width: 180px;
  height: auto;
  transition: transform 0.3s ease-in-out;
}

.shield:hover {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.skills-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
  width: 100%;
}

.spec-skills {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  background: var(--color-light-grey);
  border-radius: 8px;
  width: 320px;
  height: 100px;
  transition: transform 0.3s ease-in-out;
}

.skill-icon {
  width: 64px;
  height: 64px;
}

.skill-description {
  font-size: 16px;
  color: var(--color-dark-blue);
  text-align: left;
  flex-grow: 1;
}

.spec-skills:hover {
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .species-image {
    width: 400px;
  }

  .shield {
    width: 140px;
  }

  .spec-list button {
    font-size: 16px;
    padding: 10px 18px;
  }

  .spec-title {
    font-size: 28px;
  }

  .spec-description {
    font-size: 16px;
  }

  .spec-skills {
    width: 280px;
    height: 90px;
  }

  .skill-icon {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 768px) {
  .spec-list {
    flex-direction: column;
    align-items: center;
  }

  .spec-list button {
    font-size: 18px;
    padding: 14px 20px;
  }

  .flex-imgs {
    flex-direction: column;
    align-items: center;
  }

  .species-image {
    width: 320px;
  }

  .shield {
    width: 120px;
  }

  .spec-title {
    font-size: 26px;
  }

  .spec-description {
    font-size: 18px;
  }

  .spec-skills {
    width: 100%;
    max-width: 280px;
    height: auto;
  }

  .skill-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
