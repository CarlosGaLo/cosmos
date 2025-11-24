<template>
  <article class="navigation-container">
    <button
      class="nav-button left"
      @click="$emit('substract')"
      :disabled="stepNumber === 1"
    >
      <span>&#8592;</span>
    </button>

    <div class="step-info">
      <h2 class="uppercase">Ficha de Personaje</h2>
      <div class="step-indicator">
        <span
          v-for="step in totalSteps"
          :key="step"
          :class="['dot', { active: step <= stepNumber }]"
        ></span>
      </div>
      <p class="step-text">Paso {{ stepNumber }} / {{ totalSteps }}</p>
    </div>

    <button
      class="nav-button right"
      @click="$emit('add')"
      :disabled="stepNumber === totalSteps"
    >
      <span>&#8594;</span>
    </button>
  </article>
</template>

<script setup>
const props = defineProps(["stepNumber"]);
defineEmits(["substract", "add"]);
const totalSteps = 5; // 👈 CAMBIADO DE 4 A 5
</script>

<style scoped>
.navigation-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--color-light-white);
  border-radius: 12px;
}

.nav-button {
  font-family: "FedraSansLight";
  font-size: 18px;
  font-weight: 600;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background-color: var(--color-medium-blue);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.nav-button span {
  font-size: 22px;
  margin: 0 8px;
}

.nav-button:hover {
  background-color: var(--color-dark-blue);
}

.nav-button:disabled {
  background-color: var(--color-light-grey);
  cursor: not-allowed;
}

.step-info {
  text-align: center;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.dot {
  width: 10px;
  height: 10px;
  margin: 0 4px;
  background: var(--color-light-grey);
  border-radius: 50%;
  transition: background-color 0.3s ease-in-out;
}

.dot.active {
  background: var(--color-medium-blue);
}

.step-text {
  font-size: 14px;
  color: var(--color-medium-grey);
  font-family: "FedraNumberBold";
}
</style>
