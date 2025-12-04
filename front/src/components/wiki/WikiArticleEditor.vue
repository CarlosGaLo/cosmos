<template>
  <div class="wiki-editor">
    <div class="editor-container">
      <h1 class="editor-title">
        {{ isEditing ? '✏️ Editar artículo' : '➕ Crear nuevo artículo' }}
      </h1>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="editor-form">
        <!-- Título -->
        <div class="form-group">
          <label for="title">Título *</label>
          <input 
            id="title"
            v-model="formData.title"
            type="text" 
            placeholder="Título del artículo"
            required
            class="form-input"
          >
        </div>

        <!-- Slug (opcional) -->
        <div class="form-group">
          <label for="slug">
            Slug (URL) 
            <span class="label-hint">Se genera automáticamente si se deja vacío</span>
          </label>
          <input 
            id="slug"
            v-model="formData.slug"
            type="text" 
            placeholder="mi-articulo-personalizado"
            class="form-input"
          >
        </div>

        <!-- Categoría y Subcategoría -->
        <div class="form-row">
          <div class="form-group">
            <label for="category">Categoría *</label>
            <select 
              id="category"
              v-model="formData.category"
              required
              class="form-select"
            >
              <option value="">Seleccionar categoría</option>
              <option 
                v-for="cat in wikiStore.categories" 
                :key="cat.value" 
                :value="cat.value"
              >
                {{ cat.icon }} {{ cat.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="subcategory">Subcategoría</label>
            <input 
              id="subcategory"
              v-model="formData.subcategory"
              type="text" 
              placeholder="Opcional"
              class="form-input"
            >
          </div>
        </div>

        <!-- Excerpt -->
        <div class="form-group">
          <label for="excerpt">
            Resumen
            <span class="label-hint">Máximo 300 caracteres</span>
          </label>
          <textarea 
            id="excerpt"
            v-model="formData.excerpt"
            placeholder="Breve resumen del artículo (se genera automáticamente si se deja vacío)"
            maxlength="300"
            rows="3"
            class="form-textarea"
          ></textarea>
          <span class="char-count">{{ formData.excerpt?.length || 0 }}/300</span>
        </div>

        <!-- Editor de contenido (CKEditor) -->
        <div class="form-group">
          <label>Contenido *</label>
          <div class="editor-wrapper">
            <CKEditor 
              v-model="formData.content"
              :editor="editor"
              :config="editorConfig"
              class="ckeditor"
            />
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label for="tags-input">Etiquetas</label>
          <div class="tags-input-wrapper">
            <input 
              id="tags-input"
              v-model="currentTag"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
              type="text" 
              placeholder="Escribe una etiqueta y presiona Enter"
              class="form-input"
            >
            <button type="button" @click="addTag" class="btn-add-tag">
              + Agregar
            </button>
          </div>
          <div v-if="formData.tags.length > 0" class="tags-list">
            <span 
              v-for="(tag, index) in formData.tags" 
              :key="index" 
              class="tag"
            >
              #{{ tag }}
              <button 
                type="button" 
                @click="removeTag(index)"
                class="tag-remove"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Imagen destacada -->
        <div class="form-group">
          <label for="image-url">URL de imagen destacada</label>
          <input 
            id="image-url"
            v-model="formData.featuredImage.url"
            type="url" 
            placeholder="https://ejemplo.com/imagen.jpg"
            class="form-input"
          >
          <div class="form-row">
            <input 
              v-model="formData.featuredImage.alt"
              type="text" 
              placeholder="Texto alternativo"
              class="form-input"
            >
            <input 
              v-model="formData.featuredImage.caption"
              type="text" 
              placeholder="Pie de foto (opcional)"
              class="form-input"
            >
          </div>
          <div v-if="formData.featuredImage.url" class="image-preview">
            <img :src="formData.featuredImage.url" alt="Vista previa">
          </div>
        </div>

        <!-- Estado y opciones -->
        <div class="form-row">
          <div class="form-group">
            <label for="status">Estado</label>
            <select 
              id="status"
              v-model="formData.status"
              class="form-select"
            >
              <option value="draft">📝 Borrador</option>
              <option value="published">✅ Publicado</option>
              <option value="archived">📦 Archivado</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                v-model="formData.featured"
                type="checkbox"
              >
              ⭐ Artículo destacado
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input 
                v-model="formData.allowComments"
                type="checkbox"
              >
              💬 Permitir comentarios
            </label>
          </div>
        </div>

        <!-- SEO (acordeón opcional) -->
        <div class="form-group">
          <button 
            type="button" 
            @click="showSeoFields = !showSeoFields"
            class="btn-toggle"
          >
            {{ showSeoFields ? '▼' : '▶' }} Opciones SEO (Opcional)
          </button>
          
          <div v-show="showSeoFields" class="seo-fields">
            <input 
              v-model="formData.seo.metaTitle"
              type="text" 
              placeholder="Meta título"
              class="form-input"
            >
            <textarea 
              v-model="formData.seo.metaDescription"
              placeholder="Meta descripción (máx. 160 caracteres)"
              maxlength="160"
              rows="2"
              class="form-textarea"
            ></textarea>
          </div>
        </div>

        <!-- Descripción del cambio (solo edición) -->
        <div v-if="isEditing" class="form-group">
          <label for="change-desc">Descripción del cambio</label>
          <input 
            id="change-desc"
            v-model="changeDescription"
            type="text" 
            placeholder="Describe brevemente qué has modificado"
            class="form-input"
          >
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <button 
            type="submit" 
            :disabled="wikiStore.loading.saving"
            class="btn-primary"
          >
            {{ wikiStore.loading.saving ? 'Guardando...' : (isEditing ? 'Actualizar artículo' : 'Crear artículo') }}
          </button>
          
          <button 
            type="button" 
            @click="handleCancel"
            class="btn-secondary"
          >
            Cancelar
          </button>
        </div>

        <!-- Error -->
        <div v-if="wikiStore.error" class="error-message">
          ❌ {{ wikiStore.error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useWikiStore } from '@/stores/useWikiStore';
import { CKEditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Store y router
const wikiStore = useWikiStore();
const router = useRouter();
const route = useRoute();

// Props
const props = defineProps({
  articleId: {
    type: String,
    default: null
  }
});

// State
const editor = ref(ClassicEditor);
const editorConfig = ref({
  placeholder: 'Escribe el contenido del artículo aquí...',
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'link', '|',
    'bulletedList', 'numberedList', '|',
    'blockQuote', 'insertTable', '|',
    'undo', 'redo'
  ]
});

const formData = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  category: '',
  subcategory: '',
  tags: [],
  featuredImage: {
    url: '',
    alt: '',
    caption: ''
  },
  status: 'draft',
  featured: false,
  allowComments: true,
  seo: {
    metaTitle: '',
    metaDescription: ''
  }
});

const currentTag = ref('');
const changeDescription = ref('');
const showSeoFields = ref(false);
const isEditing = ref(false);

// ========================================
// FUNCIONES
// ========================================

const loadArticle = async () => {
  const id = props.articleId || route.params.id;
  
  if (!id) return;
  
  isEditing.value = true;
  
  try {
    await wikiStore.fetchArticleById(id);
    const article = wikiStore.currentArticle;
    
    if (article) {
      formData.value = {
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt || '',
        category: article.category,
        subcategory: article.subcategory || '',
        tags: [...(article.tags || [])],
        featuredImage: {
          url: article.featuredImage?.url || '',
          alt: article.featuredImage?.alt || '',
          caption: article.featuredImage?.caption || ''
        },
        status: article.status,
        featured: article.featured,
        allowComments: article.allowComments,
        seo: {
          metaTitle: article.seo?.metaTitle || '',
          metaDescription: article.seo?.metaDescription || ''
        }
      };
    }
  } catch (error) {
    console.error('Error loading article:', error);
  }
};

const addTag = () => {
  const tag = currentTag.value.trim().toLowerCase().replace(/^#/, '');
  
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
  }
  
  currentTag.value = '';
};

const removeTag = (index) => {
  formData.value.tags.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    const articleData = {
      ...formData.value,
      author: 'Admin', // Aquí deberías usar el usuario actual
      lastEditor: 'Admin', // Aquí deberías usar el usuario actual
      changeDescription: changeDescription.value
    };
    
    if (isEditing.value) {
      const id = props.articleId || route.params.id;
      await wikiStore.updateArticle(id, articleData);
      alert('✅ Artículo actualizado correctamente');
    } else {
      await wikiStore.createArticle(articleData);
      alert('✅ Artículo creado correctamente');
    }
    
    router.push('/wiki');
  } catch (error) {
    console.error('Error saving article:', error);
    alert('❌ Error al guardar el artículo');
  }
};

