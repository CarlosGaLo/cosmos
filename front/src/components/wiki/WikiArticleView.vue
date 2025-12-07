<template>
  <div class="wiki-article-view">
    <!-- Estado de carga -->
    <div v-if="wikiStore.loading.article" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <!-- Error -->
    <div v-else-if="wikiStore.error" class="error-container">
      <h2>❌ Error</h2>
      <p>{{ wikiStore.error }}</p>
      <router-link to="/wiki" class="btn-back">← Volver a la wiki</router-link>
    </div>

    <!-- Artículo -->
    <article v-else-if="article" class="article">
      <!-- Cabecera -->
      <header class="article-header">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/wiki">Wiki</router-link>
          <span class="separator">›</span>
          <router-link :to="`/wiki?category=${article.category}`">
            {{ categoryIcon }} {{ categoryLabel }}
          </router-link>
          <span class="separator">›</span>
          <span class="current">{{ article.title }}</span>
        </nav>

        <!-- Badge de categoría -->
        <div class="article-badges">
          <span class="badge badge-category">
            {{ categoryIcon }} {{ categoryLabel }}
          </span>
          <span v-if="article.featured" class="badge badge-featured">
            ⭐ Destacado
          </span>
          <span v-if="article.status === 'draft'" class="badge badge-draft">
            📝 Borrador
          </span>
        </div>

        <!-- Título -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- Meta información -->
        <div class="article-meta">
          <span class="meta-item">
            <span class="icon">✍️</span>
            Por <strong>{{ article.author }}</strong>
          </span>

          <span class="meta-item">
            <span class="icon">📅</span>
            {{ formattedDate }}
          </span>

          <span class="meta-item">
            <span class="icon">👁️</span>
            {{ article.views || 0 }} vistas
          </span>

          <span v-if="article.readingTime" class="meta-item">
            <span class="icon">⏱️</span>
            {{ article.readingTime }} min de lectura
          </span>
        </div>

        <!-- Imagen destacada -->
        <div v-if="article.featuredImage?.url" class="featured-image">
          <img
            :src="article.featuredImage.url"
            :alt="article.featuredImage.alt || article.title"
          />
          <p v-if="article.featuredImage.caption" class="image-caption">
            {{ article.featuredImage.caption }}
          </p>
        </div>
      </header>

      <!-- Contenido principal -->
      <div class="article-content">
        <!-- Excerpt -->
        <div v-if="article.excerpt" class="article-excerpt">
          {{ article.excerpt }}
        </div>

        <!-- Contenido HTML -->
        <div class="article-body" v-html="article.content"></div>

        <!-- Tags -->
        <div v-if="article.tags?.length > 0" class="article-tags">
          <h3 class="tags-title">🏷️ Etiquetas:</h3>
          <div class="tags-list">
            <span v-for="tag in article.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Galería de imágenes -->
        <div v-if="article.gallery?.length > 0" class="article-gallery">
          <h3 class="gallery-title">🖼️ Galería</h3>
          <div class="gallery-grid">
            <div
              v-for="(image, index) in article.gallery"
              :key="index"
              class="gallery-item"
            >
              <img :src="image.url" :alt="image.alt || `Imagen ${index + 1}`" />
              <p v-if="image.caption" class="gallery-caption">
                {{ image.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="article-actions">
        <button
          @click="likeArticle"
          class="btn-action btn-like"
          :class="{ liked: hasLiked }"
        >
          ❤️ Me gusta {{ article.likes > 0 ? `(${article.likes})` : "" }}
        </button>

        <button @click="shareArticle" class="btn-action btn-share">
          📤 Compartir
        </button>
      </div>

      <!-- Artículos relacionados -->
      <section
        v-if="article.relatedArticles?.length > 0"
        class="related-articles"
      >
        <h2 class="section-title">📚 Artículos relacionados</h2>
        <div class="related-grid">
          <ArticleCard
            v-for="related in article.relatedArticles"
            :key="related._id"
            :article="related"
            :show-tags="false"
          />
        </div>
      </section>

      <!-- Navegación -->
      <div class="article-navigation">
        <router-link to="/wiki" class="btn-nav">
          ← Volver a la wiki
        </router-link>

        <router-link :to="`/wiki?category=${article.category}`" class="btn-nav">
          Ver más de {{ categoryLabel }}
        </router-link>
      </div>
    </article>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <h2>📭 Artículo no encontrado</h2>
      <p>El artículo que buscas no existe o ha sido eliminado.</p>
      <router-link to="/wiki" class="btn-back">← Volver a la wiki</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useWikiStore } from "@/stores/useWikiStore";
import ArticleCard from "./ArticleCard.vue";

// Store y route
const wikiStore = useWikiStore();
const route = useRoute();

// Props
const props = defineProps({
  slug: {
    type: String,
    default: null,
  },
});

// State local
const hasLiked = ref(false);

// ========================================
// COMPUTED
// ========================================

const article = computed(() => wikiStore.currentArticle);

const categoryLabel = computed(() => {
  if (!article.value) return "";
  return wikiStore.getCategoryLabel(article.value.category);
});

const categoryIcon = computed(() => {
  if (!article.value) return "";
  return wikiStore.getCategoryIcon(article.value.category);
});

const formattedDate = computed(() => {
  if (!article.value) return "";

  const date = new Date(article.value.publishedAt || article.value.createdAt);

  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
});

// ========================================
// FUNCIONES
// ========================================

const loadArticle = async () => {
  const slug = props.slug || route.params.slug;

  if (!slug) {
    console.error("No slug provided");
    return;
  }

  try {
    await wikiStore.fetchArticleBySlug(slug);

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error loading article:", error);
  }
};

const likeArticle = async () => {
  if (!article.value || hasLiked.value) return;

  try {
    await wikiStore.likeArticle(article.value._id);
    hasLiked.value = true;

    // Guardar en localStorage
    localStorage.setItem(`liked-${article.value._id}`, "true");
  } catch (error) {
    console.error("Error liking article:", error);
  }
};

const shareArticle = () => {
  if (!article.value) return;

  const url = window.location.href;
  const text = `${article.value.title} - Wiki COSMOS ROL`;

  if (navigator.share) {
    navigator
      .share({
        title: article.value.title,
        text: article.value.excerpt || text,
        url: url,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    // Fallback: copiar al portapapeles
    navigator.clipboard.writeText(url).then(() => {
      alert("¡Enlace copiado al portapapeles!");
    });
  }
};

const checkIfLiked = () => {
  if (!article.value) return;
  hasLiked.value =
    localStorage.getItem(`liked-${article.value._id}`) === "true";
};

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  loadArticle();
  checkIfLiked();
});

watch(
  () => route.params.slug,
  () => {
    if (route.params.slug) {
      loadArticle();
      checkIfLiked();
    }
  }
);

watch(article, () => {
  if (article.value) {
    checkIfLiked();
  }
});
</script>

<style scoped>
.wiki-article-view {
  max-width: 900px;
  margin: 0 2vw;
  padding: 2rem 1rem;
}

/* Loading y Error */
.loading-container,
.error-container,
.not-found {
  text-align: center;
  padding: 4rem 2rem;
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

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--color-primary, #3498db);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: var(--color-primary-dark, #2980b9);
  text-decoration: underline;
}

.separator {
  color: var(--color-text-light, #95a5a6);
}

.current {
  color: var(--color-text, #2c3e50);
  font-weight: 600;
}

/* Cabecera */
.article-header {
  margin-bottom: 3rem;
}

.article-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-category {
  background: var(--color-primary, #3498db);
  color: white;
}

.badge-featured {
  background: var(--color-accent, #f39c12);
  color: white;
}

.badge-draft {
  background: var(--color-warning, #e74c3c);
  color: white;
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary, #2c3e50);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-light, #7f8c8d);
  font-size: 0.95rem;
}

.icon {
  font-size: 1.1rem;
}

/* Imagen destacada */
.featured-image {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-caption {
  padding: 1rem;
  background: var(--color-bg-light, #f8f9fa);
  color: var(--color-text-light, #7f8c8d);
  font-size: 0.9rem;
  font-style: italic;
  text-align: center;
}

/* Contenido */
.article-content {
  line-height: 1.8;
  color: var(--color-text, #2c3e50);
}

.article-excerpt {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text-light, #7f8c8d);
  padding: 1.5rem;
  background: var(--color-bg-light, #f8f9fa);
  border-left: 4px solid var(--color-primary, #3498db);
  margin-bottom: 2rem;
  border-radius: 4px;
}

.article-body {
  margin-bottom: 3rem;
}

.article-body :deep(h2) {
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--color-primary, #2c3e50);
}

.article-body :deep(h3) {
  font-size: 1.4rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-primary, #2c3e50);
}

.article-body :deep(p) {
  margin-bottom: 1rem;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-body :deep(li) {
  margin-bottom: 0.5rem;
}

.article-body :deep(code) {
  background: var(--color-bg-light, #f8f9fa);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

/* Tags */
.article-tags {
  margin: 3rem 0;
  padding: 1.5rem;
  background: var(--color-bg-light, #f8f9fa);
  border-radius: 8px;
}

.tags-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--color-primary, #2c3e50);
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.4rem 0.8rem;
  background: white;
  color: var(--color-primary, #3498db);
  border: 2px solid var(--color-primary, #3498db);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tag:hover {
  background: var(--color-primary, #3498db);
  color: white;
}

/* Galería */
.article-gallery {
  margin: 3rem 0;
}

.gallery-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary, #2c3e50);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-light, #f8f9fa);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.gallery-caption {
  padding: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-light, #7f8c8d);
  text-align: center;
}

/* Acciones */
.article-actions {
  display: flex;
  gap: 1rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-like {
  background: var(--color-bg-light, #f8f9fa);
  color: var(--color-text, #2c3e50);
  border: 2px solid var(--color-border, #ddd);
}

.btn-like:hover,
.btn-like.liked {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.btn-share {
  background: var(--color-primary, #3498db);
  color: white;
}

.btn-share:hover {
  background: var(--color-primary-dark, #2980b9);
  transform: translateY(-2px);
}

/* Artículos relacionados */
.related-articles {
  margin: 4rem 0;
  padding: 2rem;
  background: var(--color-bg-light, #f8f9fa);
  border-radius: 12px;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary, #2c3e50);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Navegación */
.article-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.btn-nav,
.btn-back {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary, #3498db);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-nav:hover,
.btn-back:hover {
  background: var(--color-primary-dark, #2980b9);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
