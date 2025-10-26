<script setup>
import { ref, computed, onMounted } from "vue";
import { useFeatStore } from "@/store/featStore";
import { characterFunctions } from "@/store/characterSheet";

const featsStore = useFeatStore();

onMounted(() => {
  featsStore.fetchFeats();
});

const showModal = ref(false);
const selectedItem = ref(null);
const openSections = ref({
  feats: true,
  unfeats: true,
});
const searchQuery = ref("");

const selectedFeats = ref([]);
const selectedUnfeats = ref([]);

const groupItems = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});
};

const filteredFeats = computed(() => {
  return groupItems(
    featsStore.feats.filter(
      (feat) => !selectedFeats.value.some((s) => s.name === feat.name)
    )
  );
});

const filteredUnfeats = computed(() => {
  return groupItems(
    featsStore.unfeats.filter(
      (unfeat) => !selectedUnfeats.value.some((s) => s.name === unfeat.name)
    )
  );
});

const toggleItem = (item, event) => {
  event.stopPropagation();

  if (item.type === "Mérito") {
    const index = selectedFeats.value.findIndex((s) => s.name === item.name);
    if (index === -1) {
      selectedFeats.value.push(item);
    } else {
      selectedFeats.value.splice(index, 1);
    }
  } else {
    const index = selectedUnfeats.value.findIndex((s) => s.name === item.name);
    if (index === -1) {
      selectedUnfeats.value.push(item);
    } else {
      selectedUnfeats.value.splice(index, 1);
    }
  }
  characterFunctions().calculateXP(0, 0, 0, item.xp);
};

const openModal = (item) => {
  selectedItem.value = item;
  showModal.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
  document.body.style.overflow = "auto";
};
</script>

<template>
  <div class="feats-unfeats-container">
    <h2 class="title">Méritos y Defectos</h2>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Buscar..."
      class="search-input"
    />

    <div
      class="selected-section"
      v-if="selectedFeats.length || selectedUnfeats.length"
    >
      <h3>Méritos y Defectos Seleccionados</h3>
      <div
        v-for="item in selectedFeats.concat(selectedUnfeats)"
        :key="item.name"
        class="selected-item"
      >
        <span>{{ item.name }} ({{ item.type }})</span>
        <button class="close-btn" @click="toggleItem(item, $event)">×</button>
      </div>
    </div>

    <div
      class="section"
      v-for="(group, groupName) in filteredFeats"
      :key="groupName"
    >
      <h3>{{ groupName }}</h3>
      <div v-for="merit in group" :key="merit.name" class="item-card">
        <div class="item-content" @click="openModal(merit)">
          <h3>{{ merit.name }}</h3>
          <p>{{ merit.resume }}</p>
        </div>
        <label class="switch" @click.stop>
          <input type="checkbox" @change="toggleItem(merit, $event)" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div
      class="section"
      v-for="(group, groupName) in filteredUnfeats"
      :key="groupName"
    >
      <h3>{{ groupName }}</h3>
      <div v-for="flaw in group" :key="flaw.name" class="item-card">
        <div class="item-content" @click="openModal(flaw)">
          <h3>{{ flaw.name }}</h3>
          <p>{{ flaw.resume }}</p>
        </div>
        <label class="switch" @click.stop>
          <input type="checkbox" @change="toggleItem(flaw, $event)" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ selectedItem.name }}</h2>
        <p>{{ selectedItem.description }}</p>
        <button @click="closeModal" class="close-modal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #252545;
  border-radius: 10px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-card:hover {
  background: #30305a;
}

.modal-content {
  background: #1a1a2e;
  padding: 30px;
  width: 50%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 12px;
  color: #f5f5f5;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.close-modal {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
