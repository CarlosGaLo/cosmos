<template>
  <div class="article-detail-container">
    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      ❌ {{ error }}
      <button @click="$router.push('/wiki')" class="back-btn">
        ← Volver a la lista
      </button>
    </div>

    <!-- Contenido del artículo -->
    <div v-else-if="article" class="article-content">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/wiki" class="breadcrumb-link">Wiki</router-link>
        <span class="separator">/</span>
        <span class="breadcrumb-type">{{
          article.category || article.type || "wiki"
        }}</span>
        <span class="separator">/</span>
        <span class="breadcrumb-current">{{ article.title }}</span>
      </div>

      <!-- Header -->
      <header class="article-header">
        <div class="header-content">
          <span
            class="article-type-badge"
            :class="`type-${article.category || article.type || 'general'}`"
          >
            {{ (article.category || article.type || "Wiki").toUpperCase() }}
          </span>
          <h1 class="article-title">{{ article.title }}</h1>
        </div>
      </header>

      <!-- Metadata -->
      <div class="metadata-grid" v-if="hasMetadata">
        <div v-if="article.metadata?.nivelTecnologico" class="meta-card">
          <h3>🔧 Nivel Tecnológico</h3>
          <p class="meta-value">{{ article.metadata.nivelTecnologico }} / 5</p>
          <div class="tech-level-bar">
            <div
              class="tech-level-fill"
              :style="{ width: article.metadata.nivelTecnologico * 20 + '%' }"
            ></div>
          </div>
        </div>

        <div v-if="article.metadata?.religion?.length" class="meta-card">
          <h3>⛪ Religión</h3>
          <p class="meta-value">{{ article.metadata.religion.join(", ") }}</p>
        </div>

        <div v-if="article.metadata?.moneda?.length" class="meta-card">
          <h3>💰 Moneda</h3>
          <p class="meta-value">{{ article.metadata.moneda.join(", ") }}</p>
        </div>

        <div v-if="article.metadata?.divisionTerritorial" class="meta-card">
          <h3>🗺️ División Territorial</h3>
          <p class="meta-value">{{ article.metadata.divisionTerritorial }}</p>
        </div>

        <div v-if="article.metadata?.poblacion" class="meta-card">
          <h3>👥 Población</h3>
          <p class="meta-value">
            {{ formatNumber(article.metadata.poblacion) }}
          </p>
        </div>

        <div v-if="article.metadata?.idiomas?.length" class="meta-card">
          <h3>🗣️ Idiomas</h3>
          <p class="meta-value">{{ article.metadata.idiomas.join(", ") }}</p>
        </div>

        <div v-if="article.metadata?.planoTipo" class="meta-card">
          <h3>🌌 Tipo de Plano</h3>
          <p class="meta-value">{{ article.metadata.planoTipo }}</p>
        </div>

        <div v-if="article.metadata?.año" class="meta-card">
          <h3>📅 Año</h3>
          <p class="meta-value">{{ article.metadata.año }}</p>
        </div>
      </div>

      <!-- Contenido principal (renderizado seguro) -->
      <div class="article-body" v-html="articleHtml"></div>

      <!-- Secciones adicionales dinámicas (si prefieres renderizado por plantilla) -->
      <div v-if="normalizedSections.length">
        <section
          v-for="sec in normalizedSections"
          :key="sec.titulo"
          class="content-section"
        >
          <h2>{{ sec.titulo }}</h2>
          <div v-html="sanitize(markedInline(sec.contenido))"></div>
        </section>
      </div>

      <!-- Tags -->
      <div class="tags-section" v-if="article.tags?.length">
        <h3>🏷️ Etiquetas</h3>
        <div class="tags-container">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- Artículos relacionados -->
      <div v-if="article.relatedArticles?.length" class="related-section">
        <h2>🔗 Artículos Relacionados</h2>
        <div class="related-grid">
          <router-link
            v-for="related in article.relatedArticles"
            :key="related._id || related"
            :to="`/wiki/${related.slug || related}`"
            class="related-card"
          >
            <span
              class="related-type"
              :class="`type-${related.type || related.category || 'related'}`"
            >
              {{
                (related.type || related.category || "artículo").toUpperCase()
              }}
            </span>
            <h4>{{ related.title || related }}</h4>
          </router-link>
        </div>
      </div>

      <!-- Botón volver -->
      <div class="actions">
        <button @click="$router.push('/wiki')" class="back-button">
          ← Volver a la lista
        </button>
      </div>
    </div>

    <!-- No encontrado -->
    <div v-else class="not-found">
      <h2>📭 Artículo no encontrado</h2>
      <p>El artículo que buscas no existe o ha sido eliminado.</p>
      <button @click="$router.push('/wiki')" class="back-btn">
        ← Volver a la lista
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Config
const route = useRoute();
const API_URL = process.env.VUE_APP_API_URL || ""; // asegúrate que está definido en .env

