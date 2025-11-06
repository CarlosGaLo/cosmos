<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCreaturesStore } from "@/store/creatureStore";

const route = useRoute();
const store = useCreaturesStore();
const creatureId = route.params.id.replace(/-/g, " ");

const loading = ref(true);
const error = ref(null);
const damageInputs = ref({});
const disabledAbilities = ref(new Set());
const API_BASE_URL = process.env.VUE_APP_API_URL.replace("/api", "");

onMounted(async () => {
  try {
    await store.fetchCreature(creatureId);
    initializeDamageInputs();
  } catch (err) {
    error.value = "Error al cargar la criatura.";
    console.error("❌ Error en ShowCreature:", err);
  } finally {
    loading.value = false;
  }
});

const creature = computed(() => store.creature || {});

const totalHp = computed(() => {
  return (
    creature.value?.bodyParts?.reduce((acc, part) => acc + (part.hp || 0), 0) ||
    0
  );
});

const currentHp = computed(() => {
  return (
    creature.value?.bodyParts?.reduce(
      (acc, part) =>
        acc + Math.max(0, (part.hp || 0) - (damageInputs.value[part._id] || 0)),
      0
    ) || 0
  );
});

const initializeDamageInputs = () => {
  if (creature.value?.bodyParts) {
    creature.value.bodyParts.forEach((part) => {
      damageInputs.value[part._id] = 0;
    });
  }
};

const isBodyPartDead = (bodyPart) => {
  return (damageInputs.value[bodyPart._id] || 0) >= (bodyPart.hp || 0);
};

const isAbilityDisabled = (ability) => {
  return (ability.bodyParts || []).every((partId) => {
    const bodyPart = (creature.value.bodyParts || []).find(
      (p) => p._id === partId
    );
    return bodyPart && isBodyPartDead(bodyPart);
  });
};

const getImageSrc = () => {
  if (!creature.value?.image) return ""; // ❌ Evita errores si no hay imagen

  // 📌 Verifica si la URL ya está completa (evita errores en rutas absolutas)
  if (creature.value.image.startsWith("http")) {
    return creature.value.image;
  }

  return `${API_BASE_URL}${creature.value.image}`; // ✅ Construcción de la URL
};
</script>

<template>
  <div class="container">
    <div v-if="loading" class="text-center text-gray-400 text-lg animate-pulse">
      Cargando criatura...
    </div>
    <div v-else-if="error" class="text-center text-red-500 text-lg">
      {{ error }}
    </div>
    <div v-else class="creature-card">
      <img
        v-if="creature.image"
        :src="getImageSrc()"
        alt="Imagen de la criatura"
        class="creature-image"
      />

      <div class="creature-header">
        <h2 class="creature-title">{{ creature.name }}</h2>
        <p class="creature-hp">❤️ Vida: {{ currentHp }} / {{ totalHp }}</p>
      </div>
      <div class="creature-body">
        <p>
          <span>🏞️ Hábitat:</span> {{ (creature.habitat || []).join(", ") }}
        </p>
        <p><span>⏳ Turno:</span> {{ creature.turn }}</p>
        <p><span>⚔️ Daño:</span> {{ creature.damage }}</p>
      </div>

      <!-- Habilidades -->
      <div v-if="creature.bodyParts?.length" class="creature-section abilities">
        <h3>🎯 Habilidades</h3>
        <ul
          v-for="bodyPart in creature.bodyParts"
          :key="bodyPart._id"
          :class="{ 'dead-ability': isBodyPartDead(bodyPart) }"
        >
          <li v-for="(ability, index) in bodyPart.abilities" :key="index">
            <h3>{{ ability.name }}</h3>
            <p>{{ ability.description }}</p>
            <p>{{ ability.effect }}</p>
          </li>
        </ul>
      </div>

      <!-- Partes del cuerpo -->
      <div v-if="creature.bodyParts?.length" class="creature-section">
        <h3>🦴 Partes del Cuerpo</h3>
        <ul>
          <li
            v-for="bodyPart in creature.bodyParts"
            :key="bodyPart._id"
            class="body-part-item"
            :class="{ 'dead-text': isBodyPartDead(bodyPart) }"
          >
            <span>{{ bodyPart.part }} ({{ bodyPart.hp }} HP)</span>
            <input
              type="number"
              v-model="damageInputs[bodyPart._id]"
              class="damage-input"
              min="0"
              placeholder="DMG"
            />
          </li>
        </ul>
        <router-link :to="`../modify/${creature._id}`">Modify</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a2e;
  padding: 20px;
  color: #ddd;
}

.creature-card {
  background-color: #252547;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.creature-image {
  width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 10px;
}

.creature-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
}

.creature-hp {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff5252;
}

.creature-body p {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.creature-section h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.body-part-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin-bottom: 5px;
}

.damage-input {
  width: 60px;
  text-align: center;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 4px;
}

.dead-text {
  text-decoration: line-through;
  color: rgba(255, 0, 0, 0.7);
}

.disabled-text {
  text-decoration: line-through;
  color: rgba(180, 180, 180, 0.7);
}

.abilities {
  background-color: var(--color-light-blue);
  border-radius: 3%;
}

.abilities h3 {
  color: var(--color-dark-blue);
}

.abilities p {
  color: var(--color-medium-blue);
}

.dead-ability,
.dead-ability * {
  text-decoration: line-through;
  color: rgba(255, 0, 0, 0.7);
}
</style>