const handleCancel = () => {
  if (confirm('¿Estás seguro? Los cambios no guardados se perderán.')) {
    router.push('/wiki');
  }
};

// ========================================
// LIFECYCLE
// ========================================

onMounted(() => {
  if (props.articleId || route.params.id) {
    loadArticle();
  }
});

watch(() => route.params.id, () => {
  if (route.params.id) {
    loadArticle();
  }
});
</script>

<style scoped>
.wiki-editor {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.editor-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.editor-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary, #2c3e50);
  margin-bottom: 2rem;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

label {
  font-weight: 600;
  color: var(--color-text, #2c3e50);
}

.label-hint {
  font-weight: 400;
  color: var(--color-text-light, #7f8c8d);
  font-size: 0.85rem;
}

/* Inputs */
.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary, #3498db);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 0.85rem;
  color: var(--color-text-light, #7f8c8d);
  text-align: right;
}

/* Editor wrapper */
.editor-wrapper {
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  overflow: hidden;
}

.ckeditor :deep(.ck-editor__editable) {
  min-height: 400px;
}

/* Tags */
.tags-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.btn-add-tag {
  padding: 0.75rem 1rem;
  background: var(--color-primary, #3498db);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.3s ease;
}

.btn-add-tag:hover {
  background: var(--color-primary-dark, #2980b9);
}

.tags-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: var(--color-primary, #3498db);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

/* Image preview */
.image-preview {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  max-width: 400px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

/* Checkbox group */
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* SEO fields */
.btn-toggle {
  padding: 0.75rem;
  background: var(--color-bg-light, #f8f9fa);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  text-align: left;
  transition: all 0.3s ease;
}

.btn-toggle:hover {
  background: var(--color-border, #ddd);
}

.seo-fields {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg-light, #f8f9fa);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Form actions */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--color-primary, #3498db);
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #2980b9);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: var(--color-disabled, #bdc3c7);
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-bg-light, #f8f9fa);
  color: var(--color-text, #2c3e50);
  border: 2px solid var(--color-border, #ddd);
}

.btn-secondary:hover {
  background: var(--color-border, #ddd);
}

/* Error message */
.error-message {
  padding: 1rem;
  background: #fee;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  color: #c0392b;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .editor-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>