<template>
  <div class="rule-container">
    <h2 class="rule-title">{{ rule?.title }}</h2>
    <div class="rule-content" v-html="rule?.content"></div>

    <!-- Imágenes -->
    <div v-if="rule?.images && rule.images.length" class="rule-images">
      <img
        v-for="(image, index) in rule.images"
        :key="index"
        :src="image"
        alt="Imagen de regla"
        class="rule-image"
      />
    </div>

    <!-- Reglas Relacionadas -->
    <div v-if="rule?.relatedRules && rule.relatedRules.length">
      <h3>Reglas Relacionadas:</h3>
      <ul class="related-rules">
        <li
          v-for="related in rule.relatedRules"
          :key="related._id || related.sID"
        >
          <button class="related-btn" @click="changeSelectedRule(related)">
            {{ related }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRulesStore } from "@/store/rulesStore";

const rulesStore = useRulesStore();

// Computed para obtener la regla desde la store
const rule = computed(() => rulesStore.selectedRule);

// Función para cambiar `selectedRule` sin cambiar la URL
const changeSelectedRule = async (related) => {
  if (related) {
    await rulesStore.fetchRuleByIdOrName(related);
  }
};

// Cargar la regla inicial cuando se monta el componente
onMounted(() => {
  rulesStore.fetchRuleByIdOrName("elegir-origen");
});
</script>

<style scoped>
.rule-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rule-title {
  font-size: 2em;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.rule-content {
  font-size: 1.1em;
  line-height: 1.6em;
  color: #606060;
  margin-bottom: 20px;
}

.rule-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.rule-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.rule-image:hover {
  transform: scale(1.05);
}

.related-rules {
  list-style: none;
  padding: 0;
}

.related-rules li {
  margin-bottom: 5px;
}

.related-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 1em;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.related-btn:hover {
  background-color: #2980b9;
}
</style>
