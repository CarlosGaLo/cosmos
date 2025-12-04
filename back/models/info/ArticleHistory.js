const mongoose = require('mongoose');

// ========================================
// SCHEMA PARA HISTORIAL DE ARTÍCULOS
// ========================================

const articleHistorySchema = new mongoose.Schema({
  // Referencia al artículo original
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WikiArticle',
    required: true,
    index: true
  },
  
  // Versión del snapshot
  version: {
    type: Number,
    required: true
  },
  
  // Snapshot del contenido en este momento
  snapshot: {
    title: String,
    content: String,
    excerpt: String,
    category: String,
    subcategory: String,
    tags: [String],
    featuredImage: {
      url: String,
      alt: String,
      caption: String
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String]
    }
  },
  
  // Información del cambio
  changeInfo: {
    author: {
      type: String,
      required: true
    },
    changeDescription: {
      type: String,
      trim: true
    },
    changeType: {
      type: String,
      enum: ['created', 'content_update', 'metadata_update', 'major_revision', 'minor_revision'],
      default: 'minor_revision'
    }
  },
  
  // Diff (opcional, para mostrar cambios)
  diff: {
    type: String
  },
  
  // ¿Se puede restaurar esta versión?
  restorable: {
    type: Boolean,
    default: true
  },
  
  // Timestamp del cambio
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
  
}, {
  timestamps: false // Usamos changedAt en su lugar
});

// ========================================
// ÍNDICES
// ========================================

articleHistorySchema.index({ articleId: 1, version: -1 });
articleHistorySchema.index({ changedAt: -1 });

// ========================================
// MÉTODOS ESTÁTICOS
// ========================================

// Obtener historial de un artículo
articleHistorySchema.statics.getHistory = function(articleId, limit = 10) {
  return this.find({ articleId })
    .sort({ version: -1 })
    .limit(limit);
};

// Obtener una versión específica
articleHistorySchema.statics.getVersion = function(articleId, version) {
  return this.findOne({ articleId, version });
};

// Obtener última versión
articleHistorySchema.statics.getLatestVersion = function(articleId) {
  return this.findOne({ articleId })
    .sort({ version: -1 });
};

// Comparar dos versiones
articleHistorySchema.statics.compareVersions = async function(articleId, version1, version2) {
  const [v1, v2] = await Promise.all([
    this.getVersion(articleId, version1),
    this.getVersion(articleId, version2)
  ]);
  
  if (!v1 || !v2) {
    throw new Error('Una o ambas versiones no existen');
  }
  
  return {
    version1: v1,
    version2: v2,
    differences: {
      title: v1.snapshot.title !== v2.snapshot.title,
      content: v1.snapshot.content !== v2.snapshot.content,
      category: v1.snapshot.category !== v2.snapshot.category,
      tags: JSON.stringify(v1.snapshot.tags) !== JSON.stringify(v2.snapshot.tags)
    }
  };
};

// ========================================
// MÉTODOS DE INSTANCIA
// ========================================

// Marcar como no restaurable
articleHistorySchema.methods.markAsNonRestorable = function() {
  this.restorable = false;
  return this.save();
};

// ========================================
// FUNCIÓN HELPER PARA CREAR SNAPSHOT
// ========================================

articleHistorySchema.statics.createSnapshot = async function(article, author, changeDescription, changeType = 'minor_revision') {
  const snapshot = {
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    category: article.category,
    subcategory: article.subcategory,
    tags: article.tags,
    featuredImage: article.featuredImage,
    seo: article.seo
  };
  
  const history = new this({
    articleId: article._id,
    version: article.version,
    snapshot,
    changeInfo: {
      author,
      changeDescription,
      changeType
    },
    changedAt: new Date()
  });
  
  return history.save();
};

// ========================================
// EXPORTAR MODELO
// ========================================

module.exports = mongoose.model('ArticleHistory', articleHistorySchema);