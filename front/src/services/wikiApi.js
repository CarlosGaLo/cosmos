import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

const wikiApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores
wikiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error);
    return Promise.reject(error);
  }
);

export default {
  // Obtener todos los artículos
  getAllArticles(params = {}) {
    return wikiApi.get("/articles", { params });
  },

  // Obtener artículo por slug
  getArticleBySlug(slug) {
    return wikiApi.get(`/articles/${slug}`);
  },

  // Obtener artículos por tipo
  getArticlesByType(type) {
    return wikiApi.get(`/articles/type/${type}`);
  },

  // Buscar artículos
  searchArticles(query) {
    return wikiApi.get("/articles/search", {
      params: { q: query },
    });
  },

  // Crear artículo
  createArticle(articleData) {
    return wikiApi.post("/articles", articleData);
  },

  // Actualizar artículo
  updateArticle(slug, articleData) {
    return wikiApi.put(`/articles/${slug}`, articleData);
  },

  // Eliminar artículo
  deleteArticle(slug) {
    return wikiApi.delete(`/articles/${slug}`);
  },

  // Obtener estadísticas
  getStats() {
    return wikiApi.get("/stats");
  },
};