// Estado
const article = ref(null);
const loading = ref(true);
const error = ref(null);

// Helpers
const formatNumber = (num) => {
  if (num == null || num === "") return "";
  return new Intl.NumberFormat("es-ES").format(num);
};

const hasMetadata = computed(() => {
  return !!(
    article.value &&
    article.value.metadata &&
    Object.keys(article.value.metadata).length > 0
  );
});

// --- Normalización del content ---
// Devuelve un objeto con keys conocidas y raw
function normalizeContent(rawContent) {
  if (!rawContent) return { raw: "" };
  if (typeof rawContent === "object") {
    // Asegurar que exista raw
    return { ...rawContent, raw: rawContent.raw ?? JSON.stringify(rawContent) };
  }

  // Si es string: tratamos con heurísticas
  const text = String(rawContent).trim();

  // Separar en bloques por doble salto
  const blocks = text
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const result = { raw: text };

  if (blocks.length === 1) {
    // Un único bloque -> descripcion (o raw)
    result.descripcion = blocks[0];
  } else if (blocks.length >= 2) {
    result.introduccion = blocks[0];
    // buscar sección con palabra 'historia' o 'historia:' en bloques
    const historiaBlock = blocks.find((b) => /\bhistoria\b/i.test(b));
    if (historiaBlock) {
      result.historia = historiaBlock;
      // resto como descripcion
      result.descripcion = blocks
        .filter((b) => b !== historiaBlock && b !== blocks[0])
        .join("\n\n");
    } else {
      result.descripcion = blocks.slice(1).join("\n\n");
    }
  }

  // Heurística extra: detectar líneas que empiezan con "- " o "*" y convertir en lista en renderizado
  // No las convertimos aquí, lo hará marked (si usas sintaxis - item)
  return result;
}

// Convierte objeto normalizado a HTML completo y sanitizado
function contentToHtml(contentObj) {
  // Preferir sección por sección si existen
  let htmlPieces = [];

  if (contentObj.introduccion) {
    htmlPieces.push(
      `<section class="content-section"><h2>Introducción</h2>${marked.parse(
        contentObj.introduccion
      )}</section>`
    );
  }
  if (contentObj.descripcion) {
    htmlPieces.push(
      `<section class="content-section"><h2>Descripción</h2>${marked.parse(
        contentObj.descripcion
      )}</section>`
    );
  }
  if (contentObj.historia) {
    htmlPieces.push(
      `<section class="content-section"><h2>Historia</h2>${marked.parse(
        contentObj.historia
      )}</section>`
    );
  }
  if (contentObj.limites) {
    htmlPieces.push(
      `<section class="content-section"><h2>Límites</h2>${marked.parse(
        contentObj.limites
      )}</section>`
    );
  }

  // Si hay secciones dinámicas en contentObj.secciones (array {titulo, contenido})
  if (Array.isArray(contentObj.secciones)) {
    contentObj.secciones.forEach((s) => {
      if (s && (s.titulo || s.contenido)) {
        htmlPieces.push(
          `<section class="content-section"><h2>${escapeHtml(
            s.titulo || ""
          )}</h2>${marked.parse(String(s.contenido || ""))}</section>`
        );
      }
    });
  }

  // Si no hay piezas pero existe raw, convertir raw en párrafos/markdown
  if (!htmlPieces.length && contentObj.raw) {
    htmlPieces.push(
      `<div class="content-section">${marked.parse(contentObj.raw)}</div>`
    );
  }

  const combined = htmlPieces.join("\n");
  return DOMPurify.sanitize(combined);
}

// utilidad: pequeño wrapper para inline markdown
function markedInline(text) {
  return marked.parseInline(String(text || ""));
}

