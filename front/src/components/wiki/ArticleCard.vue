<template>
  <router-link 
    :to="`/wiki/${article.category}/${article.slug}`" 
    class="article-card"
    :class="{ 'article-card--featured': featured }"
  >
    <!-- Imagen destacada -->
    <div class="article-card__image">
      <img 
        v-if="article.featuredImage?.url" 
        :src="article.featuredImage.url" 
        :alt="article.featuredImage.alt || article.title"
        loading="lazy"
      >
      <div v-else class="article-card__placeholder">
        <span class="placeholder-icon">
          {{ categoryIcon }}
        </span>
      </div>
      
      <!-- Badge de categoría -->
      <span class="article-card__badge">
        {{ categoryLabel }}
      </span>
      
      <!-- Badge de destacado -->
      <span v-if="featured" class="article-card__featured-badge">
        ⭐ Destacado
      </span>
    </div>

    <!-- Contenido -->
    <div class="article-card__content">
      <h3 class="article-card__title">{{ article.title }}</h3>
      
      <p v-if="article.excerpt" class="article-card__excerpt">
        {{ truncatedExcerpt }}
      </p>

      <!-- Meta información -->
      <div class="article-card__meta">
        <span class="meta-item">
          <span class="meta-icon">👁️</span>
          {{ article.views || 0 }} vistas
        </span>
        
        <span class="meta-item">
          <span class="meta-icon">❤️</span>
          {{ article.likes || 0 }} likes
        </span>
        
        <span v-if="article.readingTime" class="meta-item">
          <span class="meta-icon">⏱️</span>
          {{ article.readingTime }} min
        </span>
      </div>

      <!-- Tags -->
      <div v-if="showTags && article.tags?.length > 0" class="article-card__tags">
        <span 
          v-for="tag in article.tags.slice(0, 3)" 
          :key="tag" 
          class="tag"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Fecha de publicación -->
      <div class="article-card__footer">
        <span class="article-card__date">
          {{ formattedDate }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useWikiStore } from '@/stores/useWikiStore';

// Props
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  showTags: {
    type: Boolean,
    default: true
  },
  excerptLength: {
    type: Number,
    default: 150
  }
});

// Store
const wikiStore = useWikiStore();

// ========================================
// COMPUTED
// ========================================

const categoryLabel = computed(() => {
  return wikiStore.getCategoryLabel(props.article.category);
});

const categoryIcon = computed(() => {
  return wikiStore.getCategoryIcon(props.article.category);
});

const truncatedExcerpt = computed(() => {
  if (!props.article.excerpt) return '';
  
  if (props.article.excerpt.length <= props.excerptLength) {
    return props.article.excerpt;
  }
  
  return props.article.excerpt.substring(0, props.excerptLength) + '...';
});

const formattedDate = computed(() => {
  if (!props.article.publishedAt && !props.article.createdAt) {
    return 'Sin fecha';
  }
  
  const date = new Date(props.article.publishedAt || props.article.createdAt);
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
});
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.article-card--featured {
  border: 3px solid var(--color-accent, #f39c12);
}

/* Imagen */
.article-card__image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-light, #f8f9fa);
}

.article-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-card__image img {
  transform: scale(1.05);
}

.article-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-icon {
  font-size: 4rem;
}

/* Badges */
.article-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.article-card__featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.4rem 0.8rem;
  background: var(--color-accent, #f39c12);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Contenido */
.article-card__content {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  flex-grow: 1;
}

.article-card__title {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-primary, #2c3e50);
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__excerpt {
  font-size: 0.95rem;
  color: var(--color-text-light, #7f8c8d);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
}

/* Meta */
.article-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--color-text-light, #7f8c8d);
}

.meta-icon {
  font-size: 1rem;
}

/* Tags */
.article-card__tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.3rem 0.7rem;
  background: var(--color-bg-light, #f8f9fa);
  color: var(--color-primary, #3498db);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Footer */
.article-card__footer {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #ecf0f1);
  margin-top: auto;
}

.article-card__date {
  font-size: 0.85rem;
  color: var(--color-text-light, #95a5a6);
}

/* Responsive */
@media (max-width: 768px) {
  .article-card__image {
    height: 150px;
  }

  .article-card__title {
    font-size: 1.1rem;
  }

  .article-card__content {
    padding: 1rem;
  }
}
</style>