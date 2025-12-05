<template>
  <div class="article-editor">
    <div class="editor-header">
      <input v-model="form.title" placeholder="Título" class="title-input" />
      <input
        v-model="form.slug"
        placeholder="slug (opcional)"
        class="slug-input"
      />
      <select v-model="form.category">
        <option value="">Selecciona categoría</option>
        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
      </select>
      <div class="editor-actions">
        <button @click="saveDraft">Guardar draft</button>
        <button @click="publish" :disabled="publishing">Publicar</button>
        <button @click="togglePreview">
          {{ preview ? "Editar" : "Preview" }}
        </button>
      </div>
    </div>

    <div class="editor-body">
      <aside class="left-panel">
        <h4>Metadatos</h4>
        <label>Tags (coma-separados)</label>
        <input
          v-model="tagsInput"
          @blur="commitTags"
          placeholder="tag1, tag2"
        />
        <h4>Featured image</h4>
        <div v-if="form.featuredImage?.url">
          <img :src="form.featuredImage.url" alt="" style="max-width: 150px" />
        </div>
        <input type="file" @change="onFileFeatured" />
      </aside>

      <main class="center-panel">
        <div class="blocks-toolbar">
          <button @click="addBlock('paragraph')">Párrafo</button>
          <button @click="addBlock('heading')">Heading</button>
          <button @click="addBlock('list')">Lista</button>
          <button @click="addBlock('image')">Imagen</button>
          <button @click="addBlock('addendum')">Addendum</button>
        </div>

        <div v-if="!preview" class="blocks-list">
          <div
            v-for="(block, idx) in form.content"
            :key="idx"
            class="block-item"
          >
            <div class="block-controls">
              <strong>{{ block.type }}</strong>
              <button @click="moveBlockUp(idx)" :disabled="idx === 0">↑</button>
              <button
                @click="moveBlockDown(idx)"
                :disabled="idx === form.content.length - 1"
              >
                ↓
              </button>
              <button @click="removeBlock(idx)">✕</button>
            </div>

            <!-- Render editor según type -->
            <div class="block-editor">
              <template v-if="block.type === 'paragraph'">
                <textarea
                  v-model="block.data.text"
                  placeholder="Texto del párrafo"
                  rows="4"
                />
              </template>

              <template v-else-if="block.type === 'heading'">
                <input
                  type="number"
                  v-model.number="block.data.level"
                  min="1"
                  max="6"
                />
                <input
                  v-model="block.data.text"
                  placeholder="Texto del heading"
                />
              </template>

              <template v-else-if="block.type === 'list'">
                <select v-model="block.data.style">
                  <option value="unordered">unordered</option>
                  <option value="ordered">ordered</option>
                </select>
                <div v-for="(it, i2) in block.data.items" :key="i2">
                  <input v-model="block.data.items[i2]" />
                  <button @click="block.data.items.splice(i2, 1)">-</button>
                </div>
                <button @click="block.data.items.push('')">+ Item</button>
              </template>

              <template v-else-if="block.type === 'image'">
                <div v-if="block.data.url">
                  <img :src="block.data.url" style="max-width: 220px" />
                </div>
                <input type="file" @change="(ev) => onBlockImage(ev, idx)" />
                <input v-model="block.data.caption" placeholder="caption" />
                <input v-model="block.data.alt" placeholder="alt" />
              </template>

              <template v-else-if="block.type === 'addendum'">
                <input
                  v-model="block.data.title"
                  placeholder="Título addendum"
                />
                <textarea
                  v-model="block.data.content"
                  rows="3"
                  placeholder="Contenido addendum"
                />
                <select v-model="block.data.variant">
                  <option value="info">info</option>
                  <option value="warning">warning</option>
                  <option value="tip">tip</option>
                </select>
              </template>
            </div>
          </div>
        </div>

        <div v-else class="preview">
          <h3>Preview</h3>
          <div v-html="renderedPreview"></div>
        </div>
      </main>

      <aside class="right-panel">
        <h4>SEO</h4>
        <input v-model="form.seo.metaTitle" placeholder="Meta title" />
        <textarea
          v-model="form.seo.metaDescription"
          placeholder="Meta description"
          rows="3"
        ></textarea>
        <h4>Status</h4>
        <select v-model="form.status">
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";

