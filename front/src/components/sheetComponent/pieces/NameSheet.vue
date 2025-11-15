<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

// Computed properties bidireccionales
const name = computed({
  get: () => characterStore.character.name,
  set: (value) => characterStore.setBasicInfo({ name: value }),
});

const sex = computed({
  get: () => characterStore.character.sex,
  set: (value) => {
    characterStore.setBasicInfo({ sex: value });
    loadSpecie();
  },
});

const ageState = computed({
  get: () => characterStore.character.ageState,
  set: (value) => {
    characterStore.setBasicInfo({ ageState: value });
    loadSpecie();
  },
});

function loadSpecie() {
  const specie = characterStore.character.specieState;
  const currentSex = characterStore.character.sex;
  if (specie && currentSex) {
    characterStore.loadSpecieTemplate(specie, currentSex);
  }
}
</script>

<template>
  <article class="character-info">
    <section class="input-group">
      <input
        class="input-field"
        type="text"
        placeholder="Nombre"
        v-model="name"
      />
      <div class="select-group">
        <select class="select-field" v-model="sex">
          <option value="" disabled>Sexo</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>

        <select class="select-field" v-model="ageState">
          <option value="" disabled>Etapa</option>
          <option value="Joven">Joven</option>
          <option value="Adulto">Adulto</option>
          <option value="Anciano">Anciano</option>
        </select>
      </div>
    </section>
  </article>
</template>

<style scoped>
.character-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.input-group {
  margin: 60px 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
}

.input-field {
  width: 100%;
  font-size: 18px;
  color: var(--color-dark-blue);
  font-family: "FedraStdMedium";
  padding: 8px 12px;
  border: none;
  border-bottom: 2px solid var(--color-medium-blue);
  background: transparent;
  outline: none;
  text-align: center;
  transition: border-bottom 0.3s ease-in-out;
}

.input-field::placeholder {
  color: var(--color-medium-grey);
}

.input-field:focus {
  border-bottom: 2px solid var(--color-dark-blue);
}

.select-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  width: 100%;
}

.select-field {
  font-size: 18px;
  font-family: "FedraNumberLight";
  padding: 6px 12px;
  border: 1px solid var(--color-medium-blue);
  background: transparent;
  color: var(--color-dark-blue);
  border-radius: 6px;
  outline: none;
  transition: border 0.3s ease-in-out;
  cursor: pointer;
  width: 140px;
  min-width: 120px;
  flex-grow: 1;
}

.select-field:focus {
  border: 1px solid var(--color-dark-blue);
}

.select-field option[disabled] {
  color: var(--color-medium-grey);
}

.character-info::after {
  content: "";
  display: block;
  height: 8vh;
}
</style>
