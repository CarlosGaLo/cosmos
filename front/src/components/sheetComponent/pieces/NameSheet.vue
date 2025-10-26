<script setup>
import { characterFunctions } from "../../../store/characterSheet.js";

const characterSheet = characterFunctions();

function loadSpecie() {
  let sex = characterSheet.character.sex;
  let specie = characterSheet.character.specieState;
  characterSheet.loadTemplate(specie, sex);
}
</script>

<template>
  <article class="character-info">
    <section class="input-group">
      <input
        class="input-field"
        type="text"
        placeholder="Nombre"
        v-model="characterSheet.character.name"
      />
      <div class="select-group">
        <select class="select-field" v-model="characterSheet.character.sex" @change="loadSpecie()">
          <option value="" disabled selected>Sexo</option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </select>
        
        <select class="select-field" v-model="characterSheet.character.ageState" @change="loadSpecie()">
          <option value="" disabled selected>Etapa</option>
          <option value="Joven">Joven</option>
          <option value="Adulto">Adulto</option>
          <option value="Anciano">Anciano</option>
        </select>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Contenedor principal */
.character-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Agrupación de inputs */
.input-group {
  margin: 60px 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
}

/* Campo de entrada de texto */
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

/* Contenedor de los select */
.select-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
  width: 100%;
}

/* Select estilizado con mayor ancho */
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
  width: 140px; /* Ajuste de ancho */
  min-width: 120px; /* Evita que se haga demasiado pequeño */
  flex-grow: 1; /* Permite ajuste dinámico */
}

.select-field:focus {
  border: 1px solid var(--color-dark-blue);
}

/* Ajuste de los placeholders en selects */
.select-field option[disabled] {
  color: var(--color-medium-grey);
}

/* Espaciado adicional */
.character-info::after {
  content: "";
  display: block;
  height: 8vh;
}
</style>
