<template>
  <div class="articles-list-container">
    <div class="header">
      <h1 class="title">Wiki de Artículos</h1>

      <!-- Búsqueda -->
      <div class="search-box">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar artículos..."
          class="search-input"
        />
      </div>

      <!-- Filtros por tipo -->
      <div class="filters">
        <button
          v-for="type in articleTypes"
          :key="type"
          @click="filterByType(type)"
          :class="['filter-btn', { active: selectedType === type }]"
        >
          {{ type }}
        </button>
        <button @click="clearFilters" class="filter-btn clear-btn">
          Todos
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando artículos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">❌ {{ error }}</div>

    <!-- Lista de artículos -->
    <div v-else class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article._id"
        :article="article"
        @click="viewArticle(article.slug)"
      />
    </div>

    <!-- Sin resultados -->
    <div v-if="!loading && !error && articles.length === 0" class="no-results">
      No se encontraron artículos
    </div>

    <!-- Paginación -->
    <div v-if="pagination.pages > 1" class="pagination">
      <button
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="page-btn"
      >
        ← Anterior
      </button>
      <span class="page-info">
        Página {{ pagination.page }} de {{ pagination.pages }}
      </span>
      <button
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.pages"
        class="page-btn"
      >
        Siguiente →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ArticleCard from "./ArticleCard.vue";

const router = useRouter();
const API_URL = process.env.VUE_APP_API_URL;

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const selectedType = ref(null);
const articleTypes = [
  "region",
  "plano",
  "lugar",
  "personaje",
  "cronologia",
  "concepto",
];
const pagination = ref({
  page: 1,
  pages: 1,
  total: 0,
  limit: 20,
});

const fetchArticles = async () => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      includeUnpublished: "true", // <--- mostrar drafts también
    };

    if (selectedType.value) {
      params.type = selectedType.value;
    }

    const response = await axios.get(`${API_URL}/wiki`, { params });

    articles.value = response.data.data;
    pagination.value = response.data.pagination;
  } catch (err) {
    error.value = "No se pudieron cargar los artículos.";
    console.error("❌ Error al cargar artículos:", err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (searchQuery.value.length < 2) {
    fetchArticles();
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${API_URL}/articles/search`, {
      params: { q: searchQuery.value },
    });
    articles.value = response.data.data;
  } catch (err) {
    error.value = "Error en la búsqueda.";
    console.error("❌ Error en búsqueda:", err);
  } finally {
    loading.value = false;
  }
};

const filterByType = (type) => {
  selectedType.value = type;
  pagination.value.page = 1;
  fetchArticles();
};

const clearFilters = () => {
  selectedType.value = null;
  searchQuery.value = "";
  pagination.value.page = 1;
  fetchArticles();
};

const changePage = (page) => {
  pagination.value.page = page;
  fetchArticles();
};

const viewArticle = (slug) => {
  router.push(`/wiki/${slug}`);
};

onMounted(fetchArticles);
</script>

<style scoped>
.articles-list-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.search-box {
  margin: 20px 0;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.filter-btn {
  color: black;
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  text-transform: capitalize;
}

.filter-btn:hover {
  background: #f5f5f5;
  border-color: #bbb;
}

.filter-btn.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.clear-btn {
  background: #ff5722;
  color: white;
  border-color: #ff5722;
}

.clear-btn:hover {
  background: #e64a19;
  border-color: #e64a19;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin: 30px 0;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 40px 0;
  padding: 20px;
}

.page-btn {
  padding: 12px 24px;
  border: none;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    justify-content: flex-start;
  }
}
</style>
