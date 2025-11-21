<template>
  <div class="specialty-selector">
    <h3>Especialidades Mágicas ({{ purchased.length }} / {{ maxAllowed }})</h3>

    <div class="purchased-list">
      <div
        v-for="code in purchased"
        :key="code"
        class="specialty-item purchased"
      >
        <span>{{ getSpecialtyName(code) }}</span>
        <button @click="remove(code)" class="btn-remove">✖</button>
      </div>
    </div>

    <div v-if="purchased.length < maxAllowed" class="available-list">
      <h4>Disponibles</h4>
      <button
        v-for="specialty in availableSpecialties"
        :key="specialty.code"
        @click="purchase(specialty.code)"
        class="btn-purchase"
      >
        + {{ specialty.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCharacterStore } from "@/modules/character/stores";

const characterStore = useCharacterStore();

const purchased = computed(
  () => characterStore.metaData.purchasedMagicSpecialties || []
);
const maxAllowed = computed(() => characterStore.metaData.maxMagicSpecialties);

const allSpecialties = [
  { code: "arcanomancia", name: "Arcanomancia" },
  { code: "animancia", name: "Animancia" },
  { code: "fisiomancia", name: "Fisiomancia" },
  { code: "kairomancia", name: "Kairomancia" },
  { code: "cronomancia", name: "Cronomancia" },
  { code: "zoimancia", name: "Zoimancia" },
];

const availableSpecialties = computed(() => {
  return allSpecialties.filter((s) => !purchased.value.includes(s.code));
});

function getSpecialtyName(code) {
  return allSpecialties.find((s) => s.code === code)?.name || code;
}

function purchase(code) {
  const result = characterStore.purchaseMagicSpecialty(code);
  if (!result.success) {
    alert(result.message);
  }
}

function remove(code) {
  const result = characterStore.removeMagicSpecialty(code);
  if (!result.success) {
    alert(result.message);
  }
}
</script>

<style scoped>
.specialty-selector {
  background: rgba(30, 30, 50, 0.5);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

h3 {
  color: #4da6ff;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.purchased-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.specialty-item {
  background: #4da6ff;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.btn-remove {
  background: rgba(255, 0, 0, 0.6);
  border: none;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.available-list {
  margin-top: 15px;
}

.available-list h4 {
  color: #f5f5f5;
  font-size: 1em;
  margin-bottom: 8px;
}

.btn-purchase {
  background: rgba(77, 166, 255, 0.2);
  border: 1px solid #4da6ff;
  color: #4da6ff;
  padding: 6px 12px;
  border-radius: 6px;
  margin: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-purchase:hover {
  background: #4da6ff;
  color: white;
}
</style>
