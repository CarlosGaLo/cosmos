<script setup>
import { characterFunctions } from "@/store/characterSheet";
import { ref, computed } from "vue";

const props = defineProps({
  name: String,
  items: Array,
  assignedItems: Array,
  calculateXP: Function,
  xpAffected: String,
  inverted: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:assignedItems"]);

const localAssignedItems = ref([...props.assignedItems]);
const showModal = ref(false);
const selectedItem = ref(null);
const isItemsOpen = ref(false);
const openGroups = ref({});
const openLevels = ref({});
const searchTerms = ref({});

const groupedItems = computed(() => {
  const grouped = {};

  props.items.forEach((item) => {
    if (item.isAdquired) return;

    let groups = [];

    if (props.name === "Magia") {
      item.group?.forEach((g) => {
        const lower = g.toLowerCase();

        if (lower.includes("ani")) groups.push("Animancia");
        if (lower.includes("arc") || lower.includes("arcano"))
          groups.push("Arcanomancia");
        if (lower.includes("fis")) groups.push("Fisiomancia");
        if (lower.includes("kai")) groups.push("Kairomancia");
        if (lower.includes("cro")) groups.push("Cronomancia");
        if (lower.includes("zoi") || lower.includes("nec"))
          groups.push("Zoimancia");
      });

      if (groups.length === 0) groups.push("Sin categoría");
    } else {
      if (Array.isArray(item.group)) {
        groups = item.group;
      } else if (typeof item.group === "string") {
        groups = [item.group];
      } else {
        groups = ["Sin categoría"];
      }
    }

    groups.forEach((group) => {
      if (!grouped[group]) grouped[group] = {};

      const nivelKey =
        item.lvl !== undefined ? `Nivel ${item.lvl}` : "Sin nivel";

      if (!grouped[group][nivelKey]) grouped[group][nivelKey] = [];

      grouped[group][nivelKey].push(item);
    });
  });

  return grouped;
});

const toggleItem = (item, event) => {
  event.stopPropagation();

  const index = localAssignedItems.value.findIndex((c) => c.name === item.name);
  if (!props.inverted) {
    if (index === -1) {
      localAssignedItems.value.push(item);
      props.calculateXP(0, 0, 0, item.xp);
      characterFunctions().metaData[props.xpAffected] -= item.xp;
    } else {
      localAssignedItems.value.splice(index, 1);
      props.calculateXP(0, 0, 0, -item.xp);
      characterFunctions().metaData[props.xpAffected] += item.xp;
    }
  } else {
    if (index === -1) {
      localAssignedItems.value.push(item);
      props.calculateXP(0, 0, 0, item.xp);
      characterFunctions().metaData[props.xpAffected] += item.xp;
    } else {
      localAssignedItems.value.splice(index, 1);
      props.calculateXP(0, 0, 0, -item.xp);
      characterFunctions().metaData[props.xpAffected] -= item.xp;
    }
  }

  emit("update:assignedItems", localAssignedItems.value);
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

const toggleGroup = (group) => {
  openGroups.value[group] = !openGroups.value[group];
};

const toggleLevel = (group, nivel) => {
  if (!openLevels.value[group]) openLevels.value[group] = {};
  openLevels.value[group][nivel] = !openLevels.value[group][nivel];
};
</script>

<template>
  <div class="items-container">
    <h2 class="title">{{ props.name }} del personaje</h2>

    <div v-if="localAssignedItems.length > 0" class="assigned-list">
      <div
        v-for="item in localAssignedItems"
        :key="item.name"
        class="item-card assigned"
        @click="openModal(item)"
      >
        <div class="item-content">
          <h3>{{ item.name }}</h3>
          <span class="cost">Coste: {{ item.xp }} XP</span>
          <p>{{ item.resume }}</p>
        </div>
        <label class="switch right" @click.stop>
          <input
            type="checkbox"
            :checked="true"
            @change="toggleItem(item, $event)"
          />
          <span class="slider"></span>
        </label>
      </div>
    </div>
    <p v-else class="empty">Sin {{ props.name }}.</p>

    <button class="dropdown-header" @click="isItemsOpen = !isItemsOpen">
      {{ props.name }}
      <span :class="{ rotate: isItemsOpen }">▼</span>
    </button>

    <div v-show="isItemsOpen" class="item-list">
      <div v-for="(levels, group) in groupedItems" :key="group">
        <button class="group-header" @click="toggleGroup(group)">
          {{ group }}
          <span :class="{ rotate: openGroups[group] }">▼</span>
        </button>

        <div v-show="openGroups[group]" class="group-content">
          <div v-for="(items, nivel) in levels" :key="nivel">
            <button class="level-header" @click="toggleLevel(group, nivel)">
              {{ nivel }}
              <span :class="{ rotate: openLevels[group]?.[nivel] }">▼</span>
            </button>

            <div v-show="openLevels[group]?.[nivel]">
              <template v-if="!searchTerms[group]">
                <span v-if="(searchTerms[group] = {})"></span>
              </template>
              <template v-if="!searchTerms[group][nivel]">
                <span v-if="(searchTerms[group][nivel] = '')"></span>
              </template>

              <input
                class="search-input"
                type="text"
                v-model="searchTerms[group][nivel]"
                placeholder="Buscar por nombre..."
                @click.stop
              />

              <div
                v-for="item in items.filter(
                  (item) =>
                    !searchTerms[group][nivel] ||
                    item.name
                      .toLowerCase()
                      .includes(searchTerms[group][nivel].toLowerCase())
                )"
                :key="item.name"
                class="item-card"
                @click="openModal(item)"
              >
                <div class="item-content">
                  <h3>{{ item.name }}</h3>
                  <span class="cost">Coste: {{ item.xp }} XP</span>
                  <p>{{ item.resume }}</p>
                </div>
                <label class="switch right" @click.stop>
                  <input
                    type="checkbox"
                    :checked="
                      localAssignedItems.some((i) => i.name === item.name)
                    "
                    @change="toggleItem(item, $event)"
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-box" @click.stop>
        <button class="close-btn" @click="closeModal">✖</button>
        <h2 class="modal-title">{{ selectedItem.name }}</h2>
        <p class="modal-description">{{ selectedItem.description }}</p>
        <p><strong>Coste XP:</strong> {{ selectedItem.xp }}</p>
        <p><strong>Requisitos:</strong></p>
        <ul>
          <li v-for="req in selectedItem.requisites" :key="req.name">
            {{ req.name }} ({{ req.value }} XP)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  background-color: rgba(10, 10, 20, 0.9);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 20px auto;
  color: #f5f5f5;
  font-family: "Poppins", sans-serif;
}

.dropdown-header,
.group-header {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin: 5px 0;
}

.dropdown-header:hover,
.group-header:hover {
  background-color: #0056b3;
}

.level-header {
  width: 100%;
  background-color: #44466a;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-top: 8px;
  transition: background-color 0.3s ease;
}

.level-header:hover {
  background-color: #343656;
}

.rotate {
  transform: rotate(180deg);
}

.switch.right {
  margin-left: auto;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #1a1a2e;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  background-color: #2c2c3e;
  color: white;
}

.search-input::placeholder {
  color: #aaa;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-box {
  background-color: #1a1a2e;
  color: #f5f5f5;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: fadeIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
}

.modal-title {
  font-size: 1.6em;
  margin-bottom: 15px;
  font-weight: bold;
}

.modal-description {
  margin-bottom: 15px;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
