<script setup>
import { ref, computed, watch } from "vue";
import { characterFunctions } from "@/store/characterSheet";

const props = defineProps({
  speciality: Object,
  base: Boolean,
  modif: Boolean,
  final: Boolean,
});

const emit = defineEmits(["onBaseChange"]);

const localBase = ref(props.speciality.base);

// Sincronizar `localBase` con `props.speciality.base`
watch(
  () => props.speciality.base,
  (newVal) => {
    localBase.value = newVal;
  }
);

// Restricción del local base
watch(localBase, (newVal) => {
  // Asegura que localBase no sea menor que 0 ni mayor que props.speciality.atrib
  if (newVal < 0) {
    localBase.value = 0;
  } else if (newVal > props.speciality.atrib) {
    localBase.value = props.speciality.atrib;
  }

  // Emitir evento si el valor cambia
  emit("onBaseChange", localBase.value);
});

// Función para incrementar
function add() {
  if (localBase.value < props.speciality.atrib) {
    localBase.value++;
    characterFunctions().calculateXP(0, 0, 1, 0);
    emit("onBaseChange", localBase.value);
  }
}

// Función para decrementar
function substract() {
  if (localBase.value > 0) {
    localBase.value--;
    characterFunctions().calculateXP(0, 0, 1, 0);
    emit("onBaseChange", localBase.value);
  }
}

// Computed para calcular el total sin modificar `props`
const specialityTotal = computed(() => {
  return props.speciality.base + props.speciality.atrib + props.speciality.mod;
});
</script>

<template>
  <section class="speciality-container">
    <!-- Flechas personalizadas + input -->
    <div v-if="base" class="stepper-wrapper">
      <button class="arrow-btn arrow-up" @click="add">
        <img src="/images-svg/md-arrow-dropdown.svg" alt="Increment" />
      </button>

      <input
        type="number"
        :max="props.speciality.atrib"
        :min="0"
        v-model="localBase"
        class="stepper-button"
      />

      <button class="arrow-btn arrow-down" @click="substract">
        <img src="/images-svg/md-arrow-dropdown.svg" alt="Decrement" />
      </button>
    </div>

    <article v-if="final" class="value-box total">
      {{ specialityTotal }}
    </article>
  </section>
</template>

<style scoped>
.speciality-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stepper-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f9f9f9;
}

/* Elimina flechas nativas para no duplicar con tus flechas personalizadas */
.stepper-button::-webkit-inner-spin-button,
.stepper-button::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.stepper-button {
  width: 44px;
  height: 28px;
  text-align: center;
  font-size: 14px;
  border: none;
  background-color: #fff;
  outline: none;
  -moz-appearance: textfield;
}

/* Flechas personalizadas (arriba/abajo) */
.arrow-btn {
  width: 100%;
  height: 10%;
  border: none;
  background: #eaeaea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-up img {
  transform: rotate(180deg);
}

/* Campos de valor (mod, heri, total) */
.value-box {
  width: 36px;
  height: 28px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.total {
  background-color: #e0eafc;
  font-weight: 600;
}
</style>
