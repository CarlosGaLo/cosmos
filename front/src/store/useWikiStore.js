import { defineStore } from 'pinia';
import axios from 'axios';

// ========================================
// CONFIGURACIÓN BASE
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';
const API_WIKI = `${API_BASE_URL}/api/wiki/articles`;

// ========================================
// STORE DE ARTÍCULOS WIKI
// ========================================

export const useWikiStore = defineStore('wiki', {
  
  // ========================================
  // STATE
  // ========================================
  
  state: () => ({
    // Artículos
    articles: [],
    currentArticle: null,
    featuredArticles: [],
    
    // Filtros y paginación
    filters: {
      category: null,
      status: 'published',
      tag: null,
      featured: null,
      search: ''
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    },
    
    // Historial de versiones
    articleHistory: [],
    selectedVersion: null,
    
    // Estados de carga
    loading: {
      articles: false,
      article: false,
      featured: false,
      history: false,
      saving: false
    },
    
    // Errores
    error: null,
    
    // Categorías disponibles
    categories: [
      { value: 'reglas', label: 'Reglas', icon: '📖' },
      { value: 'lore', label: 'Lore', icon: '🏰' },
      { value: 'guias', label: 'Guías', icon: '🗺️' },
      { value: 'mecanicas', label: 'Mecánicas', icon: '⚙️' },
      { value: 'razas', label: 'Razas', icon: '👥' },
      { value: 'hechizos', label: 'Hechizos', icon: '✨' },
      { value: 'clases', label: 'Clases', icon: '🎭' },
      { value: 'items', label: 'Items', icon: '🎒' },
      { value: 'criaturas', label: 'Criaturas', icon: '🐉' },
      { value: 'world', label: 'Mundo', icon: '🌍' }
    ]
  }),
  
  // ========================================
  // GETTERS
  // ========================================
  
  getters: {
    // Obtener artículos publicados
    publishedArticles: (state) => {
      return state.articles.filter(a => a.status === 'published');
    },
    
    // Obtener artículos por categoría
    articlesByCategory: (state) => (category) => {
      return state.articles.filter(a => a.category === category);
    },
    
    // Obtener artículo actual
    article: (state) => state.currentArticle,
    
    // Indica si hay artículos destacados
    hasFeaturedArticles: (state) => state.featuredArticles.length > 0,
    
    // Obtener label de categoría
    getCategoryLabel: (state) => (value) => {
      const cat = state.categories.find(c => c.value === value);
      return cat ? cat.label : value;
    },
    
    // Obtener icono de categoría
    getCategoryIcon: (state) => (value) => {
      const cat = state.categories.find(c => c.value === value);
      return cat ? cat.icon : '📄';
    },
    
    // Indica si hay más páginas
    hasMorePages: (state) => {
      return state.pagination.page < state.pagination.pages;
    }
  },
  
  // ========================================
  // ACTIONS
  // ========================================
  
  actions: {
    
    // ========================================
    // LECTURA DE ARTÍCULOS
    // ========================================
    
    /**
     * Obtener todos los artículos con filtros
     */
    async fetchArticles(options = {}) {
      this.loading.articles = true;
      this.error = null;
      
      try {
        const params = {
          page: options.page || this.pagination.page,
          limit: options.limit || this.pagination.limit,
          status: options.status || this.filters.status,
          category: options.category || this.filters.category,
          tag: options.tag || this.filters.tag,
          featured: options.featured || this.filters.featured,
          sort: options.sort || '-createdAt'
        };
        
        // Eliminar parámetros nulos
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });
        
        const response = await axios.get(API_WIKI, { params });
        
        this.articles = response.data.articles;
        this.pagination = response.data.pagination;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando artículos';
        console.error('Error fetching articles:', error);
        throw error;
      } finally {
        this.loading.articles = false;
      }
    },
    
    /**
     * Obtener artículos publicados
     */
    async fetchPublishedArticles(options = {}) {
      this.loading.articles = true;
      this.error = null;
      
      try {
        const params = {
          page: options.page || 1,
          limit: options.limit || 20,
          category: options.category || null
        };
        
        const response = await axios.get(`${API_WIKI}/published`, { params });
        
        this.articles = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando artículos';
        console.error('Error fetching published articles:', error);
        throw error;
      } finally {
        this.loading.articles = false;
      }
    },
    
    /**
     * Obtener artículos destacados
     */
    async fetchFeaturedArticles(limit = 5) {
      this.loading.featured = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/featured`, {
          params: { limit }
        });
        
        this.featuredArticles = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando destacados';
        console.error('Error fetching featured articles:', error);
        throw error;
      } finally {
        this.loading.featured = false;
      }
    },
    
    /**
     * Obtener artículo por slug
     */
    async fetchArticleBySlug(slug) {
      this.loading.article = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/slug/${slug}`);
        
        this.currentArticle = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Artículo no encontrado';
        console.error('Error fetching article by slug:', error);
        throw error;
      } finally {
        this.loading.article = false;
      }
    },
    
    /**
     * Obtener artículo por ID
     */
    async fetchArticleById(id) {
      this.loading.article = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/${id}`);
        
        this.currentArticle = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Artículo no encontrado';
        console.error('Error fetching article by id:', error);
        throw error;
      } finally {
        this.loading.article = false;
      }
    },
    
    /**
     * Buscar artículos
     */
    async searchArticles(query, options = {}) {
      this.loading.articles = true;
      this.error = null;
      
      try {
        const params = {
          q: query,
          category: options.category || null,
          limit: options.limit || 20
        };
        
        const response = await axios.get(`${API_WIKI}/search`, { params });
        
        this.articles = response.data;
        this.filters.search = query;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error en búsqueda';
        console.error('Error searching articles:', error);
        throw error;
      } finally {
        this.loading.articles = false;
      }
    },
    
    /**
     * Obtener artículos por categoría
     */
    async fetchArticlesByCategory(category, includeUnpublished = false) {
      this.loading.articles = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/category/${category}`, {
          params: { includeUnpublished }
        });
        
        this.articles = response.data;
        this.filters.category = category;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando categoría';
        console.error('Error fetching articles by category:', error);
        throw error;
      } finally {
        this.loading.articles = false;
      }
    },
    
    // ========================================
    // ESCRITURA DE ARTÍCULOS
    // ========================================
    
    /**
     * Crear nuevo artículo
     */
    async createArticle(articleData) {
      this.loading.saving = true;
      this.error = null;
      
      try {
        const response = await axios.post(API_WIKI, articleData);
        
        // Agregar a la lista
        this.articles.unshift(response.data);
        this.currentArticle = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error creando artículo';
        console.error('Error creating article:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    /**
     * Actualizar artículo
     */
    async updateArticle(id, articleData) {
      this.loading.saving = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_WIKI}/${id}`, articleData);
        
        // Actualizar en la lista
        const index = this.articles.findIndex(a => a._id === id);
        if (index !== -1) {
          this.articles[index] = response.data;
        }
        
        this.currentArticle = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error actualizando artículo';
        console.error('Error updating article:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    /**
     * Publicar artículo
     */
    async publishArticle(id) {
      this.loading.saving = true;
      this.error = null;
      
      try {
        const response = await axios.patch(`${API_WIKI}/${id}/publish`);
        
        // Actualizar en la lista
        const index = this.articles.findIndex(a => a._id === id);
        if (index !== -1) {
          this.articles[index] = response.data;
        }
        
        if (this.currentArticle?._id === id) {
          this.currentArticle = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error publicando artículo';
        console.error('Error publishing article:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    /**
     * Archivar artículo
     */
    async archiveArticle(id) {
      this.loading.saving = true;
      this.error = null;
      
      try {
        const response = await axios.patch(`${API_WIKI}/${id}/archive`);
        
        // Actualizar en la lista
        const index = this.articles.findIndex(a => a._id === id);
        if (index !== -1) {
          this.articles[index] = response.data;
        }
        
        if (this.currentArticle?._id === id) {
          this.currentArticle = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error archivando artículo';
        console.error('Error archiving article:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    /**
     * Dar like a artículo
     */
    async likeArticle(id) {
      try {
        const response = await axios.patch(`${API_WIKI}/${id}/like`);
        
        // Actualizar likes en currentArticle
        if (this.currentArticle?._id === id) {
          this.currentArticle.likes = response.data.likes;
        }
        
        return response.data;
      } catch (error) {
        console.error('Error liking article:', error);
        throw error;
      }
    },
    
    /**
     * Eliminar artículo (soft delete)
     */
    async deleteArticle(id) {
      this.loading.saving = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_WIKI}/${id}`);
        
        // Eliminar de la lista
        this.articles = this.articles.filter(a => a._id !== id);
        
        if (this.currentArticle?._id === id) {
          this.currentArticle = null;
        }
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error eliminando artículo';
        console.error('Error deleting article:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    // ========================================
    // HISTORIAL DE VERSIONES
    // ========================================
    
    /**
     * Obtener historial de artículo
     */
    async fetchArticleHistory(id, limit = 10) {
      this.loading.history = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/${id}/history`, {
          params: { limit }
        });
        
        this.articleHistory = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando historial';
        console.error('Error fetching history:', error);
        throw error;
      } finally {
        this.loading.history = false;
      }
    },
    
    /**
     * Obtener versión específica
     */
    async fetchArticleVersion(id, version) {
      this.loading.history = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_WIKI}/${id}/history/${version}`);
        
        this.selectedVersion = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error cargando versión';
        console.error('Error fetching version:', error);
        throw error;
      } finally {
        this.loading.history = false;
      }
    },
    
    /**
     * Restaurar versión específica
     */
    async restoreArticleVersion(id, version, author = 'Admin') {
      this.loading.saving = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_WIKI}/${id}/restore/${version}`, {
          author
        });
        
        this.currentArticle = response.data;
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error restaurando versión';
        console.error('Error restoring version:', error);
        throw error;
      } finally {
        this.loading.saving = false;
      }
    },
    
    // ========================================
    // UTILIDADES
    // ========================================
    
    /**
     * Limpiar artículo actual
     */
    clearCurrentArticle() {
      this.currentArticle = null;
    },
    
    /**
     * Limpiar historial
     */
    clearHistory() {
      this.articleHistory = [];
      this.selectedVersion = null;
    },
    
    /**
     * Resetear filtros
     */
    resetFilters() {
      this.filters = {
        category: null,
        status: 'published',
        tag: null,
        featured: null,
        search: ''
      };
      this.pagination.page = 1;
    },
    
    /**
     * Cambiar página
     */
    setPage(page) {
      this.pagination.page = page;
    },
    
    /**
     * Establecer filtro de categoría
     */
    setCategory(category) {
      this.filters.category = category;
      this.pagination.page = 1;
    }
  },
  
  // ========================================
  // PERSISTENCIA (OPCIONAL)
  // ========================================
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'wiki-filters',
        storage: localStorage,
        paths: ['filters', 'pagination.limit']
      }
    ]
  }
});