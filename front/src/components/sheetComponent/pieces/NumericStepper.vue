<template>
  <div class="numeric-stepper-container">
    <div class="numeric-stepper">
      <!-- Botón decrement solo si modificable es true -->
      <button
        v-if="modificable"
        class="stepper-button"
        @click="decrement"
        aria-label="Disminuir valor"
      >
        –
      </button>

      <!-- El input permanece, aunque esté deshabilitado, para mostrar el valor actual -->
      <input
        type="number"
        v-model="localValue"
        class="stepper-input"
        @keyup.up="modificable ? increment : null"
        @keyup.down="modificable ? decrement : null"
        :disabled="!modificable"
      />

      <!-- Botón increment solo si modificable es true -->
      <button
        v-if="modificable"
        class="stepper-button"
        @click="increment"
        aria-label="Aumentar valor"
      >
        +
      </button>
    </div>

    <!-- Etiqueta que indica el valor máximo, se muestra sólo si showMaxIndicator es true -->
    <div
      :class="['max-indicator', hideMaxIndicator ? 'hidden' : '']"
      v-if="!hideMaxIndicator"
    >
      Máximo: {{ max }}
    </div>
  </div>
</template>

<script setup>
import { useCharacterStore } from "@/modules/character/stores";
import { ref, watch } from "vue";

const characterStore = useCharacterStore();

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  hideMaxIndicator: { type: Boolean, default: false },
  modificable: { type: Boolean, default: true },
  campCode: { type: String, default: null },
});

const emit = defineEmits(["update:modelValue"]);
const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    if (localValue.value !== newVal) {
      localValue.value = newVal;
    }
  }
);

watch(localValue, (newVal) => {
  const numericVal = Number(newVal);
  if (!isNaN(numericVal)) {
    let finalVal = Math.min(Math.max(numericVal, props.min), props.max);
    if (finalVal !== props.modelValue) {
      emit("update:modelValue", finalVal);
    }
    if (localValue.value !== finalVal) {
      localValue.value = finalVal;
    }
  }
});

function increment() {
  if (localValue.value < props.max && props.campCode) {
    +characterStore.increaseCampBase(props.campCode, 1);
  }
}

function decrement() {
  if (localValue.value > props.min && props.campCode) {
    characterStore.increaseCampBase(props.campCode, -1);
  }
}
</script>

<style scoped>
.numeric-stepper-container {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.numeric-stepper {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.stepper-button {
  border: 1px solid var(--color-medium-grey);
  cursor: pointer;
  font-size: 16px;
  width: 32px;
  height: 32px;
  background: var(--color-light-blue, blue);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.stepper-input {
  width: 50px;
  text-align: center;
  font-size: 14px;
  border: 1px solid var(--color-medium-grey);
  outline: none;
}

.stepper-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.max-indicator {
  font-size: 12px;
  color: var(--color-medium-grey, #666);
  font-family: var(--typography-base, sans-serif);
}

.hidden {
  display: none;
}
</style>
