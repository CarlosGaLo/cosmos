<script setup>
import { ref, computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

// Estado de edición
const editingTotal = ref(false);
const tempTotalXP = ref(0);

// Computed
const totalXP = computed(() => {
  return characterStore.metaData.freeXP + characterStore.metaData.usedXP;
});

const freeXP = computed(() => {
  return characterStore.metaData.freeXP;
});

// Inicializar con 1000 XP si está vacío
if (totalXP.value === 0) {
  characterStore.metaData.freeXP = 1000;
}

// Editar Total XP
function startEditTotal() {
  editingTotal.value = true;
  tempTotalXP.value = totalXP.value;
}

function saveTotal() {
  const newTotal = parseInt(tempTotalXP.value) || 0;
  const usedXP = characterStore.metaData.usedXP;

  characterStore.metaData.freeXP = newTotal - usedXP;
  editingTotal.value = false;
}
</script>

<template>
  <section class="center">
    <!-- XP Total (editable) -->
    <div class="flex frame-left">
      <h2>XP Total</h2>
      <p v-if="!editingTotal" @click="startEditTotal" class="editable">
        {{ totalXP }}
      </p>
      <div v-else class="edit-mode">
        <input
          v-model.number="tempTotalXP"
          type="number"
          @keyup.enter="saveTotal"
          @blur="saveTotal"
          autofocus
        />
      </div>
    </div>

    <!-- XP Libre (calculada automáticamente) -->
    <div class="flex frame-right">
      <h2>XP Libre</h2>
      <p class="value">{{ freeXP }}</p>
    </div>
  </section>
</template>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 70px;
  background-image: url("../../../assets/images-svg/MOVILE_XP_routing.svg");
  background-repeat: no-repeat;
  background-position-x: 50%;
  background-position-y: 15px;
  height: 90px;
}

.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex h2 {
  font-family: FedraNumberMedium;
  font-size: 18px;
}

.flex p {
  font-family: FedraNumberLight;
  font-size: 16px;
  margin: 0;
}

.value {
  padding: 4px 8px;
}

.editable {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.editable:hover {
  background: rgba(77, 166, 255, 0.2);
}

.edit-mode input {
  width: 80px;
  text-align: center;
  font-family: FedraNumberLight;
  font-size: 16px;
  padding: 4px;
  border: 2px solid var(--color-medium-blue);
  border-radius: 4px;
  outline: none;
}
</style>