const API_URL = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "") || "";

const props = defineProps({
  initial: { type: Object, required: true }, // artículo a editar
});

const categories = [
  "reglas",
  "lore",
  "guias",
  "mecanicas",
  "razas",
  "hechizos",
  "clases",
  "items",
  "criaturas",
  "world",
];

// Form state
const form = reactive({
  slug: "",
  title: "",
  content: [],
  excerpt: "",
  category: "",
  subcategory: "",
  tags: [],
  ttrpg: "COSMOSROL",
  featuredImage: { url: "", alt: "", caption: "" },
  gallery: [],
  relatedArticles: [],
  status: "draft",
  publishedAt: null,
  version: 1,
  author: "Admin",
  seo: { metaTitle: "", metaDescription: "", metaKeywords: [], ogImage: "" },
});

watch(
  () => props.initial,
  (article) => {
    if (!article) return;
    form.slug = article.slug || "";
    form.title = article.title || "";
    form.category = article.category || "";
    form.content = Array.isArray(article.content)
      ? JSON.parse(JSON.stringify(article.content)) // deep copy
      : [{ type: "paragraph", data: { text: String(article.content || "") } }];
    form.excerpt = article.excerpt || "";
    form.tags = Array.isArray(article.tags) ? [...article.tags] : [];
    form.featuredImage = article.featuredImage || {
      url: "",
      alt: "",
      caption: "",
    };
    form.seo = article.seo || {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImage: "",
    };
    form.status = article.status || "draft";
  },
  { immediate: true }
);

// helpers for tags input
const tagsInput = ref("");

// preview toggle
const preview = ref(false);
const publishing = ref(false);

