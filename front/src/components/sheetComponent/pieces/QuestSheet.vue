<script setup>
import { ref } from "vue";
import HeaderPiece from "./../pieces/HeaderPiece.vue";

const characterData = ref({
  quote: "",
  history: "",
  goals: "",
  allies: "",
  enemies: "",
  fame: ""
});
</script>

<template>
  <section class="character-background">
    <HeaderPiece>Historia y Objetivos</HeaderPiece>

    <!-- Cita célebre -->
    <div class="quote-container">
      <img class="left-commas" src="/images-svg/Spanish_commas.svg" alt="comillas" />
      <input
        type="text"
        v-model="characterData.quote"
        placeholder="Escribe una cita memorable de tu personaje..."
        class="quote-input"
      />
      <img class="right-commas" src="/images-svg/Spanish_commas.svg" alt="comillas" />
    </div>

    <hr class="separator" />

    <!-- Historia del personaje -->
    <div class="input-group">
      <label for="history">Historia del personaje</label>
      <textarea id="history" v-model="characterData.history" placeholder="Describe la historia de tu personaje..."></textarea>
    </div>

    <!-- Objetivos -->
    <div class="input-group">
      <label for="goals">Objetivos</label>
      <textarea id="goals" v-model="characterData.goals" placeholder="¿Cuáles son los objetivos de tu personaje?"></textarea>
    </div>

    <!-- Aliados -->
    <div class="input-group">
      <label for="allies">Aliados</label>
      <textarea id="allies" v-model="characterData.allies" placeholder="¿Quiénes son sus aliados?"></textarea>
    </div>

    <!-- Enemigos -->
    <div class="input-group">
      <label for="enemies">Enemigos</label>
      <textarea id="enemies" v-model="characterData.enemies" placeholder="¿Quiénes son sus enemigos?"></textarea>
    </div>

    <!-- Fama -->
    <div class="input-group">
      <label for="fame">Fama</label>
      <input id="fame" type="text" v-model="characterData.fame" placeholder="¿Es conocido por algo?" />
    </div>
  </section>
</template>

<style scoped>
.character-background {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background: var(--color-light-white);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.quote-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.quote-input {
  font-family: "FedraStdBookItalic";
  color: var(--color-medium-blue);
  font-size: 18px;
  border: none;
  border-bottom: 2px solid var(--color-medium-blue);
  outline: none;
  background: transparent;
  padding: 5px;
  width: 100%;
  text-align: center;
}

.left-commas {
  margin-right: 5px;
}

.right-commas {
  margin-left: 5px;
  transform: rotate(180deg);
}

.separator {
  border: none;
  border-bottom: 1px solid var(--color-medium-grey);
  width: 50%;
  margin: 20px auto;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-group label {
  font-family: "FedraSansLight";
  font-size: 18px;
  color: var(--color-dark-blue);
  margin-bottom: 5px;
}

.input-group textarea,
.input-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--color-medium-grey);
  border-radius: 6px;
  font-size: 16px;
  font-family: "FedraStdBook";
  background: var(--color-light-white);
  transition: all 0.3s ease-in-out;
}

.input-group textarea {
  min-height: 80px;
  resize: vertical;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: var(--color-medium-blue);
  outline: none;
  background: var(--color-hard-white);
}

/* Estilo responsive */
@media (max-width: 768px) {
  .character-background {
    padding: 15px;
  }

  .quote-input {
    font-size: 16px;
  }

  .input-group label {
    font-size: 16px;
  }

  .input-group textarea,
  .input-group input {
    font-size: 14px;
  }
}
</style>
