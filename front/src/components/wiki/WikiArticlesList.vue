<template>
  <div class="wiki-articles-list">
    <!-- Cabecera -->
    <div class="wiki-header">
      <h1 class="wiki-title">📚 Wiki de COSMOS ROL</h1>
      <p class="wiki-subtitle">Explora todo el contenido del juego de rol</p>
    </div>

    <!-- Filtros -->
    <div class="wiki-filters">
      <div class="filter-group">
        <label for="category-filter">Categoría:</label>
        <select
          id="category-filter"
          v-model="selectedCategory"
          @change="handleCategoryChange"
          class="filter-select"
        >
          <option :value="null">Todas las categorías</option>
          <option
            v-for="cat in wikiStore.categories"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.icon }} {{ cat.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label for="search-input">Buscar:</label>
        <input
          id="search-input"
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar artículos..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Artículos destacados -->
    <section
      v-if="showFeatured && wikiStore.hasFeaturedArticles"
      class="featured-section"
    >
      <h2 class="section-title">⭐ Artículos destacados</h2>
      <div class="featured-grid">
        <ArticleCard
          v-for="article in wikiStore.featuredArticles"
          :key="article._id"
          :article="article"
          featured
        />
      </div>
    </section>

    <!-- Estado de carga -->
    <div v-if="wikiStore.loading.articles" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando artículos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="wikiStore.error" class="error-state">
      <p>❌ {{ wikiStore.error }}</p>
      <button @click="loadArticles" class="btn-retry">Reintentar</button>
    </div>

    <!-- Lista de artículos -->
    <section v-else-if="wikiStore.articles.length > 0" class="articles-section">
      <h2 class="section-title">
        {{
          selectedCategory
            ? wikiStore.getCategoryLabel(selectedCategory)
            : "Todos los artículos"
        }}
      </h2>

      <div class="articles-grid">
        <ArticleCard
          v-for="article in wikiStore.articles"
          :key="article._id"
          :article="article"
        />
      </div>

      <!-- Paginación -->
      <div v-if="wikiStore.pagination.pages > 1" class="pagination">
        <button
          @click="prevPage"
          :disabled="wikiStore.pagination.page === 1"
          class="btn-page"
        >
          ← Anterior
        </button>

        <span class="page-info">
          Página {{ wikiStore.pagination.page }} de
          {{ wikiStore.pagination.pages }}
        </span>

        <button
          @click="nextPage"
          :disabled="!wikiStore.hasMorePages"
          class="btn-page"
        >
          Siguiente →
        </button>
      </div>
    </section>

    <!-- Sin resultados -->
    <div v-else class="empty-state">
      <p>📭 No se encontraron artículos</p>
      <button @click="resetFilters" class="btn-reset">Limpiar filtros</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useWikiStore } from "@/stores/useWikiStore";
import ArticleCard from "./ArticleCard.vue";

// Store
const wikiStore = useWikiStore();

// Props
const props = defineProps({
  showFeatured: {
    type: Boolean,
    default: true,
  },
  initialCategory: {
    type: String,
    default: null,
  },
});

// State local
const selectedCategory = ref(props.initialCategory);
const searchQuery = ref("");
let searchTimeout = null;

// ========================================
// FUNCIONES
// ========================================

const loadArticles = async () => {
  try {
    await wikiStore.fetchArticles({
      category: selectedCategory.value,
      status: "published",
    });
  } catch (error) {
    console.error("Error loading articles:", error);
  }
};

const loadFeatured = async () => {
  if (props.showFeatured) {
    try {
      await wikiStore.fetchFeaturedArticles(5);
    } catch (error) {
      console.error("Error loading featured:", error);
    }
  }
};

const handleCategoryChange = () => {
  wikiStore.setCategory(selectedCategory.value);
  loadArticles();
};

const handleSearch = () => {
  // Debounce para no hacer muchas peticiones
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    if (searchQuery.value.trim().length > 2) {
      try {
        await wikiStore.searchArticles(searchQuery.value, {
          category: selectedCategory.value,
        });
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else if (searchQuery.value.trim().length === 0) {
      loadArticles();
    }
  }, 500);
};

const resetFilters = () => {
  selectedCategory.value = null;
  searchQuery.value = "";
  wikiStore.resetFilters();
  loadArticles();
};

const nextPage = () => {
  if (wikiStore.hasMorePages) {
    wikiStore.setPage(wikiStore.pagination.page + 1);
    loadArticles();
  }
};

const prevPage = () => {
  if (wikiStore.pagination.page > 1) {
    wikiStore.setPage(wikiStore.pagination.page - 1);
    loadArticles();
  }
};

// ========================================
// LIFECYCLE
// ========================================

onMounted(async () => {
  await loadFeatured();
  await loadArticles();
});

// Watch para cambios en la categoría desde props
watch(
  () => props.initialCategory,
  (newCat) => {
    selectedCategory.value = newCat;
    handleCategoryChange();
  }
);
</script>

<style scoped>
.wiki-articles-list {
  max-width: 1200px;
  margin: 0 2vw;
  padding: 2rem 1rem;
}

.wiki-header {
  text-align: center;
  margin-bottom: 3rem;
}

.wiki-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary, #2c3e50);
  margin-bottom: 0.5rem;
}

.wiki-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-light, #7f8c8d);
}

/* Filtros */
.wiki-filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text, #2c3e50);
}

.filter-select,
.filter-input {
  padding: 0.75rem;
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary, #3498db);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Secciones */
.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: var(--color-primary, #2c3e50);
}

.featured-section {
  margin-bottom: 3rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.articles-section {
  margin-top: 3rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Estados */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  border-radius: 8px;
  background: var(--color-bg-light, #f8f9fa);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border, #ddd);
  border-top-color: var(--color-primary, #3498db);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 2vw 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Botones */
.btn-retry,
.btn-reset {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #3498db);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry:hover,
.btn-reset:hover {
  background: var(--color-primary-dark, #2980b9);
  transform: translateY(-2px);
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-page {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #3498db);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-page:hover:not(:disabled) {
  background: var(--color-primary-dark, #2980b9);
  transform: translateY(-2px);
}

.btn-page:disabled {
  background: var(--color-disabled, #bdc3c7);
  cursor: not-allowed;
  transform: none;
}

.page-info {
  font-weight: 600;
  color: var(--color-text, #2c3e50);
}

/* Responsive */
@media (max-width: 768px) {
  .wiki-title {
    font-size: 2rem;
  }

  .wiki-filters {
    flex-direction: column;
  }

  .featured-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
