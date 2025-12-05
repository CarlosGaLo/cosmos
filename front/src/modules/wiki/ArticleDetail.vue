<template>
  <div class="article-detail-container">
    <!-- Loading / Error / Not found stays igual -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <div v-else-if="error" class="error">
      ❌ {{ error }}
      <button @click="$router.push('/wiki')" class="back-btn">
        ← Volver a la lista
      </button>
    </div>

    <!-- MODO EDICIÓN: renderizamos editor inline -->
    <ArticleEditor
      v-if="editMode && article && showEditor"
      :initial="article"
      @saved="onEditorSaved"
      @cancel="onEditorCancel"
    />

    <!-- Contenido del artículo (vista) -->
    <div v-else-if="article" class="article-content" @keydown.ctrl.e.prevent>
      <!-- Breadcrumb y header igual que antes -->
      <div class="breadcrumb">
        <router-link to="/wiki" class="breadcrumb-link">Wiki</router-link>
        <span class="separator">/</span>
        <span class="breadcrumb-type">{{
          article.category || article.type || "wiki"
        }}</span>
        <span class="separator">/</span>
        <span class="breadcrumb-current">{{ article.title }}</span>
      </div>

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

        <!-- Botón visible para entrar en edición también -->
        <div class="header-actions">
          <button @click="enableEditMode" class="edit-btn">
            ✎ Editar (Ctrl+E)
          </button>
        </div>
      </header>

      <!-- Metadata, contenido y resto igual -->
      <div class="metadata-grid" v-if="hasMetadata">...</div>

      <div class="article-body" v-html="articleHtml"></div>

      <!-- resto del template (tags, related, actions...) -->
      <div class="tags-section" v-if="article.tags?.length">...</div>

      <div v-if="article.relatedArticles?.length" class="related-section">
        ...
      </div>

      <div class="actions">
        <button @click="$router.push('/wiki')" class="back-button">
          ← Volver a la lista
        </button>
      </div>
    </div>

    <div v-else class="not-found">...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ArticleEditor from "@/components/Editor/ArticleEditor.vue"; // ajusta la ruta

const route = useRoute();
const API_URL = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "") || "";

const article = ref(null);
const loading = ref(true);
const error = ref(null);
const editMode = ref(false);

// extra reactive para forzar remount del editor cuando activamos edición
const showEditor = ref(true);

// ============================
// Utilidades
// ============================
function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function blocksToHtmlFallback(blocks) {
  if (!Array.isArray(blocks))
    return DOMPurify.sanitize(marked.parse(String(blocks || "")));
  const pieces = [];
  for (const b of blocks) {
    if (!b || !b.type) continue;
    const d = b.data || {};
    switch (b.type) {
      case "paragraph":
        pieces.push(`<p>${marked.parseInline(String(d.text || ""))}</p>`);
        break;
      case "heading":
        pieces.push(
          `<h${d.level || 2}>${marked.parseInline(String(d.text || ""))}</h${
            d.level || 2
          }>`
        );
        break;
      case "list":
        {
          const tag = d.style === "ordered" ? "ol" : "ul";
          const items = (Array.isArray(d.items) ? d.items : [])
            .map((it) => `<li>${marked.parseInline(String(it || ""))}</li>`)
            .join("");
          pieces.push(`<${tag}>${items}</${tag}>`);
        }
        break;
      case "image":
        pieces.push(
          `<figure><img src="${String(d.url || "")}" alt="${escapeHtml(
            String(d.alt || "")
          )}" /><figcaption>${marked.parseInline(
            String(d.caption || "")
          )}</figcaption></figure>`
        );
        break;
      default:
        pieces.push(
          `<p>${marked.parseInline(String(JSON.stringify(d) || ""))}</p>`
        );
    }
  }
  return DOMPurify.sanitize(pieces.join("\n"));
}

const articleHtml = computed(() => {
  if (!article.value) return "";
  if (Array.isArray(article.value.content))
    return blocksToHtmlFallback(article.value.content);
  if (
    article.value.content &&
    typeof article.value.content === "object" &&
    Array.isArray(article.value.content.blocks)
  ) {
    return blocksToHtmlFallback(article.value.content.blocks);
  }
  return DOMPurify.sanitize(marked.parse(String(article.value.content || "")));
});

// metadata helper
const hasMetadata = computed(
  () =>
    !!(
      article.value &&
      article.value.metadata &&
      Object.keys(article.value.metadata).length > 0
    )
);

// Fetch article (simplificado, reutiliza tu lógica exacta)
async function fetchArticle() {
  loading.value = true;
  error.value = null;
  try {
    const slug = route.params.slug;
    if (!slug) {
      error.value = "Slug no proporcionado";
      loading.value = false;
      return;
    }
    const res = await axios
      .get(`${API_URL}/wiki/articles/${encodeURIComponent(slug)}`)
      .catch((e) => {
        // fallback a otras rutas
        return axios
          .get(`${API_URL}/wiki/${encodeURIComponent(slug)}`)
          .catch(() => null);
      });
    const payload = res?.data?.data ?? res?.data;
    if (!payload) {
      error.value = "No se encontró el artículo.";
      article.value = null;
    } else {
      // si content es string y JSON, parsearlo (compat)
      if (typeof payload.content === "string") {
        const s = payload.content.trim();
        if (s.startsWith("[") || s.startsWith("{")) {
          try {
            payload.content = JSON.parse(s);
          } catch (e) {
            /* keep string */
          }
        }
      }
      article.value = payload;
    }
  } catch (err) {
    console.error(err);
    error.value = "Error al cargar el artículo.";
    article.value = null;
  } finally {
    loading.value = false;
  }
}

