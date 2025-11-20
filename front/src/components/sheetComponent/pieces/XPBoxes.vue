<script setup>
import { ref, computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

// Estado de edición
const editingTotal = ref(false);
const tempTotalXP = ref(0);

const allowNegativeXP = computed({
  get: () => characterStore.metaData.allowNegativeXP,
  set: (val) => (characterStore.metaData.allowNegativeXP = val),
});

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
  <section class="xp-container">
    <div class="xp-content">
      <!-- XP Total -->
      <div class="xp-box">
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

      <!-- XP Libre -->
      <div class="xp-box">
        <h2>XP Libre</h2>
        <p class="value">{{ freeXP }}</p>
      </div>
    </div>

    <!-- Checkbox -->
    <label class="free-xp-checkbox">
      <input type="checkbox" v-model="allowNegativeXP" />
      <span class="checkbox-label">Free XP</span>
    </label>
  </section>
</template>

<style scoped>
.xp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px 20px 20px 20px;
  position: relative;
  overflow: visible;
}

.xp-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  height: 100%;
  background-image: url("../../../assets/images-svg/MOVILE_XP_routing.svg");
  background-repeat: no-repeat;
  background-position: center top;
  background-size: contain;
  z-index: -1;
  pointer-events: none;
}

.xp-content {
  display: flex;
  gap: 80px;
  align-items: center;
  justify-content: center;
}

.xp-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.xp-box h2 {
  font-family: FedraNumberMedium, sans-serif;
  font-size: 18px;
  margin: 0;
  color: var(--color-dark-blue);
  white-space: nowrap;
}

.xp-box p {
  font-family: FedraNumberLight, sans-serif;
  font-size: 20px;
  margin: 0;
  color: var(--color-dark-blue);
  font-weight: 600;
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
  font-family: FedraNumberLight, sans-serif;
  font-size: 20px;
  padding: 4px;
  border: 2px solid var(--color-medium-blue);
  border-radius: 4px;
  outline: none;
}

.free-xp-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.free-xp-checkbox:hover {
  background: rgba(77, 166, 255, 0.1);
}

.free-xp-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0;
}

.checkbox-label {
  color: var(--color-dark-blue);
  font-weight: 500;
  font-family: FedraNumberLight, sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
  .xp-container {
    padding: 25px 15px 15px 15px;
  }

  .xp-content {
    gap: 50px;
  }

  .xp-box h2 {
    font-size: 16px;
  }

  .xp-box p {
    font-size: 18px;
  }

  .free-xp-checkbox {
    font-size: 13px;
  }

  .free-xp-checkbox input[type="checkbox"] {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .xp-container {
    padding: 20px 10px 15px 10px;
  }

  .xp-content {
    gap: 30px;
  }

  .xp-box h2 {
    font-size: 14px;
  }

  .xp-box p {
    font-size: 16px;
  }

  .free-xp-checkbox {
    font-size: 12px;
  }

  .xp-container::before {
    max-width: 400px;
  }
}
</style>
