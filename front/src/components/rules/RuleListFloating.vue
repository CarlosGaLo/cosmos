<template>
  <div class="rule-list-container">
    <SearchBar api-url="http://localhost:3000/api/rules/"></SearchBar>
    <h1 class="title">Listado de Reglas</h1>

    <div
      v-for="(subcategories, category) in groupedRules"
      :key="category"
      class="accordion"
    >
      <button class="accordion-header" @click="toggleCategory(category)">
        {{ category }}
        <span :class="{ rotate: isOpenCategory(category) }">▼</span>
      </button>

      <div v-show="isOpenCategory(category)" class="accordion-content">
        <div
          v-for="(rules, subcategory) in subcategories"
          :key="subcategory"
          class="subcategory"
        >
          <button
            v-if="subcategory"
            class="subcategory-header"
            @click="toggleSubcategory(category, subcategory)"
          >
            {{ subcategory }}
            <span :class="{ rotate: isOpenSubcategory(category, subcategory) }"
              >▼</span
            >
          </button>

          <ul
            v-show="isOpenSubcategory(category, subcategory)"
            class="rule-list"
          >
            <li v-for="rule in rules" :key="rule.sID" class="rule-item">
              <button class="rule-link" @click="changeSelectedRule(rule.sID)">
                {{ rule.title }}
                <span class="underline-hover"></span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRulesStore } from "@/store/rulesStore";
import SearchBar from "../Utils/SearchBar.vue";

const rulesStore = useRulesStore(); // Instancia de la store

// Cargar reglas al montar el componente
onMounted(() => {
  rulesStore.fetchAllRules();
});

// Computed para agrupar reglas por categoría y subcategoría
const groupedRules = computed(() => {
  const grouped = {};

  rulesStore.rules.forEach((rule) => {
    const category = rule.category || "Sin categoría";
    const subcategory = rule.subcategory || "General";

    if (!grouped[category]) {
      grouped[category] = {};
    }
    if (!grouped[category][subcategory]) {
      grouped[category][subcategory] = [];
    }

    grouped[category][subcategory].push(rule);
  });

  return grouped;
});

const openCategories = ref({});
const openSubcategories = ref({});

const toggleCategory = (category) => {
  openCategories.value[category] = !openCategories.value[category];
};

const isOpenCategory = (category) => {
  return openCategories.value[category] || false;
};

const toggleSubcategory = (category, subcategory) => {
  if (!openSubcategories.value[category]) {
    openSubcategories.value[category] = {};
  }
  openSubcategories.value[category][subcategory] =
    !openSubcategories.value[category][subcategory];
};

const isOpenSubcategory = (category, subcategory) => {
  return (
    (openSubcategories.value[category] &&
      openSubcategories.value[category][subcategory]) ||
    false
  );
};

const changeSelectedRule = async (ruleSID) => {
  if (ruleSID) {
    await rulesStore.fetchRuleByIdOrName(ruleSID);
  }
};
</script>

<style scoped>
/* Tipografía */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
* {
  box-sizing: border-box;
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
}

/* Contenedor Principal */
.rule-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Título */
.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

/* Accordion */
.accordion {
  margin-bottom: 15px;
}

.accordion-header {
  background: #3b3b58;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 5px;
  transition: background 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-header:hover {
  background: #2c2c46;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.accordion-content {
  padding: 10px 15px;
  background: #e0e0e8;
  border-left: 4px solid #3b3b58;
  border-radius: 0 5px 5px 5px;
}

.subcategory-header {
  background: #6a5f8a;
  color: white;
  cursor: pointer;
  padding: 8px 15px;
  width: 100%;
  text-align: left;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 5px;
  transition: background 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.subcategory-header:hover {
  background: #5b5177;
}

/* Lista de reglas */
.rule-list {
  padding-left: 20px;
  margin-top: 5px;
}

.rule-item {
  list-style: disc;
  margin-bottom: 5px;
}

/* Enlaces interactivos */
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
</style>
