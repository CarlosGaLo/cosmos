const mongoose = require('mongoose');

// ========================================
// SCHEMA PARA ARTÍCULOS DE WIKI
// ========================================

const wikiArticleSchema = new mongoose.Schema({
  // === IDENTIFICACIÓN ===
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // === CONTENIDO ===
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300,
    trim: true
  },
  
  // === CATEGORIZACIÓN ===
  category: {
    type: String,
    enum: ['reglas', 'lore', 'guias', 'mecanicas', 'razas', 'hechizos', 'clases', 'items', 'criaturas', 'world'],
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  ttrpg: {
    type: String,
    default: 'COSMOSROL'
  },
  
  // === MULTIMEDIA ===
  featuredImage: {
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    },
    caption: {
      type: String,
      trim: true
    }
  },
  gallery: [{
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    },
    caption: {
      type: String,
      trim: true
    }
  }],
  
  // === RELACIONES ===
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WikiArticle'
  }],
  
  // === ESTADO Y VISIBILIDAD ===
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: {
    type: Date
  },
  
  // === VERSIONADO ===
  version: {
    type: Number,
    default: 1
  },
  
  // === METADATOS ===
  author: {
    type: String,
    required: true,
    default: 'Admin'
  },
  lastEditor: {
    type: String
  },
  
  // === SEO ===
  seo: {
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    metaKeywords: [{
      type: String,
      lowercase: true
    }],
    ogImage: {
      type: String,
      trim: true
    }
  },
  
  // === ESTADÍSTICAS ===
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // === CONFIGURACIÓN ===
  allowComments: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // === ORDEN Y JERARQUÍA ===
  order: {
    type: Number,
    default: 0
  },
  parentArticle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WikiArticle'
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========================================
// ÍNDICES PARA OPTIMIZACIÓN
// ========================================

wikiArticleSchema.index({ slug: 1 });
wikiArticleSchema.index({ category: 1, status: 1 });
wikiArticleSchema.index({ tags: 1 });
wikiArticleSchema.index({ featured: 1, status: 1 });
wikiArticleSchema.index({ createdAt: -1 });
wikiArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// ========================================
// VIRTUALS
// ========================================

// URL completa del artículo
wikiArticleSchema.virtual('url').get(function() {
  return `/wiki/${this.category}/${this.slug}`;
});

// Indica si está publicado
wikiArticleSchema.virtual('isPublished').get(function() {
  return this.status === 'published' && this.publishedAt && this.publishedAt <= new Date();
});

// Tiempo de lectura estimado (palabras por minuto: 200)
wikiArticleSchema.virtual('readingTime').get(function() {
  if (!this.content) return 0;
  const words = this.content.split(/\s+/).length;
  return Math.ceil(words / 200);
});

// ========================================
// MIDDLEWARES
// ========================================

// Pre-save: Generar slug automáticamente si no existe
wikiArticleSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/-+/g, '-'); // Múltiples guiones a uno solo
  }
  next();
});

// Pre-save: Establecer publishedAt si se publica por primera vez
wikiArticleSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Pre-save: Auto-generar excerpt si no existe
wikiArticleSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    // Extraer texto plano sin HTML
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 297) + (plainText.length > 297 ? '...' : '');
  }
  next();
});

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Buscar artículos publicados
wikiArticleSchema.statics.findPublished = function(filter = {}) {
  return this.find({
    ...filter,
    status: 'published',
    publishedAt: { $lte: new Date() }
  });
};

// Buscar por categoría
wikiArticleSchema.statics.findByCategory = function(category, includeUnpublished = false) {
  const filter = { category };
  if (!includeUnpublished) {
    filter.status = 'published';
    filter.publishedAt = { $lte: new Date() };
  }
  return this.find(filter).sort({ order: 1, createdAt: -1 });
};

// Buscar destacados
wikiArticleSchema.statics.findFeatured = function(limit = 5) {
  return this.find({
    featured: true,
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Búsqueda de texto completo
wikiArticleSchema.statics.search = function(query, options = {}) {
  const filter = {
    $text: { $search: query },
    status: 'published'
  };
  
  if (options.category) {
    filter.category = options.category;
  }
  
  return this.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20);
};

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

// Incrementar vistas
wikiArticleSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Incrementar likes
wikiArticleSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Publicar artículo
wikiArticleSchema.methods.publish = function() {
  this.status = 'published';
  if (!this.publishedAt) {
    this.publishedAt = new Date();
  }
  return this.save();
};

// Archivar artículo
wikiArticleSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// ========================================
// EXPORTAR MODELO
// ========================================

module.exports = mongoose.model('WikiArticle', wikiArticleSchema);