// ============================
// Normalización antes de abrir editor
// ============================
function normalizeContentForEditor(content) {
  // Devuelve un array de bloques compatible con ArticleEditor.form.content
  // - si ya es array -> devolverlo
  // - si es objeto con .blocks -> devolver .blocks
  // - si es string -> intentar JSON.parse -> array o crear paragraph block con texto
  if (!content && content !== "") return [];

  // Si ya es array de bloques
  if (Array.isArray(content)) return content;

  // Si es objeto y contiene blocks
  if (content && typeof content === "object" && Array.isArray(content.blocks))
    return content.blocks;

  // Si es objeto pero ya es un block único? intentar detectar tipo
  if (content && typeof content === "object") {
    // posible que content tenga keys 'type' y 'data'
    if (content.type && content.data) return [content];
    // si tiene 'text' o 'html'
    if (content.text)
      return [{ type: "paragraph", data: { text: String(content.text) } }];
    if (content.html)
      return [{ type: "paragraph", data: { text: String(content.html) } }];
    // fallback: stringify
    return [
      { type: "paragraph", data: { text: String(JSON.stringify(content)) } },
    ];
  }

  // Si es string
  if (typeof content === "string") {
    const s = content.trim();
    if (!s) return [];
    // intentar parsear JSON contenido (puede ser array serializado)
    if (s.startsWith("[") || s.startsWith("{")) {
      try {
        const parsed = JSON.parse(s);
        return normalizeContentForEditor(parsed);
      } catch (e) {
        // no es JSON -> seguir
      }
    }
    // si parece HTML (contiene etiquetas) lo mantendremos como paragraph con HTML
    // ArticleEditor usa marked.parse for paragraphs; guardamos raw HTML/markdown in text
    return [{ type: "paragraph", data: { text: s } }];
  }

  // fallback
  return [];
}

function enableEditMode() {
  if (!article.value) return;

  // Normalizar content antes de montar el editor
  try {
    const normalized = normalizeContentForEditor(article.value.content);
    // reemplazamos en article por el array de bloques para que ArticleEditor lo reciba en initial
    // (no perdemos data original; si necesitas mantener original, clona primero)
    article.value = {
      ...article.value,
      content: normalized,
    };
  } catch (err) {
    console.warn("No se pudo normalizar content:", err);
  }

  // Forzamos remount del editor para asegurar que recibe la prop initial actualizada
  showEditor.value = false;
  // pequeña pausa para remount
  nextTick(() => {
    showEditor.value = true;
    editMode.value = true;
    // opcional: scroll al editor
    setTimeout(() => {
      const el =
        document.querySelector(".article-editor") ||
        document.querySelector("#article-editor-root");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 60);
  });
}

function onEditorSaved(updatedArticle) {
  // recibimos artículo actualizado (backend devuelve objeto)
  // Normalizar content devuelto si viene como string
  if (updatedArticle && typeof updatedArticle.content === "string") {
    try {
      const s = updatedArticle.content.trim();
      if (s.startsWith("[") || s.startsWith("{")) {
        updatedArticle.content = JSON.parse(s);
      }
    } catch (e) {}
  }
  article.value = updatedArticle;
  editMode.value = false;
  // ocultar editor
  showEditor.value = false;
}

function onEditorCancel() {
  // salir de edición sin guardar
  editMode.value = false;
  showEditor.value = false;
}

// --- EDIT MODE: teclado Ctrl/Cmd + E ---
function onGlobalKeydown(e) {
  const isModifier = e.ctrlKey || e.metaKey;
  if (!isModifier) return;
  if (e.key && e.key.toLowerCase() === "e") {
    // evitar si foco en input/textarea/select o elemento contenteditable
    const tag =
      (document.activeElement && document.activeElement.tagName) || "";
    const isEditable = document.activeElement?.isContentEditable;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || isEditable) return;
    e.preventDefault();
    enableEditMode();
  }
}

// lifecycle
onMounted(() => {
  fetchArticle();
  window.addEventListener("keydown", onGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
});
</script>

<style scoped>
/* Mantengo tu CSS original, más ajustes para el HTML generado */

.edit-btn {
  margin-left: 12px;
}
.article-detail-container {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.article-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #eee;
  font-weight: 600;
}
.article-title {
  margin: 0;
}
.article-body {
  margin-top: 1rem;
  line-height: 1.6;
}
.content-image img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.5rem 0;
}
.addendum {
  border-left: 4px solid #888;
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: #fafafa;
}
.content-quote {
  font-style: italic;
  border-left: 3px solid #ccc;
  padding-left: 0.75rem;
  margin: 0.5rem 0;
}
.content-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0.5rem 0;
}
.content-table th,
.content-table td {
  border: 1px solid #ddd;
  padding: 0.4rem;
  text-align: left;
}
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