function commitTags() {
  form.tags = tagsInput.value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Add block factory
function addBlock(type) {
  let block = { type, data: {} };
  switch (type) {
    case "paragraph":
      block.data = { text: "" };
      break;
    case "heading":
      block.data = { level: 2, text: "" };
      break;
    case "list":
      block.data = { style: "unordered", items: [""] };
      break;
    case "image":
      block.data = { url: "", alt: "", caption: "" };
      break;
    case "addendum":
      block.data = { title: "", content: "", variant: "info" };
      break;
    case "quote":
      block.data = { text: "", author: "" };
      break;
    case "code":
      block.data = { code: "", language: "" };
      break;
    default:
      block.data = {};
  }
  form.content.push(block);
}

// Block operations
function removeBlock(i) {
  form.content.splice(i, 1);
}
function moveBlockUp(i) {
  if (i > 0) {
    const t = form.content[i];
    form.content.splice(i, 1);
    form.content.splice(i - 1, 0, t);
  }
}
function moveBlockDown(i) {
  if (i < form.content.length - 1) {
    const t = form.content[i];
    form.content.splice(i, 1);
    form.content.splice(i + 1, 0, t);
  }
}

// Featured image upload
async function onFileFeatured(ev) {
  const f = ev.target.files?.[0];
  if (!f) return;
  const data = new FormData();
  data.append("file", f);
  const res = await axios.post(`${API_URL}/uploads`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  form.featuredImage.url = res.data.url;
}

// Upload image for block
async function onBlockImage(ev, blockIndex) {
  const f = ev.target.files?.[0];
  if (!f) return;
  const data = new FormData();
  data.append("file", f);
  const res = await axios.post(`${API_URL}/uploads`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  form.content[blockIndex].data.url = res.data.url;
}

// Render blocks to HTML (re-use viewer logic)
function blockToHtml(b) {
  if (!b || !b.type) return "";
  const d = b.data || {};
  switch (b.type) {
    case "paragraph":
      return `<p>${marked.parseInline(String(d.text || ""))}</p>`;
    case "heading":
      return `<h${d.level || 2}>${marked.parseInline(String(d.text || ""))}</h${
        d.level || 2
      }>`;
    case "list":
      const tag = d.style === "ordered" ? "ol" : "ul";
      const items = (Array.isArray(d.items) ? d.items : [])
        .map((it) => `<li>${marked.parseInline(String(it || ""))}</li>`)
        .join("");
      return `<${tag}>${items}</${tag}>`;
    case "image":
      const caption = d.caption
        ? `<figcaption>${marked.parseInline(String(d.caption))}</figcaption>`
        : "";
      return `<figure><img src="${String(d.url || "")}" alt="${String(
        d.alt || ""
      )}" />${caption}</figure>`;
    case "addendum":
      return `<aside class="addendum addendum-${String(
        d.variant || "info"
      )}"><strong>${String(d.title || "")}</strong>${marked.parse(
        String(d.content || "")
      )}</aside>`;
    default:
      return `<p>${marked.parseInline(JSON.stringify(d))}</p>`;
  }
}

const renderedPreview = computed(() => {
  const html = form.content.map((b) => blockToHtml(b)).join("\n");
  return DOMPurify.sanitize(html);
});

// Save draft (crear o actualizar según slug)
async function saveDraft() {
  try {
    commitTags();
    const payload = { ...form, tags: form.tags };
    // Si existe slug, actualizar; si no, crear
    if (form.slug) {
      // PUT a /api/wiki/:slug
      await axios.put(
        `${API_URL}/wiki/${encodeURIComponent(form.slug)}`,
        payload
      );
      alert("Draft guardado (actualizado).");
    } else {
      // POST a /api/wiki
      const res = await axios.post(`${API_URL}/wiki`, payload);
      form.slug = res.data.slug; // actualizar slug tras creación
      alert("Draft guardado (creado).");
    }
  } catch (e) {
    console.error(e);
    alert("Error guardando el draft");
  }
}

// Publicar artículo
async function publish() {
  try {
    publishing.value = true;
    commitTags();
    const payload = { ...form, tags: form.tags, status: "published" };

    if (form.slug) {
      // PUT a /api/wiki/:slug
      await axios.put(
        `${API_URL}/wiki/${encodeURIComponent(form.slug)}`,
        payload
      );
      console.log(payload);
      alert("Artículo publicado (actualizado).");
    } else {
      // POST a /api/wiki
      const res = await axios.post(`${API_URL}/wiki`, payload);
      form.slug = res.data.slug; // actualizar slug tras creación
      alert("Artículo publicado (creado).");
    }
  } catch (e) {
    console.error(e);
    alert("Error publicando el artículo");
  } finally {
    publishing.value = false;
  }
}

function togglePreview() {
  preview.value = !preview.value;
}
</script>

<style scoped>
.article-editor {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.editor-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.title-input {
  font-size: 1.2rem;
  padding: 0.4rem;
  min-width: 300px;
}
.slug-input {
  padding: 0.3rem;
}
.editor-body {
  display: grid;
  grid-template-columns: 220px 1fr 240px;
  gap: 1rem;
  align-items: start;
}
.left-panel,
.right-panel {
  background: #fafafa;
  padding: 0.8rem;
  border-radius: 6px;
}
.center-panel {
  background: #fff;
  padding: 0.8rem;
  border-radius: 6px;
}
.blocks-toolbar {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
}
.block-item {
  border: 1px dashed #ddd;
  padding: 0.6rem;
  margin-bottom: 0.6rem;
  border-radius: 6px;
}
.block-controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 0.4rem;
}
.preview {
  background: #fff;
  padding: 0.6rem;
  border-radius: 6px;
  min-height: 200px;
}
.addendum {
  border-left: 4px solid #888;
  padding: 0.6rem;
  background: #f8fbff;
}
</style>
