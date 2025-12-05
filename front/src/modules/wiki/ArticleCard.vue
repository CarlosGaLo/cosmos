<template>
  <div class="article-card" @click="$emit('click')">
    <div class="card-header">
      <span class="article-type" :class="`type-${article.type}`">
        {{ article.type }}
      </span>
    </div>

    <h3 class="article-title">{{ article.title }}</h3>

    <p class="article-description" v-if="article.content?.descripcion">
      {{ truncateText(article.content.descripcion, 150) }}
    </p>

    <p class="article-description" v-else-if="article.content?.introduccion">
      {{ truncateText(article.content.introduccion, 150) }}
    </p>

    <!-- Metadata -->
    <div class="article-metadata" v-if="hasMetadata">
      <span v-if="article.metadata?.nivelTecnologico" class="meta-item">
        🔧 Nivel {{ article.metadata.nivelTecnologico }}
      </span>
      <span v-if="article.metadata?.religion?.length" class="meta-item">
        ⛪ {{ article.metadata.religion[0] }}
      </span>
      <span v-if="article.metadata?.poblacion" class="meta-item">
        👥 {{ formatNumber(article.metadata.poblacion) }}
      </span>
    </div>

    <!-- Tags -->
    <div class="article-tags" v-if="article.tags?.length">
      <span v-for="tag in article.tags.slice(0, 4)" :key="tag" class="tag">
        {{ tag }}
      </span>
    </div>

    <!-- Leer más -->
    <div class="read-more">Ver detalles →</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

defineEmits(["click"]);

const hasMetadata = computed(() => {
  return (
    props.article.metadata && Object.keys(props.article.metadata).length > 0
  );
});

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const formatNumber = (num) => {
  if (!num) return "";
  return new Intl.NumberFormat("es-ES").format(num);
};
</script>

<style scoped>
.article-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: #4caf50;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.article-type {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-region {
  background: #4caf50;
  color: white;
}

.type-plano {
  background: #9c27b0;
  color: white;
}

.type-lugar {
  background: #2196f3;
  color: white;
}

.type-personaje {
  background: #ff9800;
  color: white;
}

.type-cronologia {
  background: #f44336;
  color: white;
}

.type-concepto {
  background: #00bcd4;
  color: white;
}

.type-organizacion {
  background: #795548;
  color: white;
}

.type-evento {
  background: #e91e63;
  color: white;
}

.type-cultura {
  background: #673ab7;
  color: white;
}

.article-title {
  font-size: 22px;
  font-weight: bold;
  color: #2c3e50;
  margin: 8px 0 12px 0;
  line-height: 1.3;
}

.article-description {
  color: #666;
  line-height: 1.6;
  margin: 12px 0;
  flex-grow: 1;
  font-size: 14px;
}

.article-metadata {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 16px 0;
  font-size: 13px;
}

.meta-item {
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #555;
  white-space: nowrap;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0 12px 0;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.read-more {
  color: #4caf50;
  font-weight: 600;
  font-size: 14px;
  margin-top: auto;
  padding-top: 12px;
  transition: all 0.3s;
}

.article-card:hover .read-more {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .article-card {
    padding: 18px;
    min-height: auto;
  }

  .article-title {
    font-size: 18px;
  }
}
</style>
