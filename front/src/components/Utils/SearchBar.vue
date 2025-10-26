<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      @input="handleSearch"
      placeholder="¿Qué quieres encontrar?"
      class="search-input"
    />

    <div v-if="searchResults.length > 0" class="search-results">
      <ul class="rule-list">
        <li
          v-for="(rule, index) in searchResults"
          :key="index"
          class="rule-item"
        >
          <router-link
            :to="`${getBaseUrl()}/${getRuleId(rule)}`"
            class="rule-link"
          >
            {{ getRuleTitle(rule) }}
            <span class="underline-hover"></span>
          </router-link>
        </li>
      </ul>
    </div>

    <p v-else-if="searchQuery" class="no-results">
      No se encontraron resultados para "{{ searchQuery }}".
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  apiUrl: {
    type: String,
    required: true,
  },
});

const searchQuery = ref("");
const rules = ref([]);
const searchResults = ref([]);

const fetchRules = async () => {
  try {
    const response = await axios.get(props.apiUrl);
    rules.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las reglas:", error);
  }
};

onMounted(fetchRules);
watch(() => props.apiUrl, fetchRules);

const getBaseUrl = () => {
  return props.apiUrl.includes("spells") ? "/spell" : "/rules";
};

const getRuleTitle = (rule) => {
  if (typeof rule === "string") return rule;
  return rule.title || rule.name || "Regla sin título"; // Añadido rule.name
};

const getRuleId = (rule) => {
  if (typeof rule === "string") return rule;
  return rule.sID || rule._id || "unknown";
};

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD") // Descompone caracteres acentuados
    .replace(/[̀-ͯ]/g, ""); // Elimina diacríticos (tildes, ñ)
};

const handleSearch = () => {
  const query = normalizeText(searchQuery.value.trim());
  if (!query) {
    searchResults.value = [];
    return;
  }

  searchResults.value = rules.value
    .filter((rule) => {
      if (typeof rule === "string") {
        return normalizeText(rule).includes(query);
      }
      return (
        (rule.title && normalizeText(rule.title).includes(query)) ||
        (rule.name && normalizeText(rule.name).includes(query)) ||
        (rule.sID && normalizeText(rule.sID).includes(query)) ||
        (rule._id && normalizeText(rule._id).includes(query)) ||
        (rule.description && normalizeText(rule.description).includes(query)) ||
        (rule.resume && normalizeText(rule.resume).includes(query)) ||
        (rule.tags &&
          Array.isArray(rule.tags) &&
          rule.tags.some((tag) => normalizeText(tag).includes(query)))
      );
    })
    .slice(0, 50);
};
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: #4a4e69;
  box-shadow: 0 0 8px rgba(74, 78, 105, 0.3);
}

.search-results {
  margin-top: 20px;
}

.rule-list {
  padding-left: 20px;
  margin-top: 5px;
}

.rule-item {
  list-style: disc;
  margin-bottom: 5px;
}

.rule-link {
  color: #2c3e50;
  text-decoration: none;
  position: relative;
  transition: color 0.3s;
}

.rule-link:hover {
  color: #1e2e40;
}

.rule-link:hover .underline-hover {
  width: 100%;
}

.underline-hover {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff6f61;
  transition: width 0.4s;
}

.no-results {
  margin-top: 10px;
  font-size: 1rem;
  color: #888;
  text-align: center;
}
</style>
