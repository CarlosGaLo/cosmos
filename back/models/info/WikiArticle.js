const mongoose = require("mongoose");

// ================================
// SCHEMA PARA BLOQUES DE CONTENIDO
// ================================
const ContentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "paragraph",
        "image",
        "addendum",
        "heading",
        "list",
        "embed",
        "table",
        "quote",
        "code",
      ],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

// ================================
// SCHEMA PARA ARTÍCULOS DE WIKI
// ================================
const wikiArticleSchema = new mongoose.Schema(
  {
    // === IDENTIFICACIÓN ===
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // === CONTENIDO: ahora es un array de bloques ===
    content: {
      type: [ContentBlockSchema],
      required: true,
      default: [],
    },
    excerpt: {
      type: String,
      maxlength: 300,
      trim: true,
    },

    // Campo auxiliar para búsquedas (texto concatenado de title + content)
    searchText: {
      type: String,
      default: "",
    },

    // === CATEGORIZACIÓN ===
    category: {
      type: String,
      enum: [
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
      ],
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    ttrpg: {
      type: String,
      default: "COSMOSROL",
    },

    // === MULTIMEDIA ===
    featuredImage: {
      url: { type: String, trim: true },
      alt: { type: String, trim: true },
      caption: { type: String, trim: true },
    },
    gallery: [
      {
        url: { type: String, trim: true },
        alt: { type: String, trim: true },
        caption: { type: String, trim: true },
      },
    ],

    // === RELACIONES ===
    relatedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WikiArticle",
      },
    ],

    // === ESTADO Y VISIBILIDAD ===
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },

    // === VERSIONADO ===
    version: { type: Number, default: 1 },

    // === METADATOS ===
    author: { type: String, required: true, default: "Admin" },
    lastEditor: { type: String },

    // === SEO ===
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true, maxlength: 255 },
      metaKeywords: [{ type: String, lowercase: true }],
      ogImage: { type: String, trim: true },
    },

    // === ESTADÍSTICAS ===
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },

    // === CONFIGURACIÓN ===
    allowComments: { type: Boolean, default: true },
    featured: { type: Boolean, default: false, index: true },

    // === ORDEN Y JERARQUÍA ===
    order: { type: Number, default: 0 },
    parentArticle: { type: mongoose.Schema.Types.ObjectId, ref: "WikiArticle" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ================================
// ÍNDICES PARA OPTIMIZACIÓN
// ================================
// index para búsquedas: ahora sobre searchText y title
wikiArticleSchema.index({ slug: 1 });
wikiArticleSchema.index({ category: 1, status: 1 });
wikiArticleSchema.index({ tags: 1 });
wikiArticleSchema.index({ featured: 1, status: 1 });
wikiArticleSchema.index({ createdAt: -1 });
// Text index sobre title + searchText (searchText contendrá el texto extraído de los bloques)
wikiArticleSchema.index({ title: "text", searchText: "text" });

// ================================
// VIRTUALS
// ================================
wikiArticleSchema.virtual("url").get(function () {
  return `/wiki/${this.category}/${this.slug}`;
});

wikiArticleSchema.virtual("isPublished").get(function () {
  return (
    this.status === "published" &&
    this.publishedAt &&
    this.publishedAt <= new Date()
  );
});

// Estimación de tiempo de lectura (200 wpm) basada en texto extraído de bloques
wikiArticleSchema.virtual("readingTime").get(function () {
  try {
    const plain = extractPlainTextFromContent(this.content || []);
    if (!plain) return 0;
    const words = plain.split(/\s+/).filter(Boolean).length;
    return Math.ceil(words / 200);
  } catch (e) {
    return 0;
  }
});

// ================================
// UTIL: extraer texto plano desde bloques
// ================================
function extractPlainTextFromContent(blocks) {
  if (!Array.isArray(blocks)) return "";
  const pieces = [];

  for (const b of blocks) {
    if (!b || !b.type || !b.data) continue;
    switch (b.type) {
      case "paragraph":
        if (typeof b.data.text === "string")
          pieces.push(stripHtml(b.data.text));
        break;
      case "heading":
        if (typeof b.data.text === "string")
          pieces.push(stripHtml(b.data.text));
        break;
      case "list":
        if (Array.isArray(b.data.items)) pieces.push(b.data.items.join(" "));
        break;
      case "quote":
        if (typeof b.data.text === "string")
          pieces.push(stripHtml(b.data.text));
        break;
      case "addendum":
        if (typeof b.data.title === "string") pieces.push(b.data.title);
        if (typeof b.data.content === "string")
          pieces.push(stripHtml(b.data.content));
        break;
      case "code":
        if (typeof b.data.code === "string") pieces.push(b.data.code);
        break;
      // image, embed, table: se puede usar caption/alt
      case "image":
        if (typeof b.data.caption === "string") pieces.push(b.data.caption);
        if (typeof b.data.alt === "string") pieces.push(b.data.alt);
        break;
      case "embed":
        if (typeof b.data.title === "string") pieces.push(b.data.title);
        break;
      case "table":
        // si table tiene rows, columnas
        if (Array.isArray(b.data.rows)) {
          for (const row of b.data.rows) {
            if (Array.isArray(row)) pieces.push(row.join(" "));
            else if (typeof row === "string") pieces.push(row);
          }
        }
        break;
      default:
        // intentar extraer campos de texto comunes
        for (const k of ["text", "content", "caption", "alt", "title"]) {
          if (typeof b.data[k] === "string") pieces.push(stripHtml(b.data[k]));
        }
    }
  }

  return pieces.join(" ").trim();
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ================================
// MIDDLEWARES
// ================================

// Pre-save: Generar slug automáticamente si no existe
wikiArticleSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Pre-save: Establecer publishedAt si se publica por primera vez
wikiArticleSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

// Pre-save: Auto-generar excerpt si no existe (usa el primer párrafo significativo)
wikiArticleSchema.pre("save", function (next) {
  if (
    (!this.excerpt || this.excerpt.trim() === "") &&
    Array.isArray(this.content)
  ) {
    // buscar primer bloque paragraph o heading con texto
    let found = null;
    for (const b of this.content) {
      if (!b || !b.type || !b.data) continue;
      if (
        b.type === "paragraph" &&
        typeof b.data.text === "string" &&
        b.data.text.trim()
      ) {
        found = stripHtml(b.data.text).slice(0, 300);
        break;
      }
      if (
        b.type === "heading" &&
        typeof b.data.text === "string" &&
        b.data.text.trim()
      ) {
        found = stripHtml(b.data.text).slice(0, 300);
        break;
      }
      // fallback: caption, addendum.content
      if (
        b.type === "image" &&
        typeof b.data.caption === "string" &&
        b.data.caption.trim()
      ) {
        found = stripHtml(b.data.caption).slice(0, 300);
        break;
      }
      if (
        b.type === "addendum" &&
        typeof b.data.content === "string" &&
        b.data.content.trim()
      ) {
        found = stripHtml(b.data.content).slice(0, 300);
        break;
      }
    }
    if (found) {
      this.excerpt = found + (found.length >= 300 ? "..." : "");
    }
  }
  next();
});

// Pre-save: Generar searchText concatenando title + excerpt + todo el texto extraído
wikiArticleSchema.pre("save", function (next) {
  try {
    const extracted = extractPlainTextFromContent(this.content || []);
    const parts = [this.title || "", this.excerpt || "", extracted];
    this.searchText = parts.filter(Boolean).join(" ");
  } catch (e) {
    this.searchText = this.title || "";
  }
  next();
});

// ================================
// MÉTODOS ESTÁTICOS
// ================================
wikiArticleSchema.statics.findPublished = function (filter = {}) {
  return this.find({
    ...filter,
    status: "published",
    publishedAt: { $lte: new Date() },
  });
};

wikiArticleSchema.statics.findByCategory = function (
  category,
  includeUnpublished = false
) {
  const filter = { category };
  if (!includeUnpublished) {
    filter.status = "published";
    filter.publishedAt = { $lte: new Date() };
  }
  return this.find(filter).sort({ order: 1, createdAt: -1 });
};

wikiArticleSchema.statics.findFeatured = function (limit = 5) {
  return this.find({
    featured: true,
    status: "published",
    publishedAt: { $lte: new Date() },
  })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

wikiArticleSchema.statics.search = function (query, options = {}) {
  const filter = { $text: { $search: query }, status: "published" };
  if (options.category) filter.category = options.category;
  return this.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(options.limit || 20);
};

// ================================
// MÉTODOS DE INSTANCIA
// ================================
wikiArticleSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

wikiArticleSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

wikiArticleSchema.methods.publish = function () {
  this.status = "published";
  if (!this.publishedAt) this.publishedAt = new Date();
  return this.save();
};

wikiArticleSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// ================================
// EXPORTAR MODELO
// ================================
module.exports = mongoose.model("WikiArticle", wikiArticleSchema);