function sanitize(html) {
  return DOMPurify.sanitize(html);
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Computeds para render
const normalizedContent = computed(() => {
  if (!article.value) return { raw: "" };
  return normalizeContent(article.value.content);
});

const articleHtml = computed(() => {
  if (!article.value) return "";
  return contentToHtml(normalizedContent.value);
});

// Además exponer secciones ordenadas si existen
const normalizedSections = computed(() => {
  if (!article.value) return [];
  const c = article.value.content;
  if (c && typeof c === "object" && Array.isArray(c.secciones)) {
    return [...c.secciones].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
  // si content tenía secciones dentro de metadata o similar, puedes adaptarlo aquí
  return [];
});

// --- Fetch article ---
// Intentamos varias rutas por compatibilidad con tu backend
async function requestArticleBySlug(slug) {
  // Prioridad: /wiki/articles/:slug (nueva estructura), fallback: /wiki/:slug (si tu server aún la expone)
  const candidates = [
    `${API_URL.replace(/\/$/, "")}/wiki/articles/${encodeURIComponent(slug)}`,
    `${API_URL.replace(/\/$/, "")}/wiki/${encodeURIComponent(slug)}`,
    `${API_URL.replace(/\/$/, "")}/articles/${encodeURIComponent(slug)}`,
    `${API_URL.replace(/\/$/, "")}/articles/${encodeURIComponent(slug)}`, // duplicate safe
  ];

  let lastError = null;
  for (const url of candidates) {
    try {
      const res = await axios.get(url);
      // tu API puede devolver { data: {...} } o {...} directamente
      const payload = res.data?.data ?? res.data;
      // si payload es array con un elemento, quizá devolvió listado -> intentar extraer
      if (Array.isArray(payload) && payload.length === 1) return payload[0];
      if (Array.isArray(payload) && payload.length > 1) return null; // listado
      return payload;
    } catch (err) {
      lastError = err;
      // si 404, seguir probando otros endpoints
      if (err.response && err.response.status === 404) continue;
      // otros errores: guardar y seguir al siguiente
      continue;
    }
  }
  throw (
    lastError ||
    new Error("No se pudo obtener artículo desde las rutas conocidas")
  );
}

const fetchArticle = async () => {
  loading.value = true;
  error.value = null;

  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Slug no proporcionado";
      loading.value = false;
      return;
    }

    const data = await requestArticleBySlug(slug);

    if (!data) {
      error.value = "No se encontró el artículo.";
      article.value = null;
    } else {
      // normalizar shape: tu modelo usa category, metadata, tags, relatedArticles...
      article.value = data;
    }
  } catch (err) {
    console.error("❌ Error al cargar artículo:", err);
    error.value = "Error al cargar el artículo.";
    article.value = null;
  } finally {
    loading.value = false;
  }
};

// Recargar cuando cambie el slug
watch(
  () => route.params.slug,
  () => {
    if (route.params.slug) fetchArticle();
  }
);

// Cargar al montar
onMounted(fetchArticle);
</script>

<style scoped>
/* Mantengo tu CSS original, más ajustes para el HTML generado */
.article-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 80px 20px;
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
  padding: 60px 20px;
  background: #ffebee;
  border-radius: 12px;
  color: #d32f2f;
}

.error .back-btn {
  margin-top: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
}

.breadcrumb-link {
  color: #4caf50;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-link:hover {
  color: #45a049;
  text-decoration: underline;
}

.separator {
  color: #ccc;
}

.breadcrumb-type {
  text-transform: capitalize;
  color: #888;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 3px solid #4caf50;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-type-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
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
  font-size: 40px;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1.2;
  margin: 0;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 32px 0;
}

.meta-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #4caf50;
}

.meta-card h3 {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.meta-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.tech-level-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
}

.tech-level-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.5s ease;
}

.article-body {
  line-height: 1.8;
  color: #444;
  margin: 32px 0;
}

/* Styling for markdown-generated elements */
.article-body h2 {
  font-size: 26px;
  color: #2c3e50;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.article-body p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin: 0.6rem 0;
  text-align: justify;
}

.article-body ul {
  margin: 0.6rem 0 1rem 1.2rem;
}

.article-body img {
  max-width: 100%;
  display: block;
  margin: 1rem 0;
  border-radius: 6px;
}

.content-section {
  margin: 32px 0;
}

.content-section h2 {
  font-size: 26px;
  color: #2c3e50;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  white-space: pre-line;
}

.effects-list,
.list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.effects-list li,
.list li {
  padding: 12px 16px;
  margin: 8px 0;
  background: #f5f5f5;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  font-size: 15px;
}

.tags-section {
  margin: 40px 0;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 12px;
}

.tags-section h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 16px 0;
}

.tags-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.related-section {
  margin: 48px 0;
  padding: 32px;
  background: #f5f5f5;
  border-radius: 12px;
}

.related-section h2 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 24px 0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.related-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.related-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: #4caf50;
}

.related-type {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-weight: bold;
}

.related-card h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
}

.actions {
  margin: 40px 0 20px 0;
  text-align: center;
}

.back-button,
.back-btn {
  padding: 14px 32px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-button:hover,
.back-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found h2 {
  font-size: 32px;
  color: #666;
  margin-bottom: 16px;
}

.not-found p {
  font-size: 18px;
  color: #888;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 28px;
  }

  .metadata-grid {
    grid-template-columns: 1fr;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .content-section h2 {
    font-size: 22px;
  }
}
</style>
