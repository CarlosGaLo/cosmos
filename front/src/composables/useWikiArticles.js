// composables/useWikiArticles.js
// Composable reutilizable para gestionar artículos de la wiki

import { ref, computed } from "vue";
import axios from "axios";

export function useWikiArticles() {
  const API_URL = process.env.VUE_APP_API_URL;

  const articles = ref([]);
  const currentArticle = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  // Computed
  const hasArticles = computed(() => articles.value.length > 0);
  const isFirstPage = computed(() => pagination.value.page === 1);
  const isLastPage = computed(
    () => pagination.value.page === pagination.value.pages
  );

  // Obtener todos los artículos
  const fetchArticles = async (params = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params,
      };

      const response = await axios.get(`${API_URL}/wiki`, {
        params: queryParams,
      });

      articles.value = response.data.data;
      pagination.value = response.data.pagination;
    } catch (err) {
      error.value = "No se pudieron cargar los artículos.";
      console.error("❌ Error al cargar artículos:", err);
    } finally {
      loading.value = false;
    }
  };

  // Obtener artículo por slug
  const fetchArticleBySlug = async (slug) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_URL}/wiki/${slug}`);

      if (response.data.success) {
        currentArticle.value = response.data.data;
      } else {
        error.value = "No se encontró el artículo.";
      }
    } catch (err) {
      error.value = "Error al cargar el artículo.";
      console.error("❌ Error al cargar artículo:", err);
    } finally {
      loading.value = false;
    }
  };

  // Obtener artículos por tipo
  const fetchArticlesByType = async (type) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_URL}/wiki/type/${type}`);

      if (response.data.success) {
        articles.value = response.data.data;
      }
    } catch (err) {
      error.value = `No se pudieron cargar los artículos de tipo ${type}.`;
      console.error("❌ Error al cargar artículos por tipo:", err);
    } finally {
      loading.value = false;
    }
  };

  // Buscar artículos
  const searchArticles = async (query) => {
    if (!query || query.length < 2) {
      return fetchArticles();
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_URL}/wiki/search`, {
        params: { q: query },
      });

      articles.value = response.data.data;
    } catch (err) {
      error.value = "Error en la búsqueda.";
      console.error("❌ Error en búsqueda:", err);
    } finally {
      loading.value = false;
    }
  };

  // Crear artículo
  const createArticle = async (articleData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.post(`${API_URL}/wiki`, articleData);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      error.value = "Error al crear el artículo.";
      console.error("❌ Error al crear artículo:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar artículo
  const updateArticle = async (slug, articleData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.put(
        `${API_URL}/wiki/${slug}`,
        articleData
      );

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      error.value = "Error al actualizar el artículo.";
      console.error("❌ Error al actualizar artículo:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar artículo
  const deleteArticle = async (slug) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.delete(`${API_URL}/wiki/${slug}`);

      if (response.data.success) {
        return true;
      }
    } catch (err) {
      error.value = "Error al eliminar el artículo.";
      console.error("❌ Error al eliminar artículo:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_URL}/stats`);

      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      error.value = "Error al obtener estadísticas.";
      console.error("❌ Error al obtener estadísticas:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Navegación de páginas
  const nextPage = () => {
    if (!isLastPage.value) {
      pagination.value.page++;
      fetchArticles();
    }
  };

  const prevPage = () => {
    if (!isFirstPage.value) {
      pagination.value.page--;
      fetchArticles();
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.value.pages) {
      pagination.value.page = page;
      fetchArticles();
    }
  };

  return {
    // State
    articles,
    currentArticle,
    loading,
    error,
    pagination,

    // Computed
    hasArticles,
    isFirstPage,
    isLastPage,

    // Methods
    fetchArticles,
    fetchArticleBySlug,
    fetchArticlesByType,
    searchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    fetchStats,
    nextPage,
    prevPage,
    goToPage,
  };
}
