const mongoose = require("mongoose");
const WikiArticle = require("../models/info/WikiArticle");

// -----------------------------
// Helpers
// -----------------------------
const parsePageLimit = (pageQuery, limitQuery) => {
  const page = Math.max(1, parseInt(pageQuery, 10) || 1);
  const limit = Math.max(1, parseInt(limitQuery, 10) || 20);
  return { page, limit };
};

const safeParseJSON = (value, fallback = null) => {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const truncate = (str, max) => {
  if (typeof str !== "string") return str;
  return str.length > max ? str.substring(0, max) : str;
};

// -----------------------------
// Controllers
// -----------------------------

// 📌 Obtener todos los artículos (paginado, filtrado por tipo/category)
exports.getAllArticles = async (req, res) => {
  try {
    const { page, limit } = parsePageLimit(req.query.page, req.query.limit);
    const filter = {};

    // Filtrado por tipo/category
    if (req.query.type) filter.category = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    // Por defecto sólo artículos publicados (salvo si se solicita includeUnpublished=true)
    if (req.query.includeUnpublished !== "true") {
      filter.status = "published";
      filter.publishedAt = { $lte: new Date() };
    }

    const total = await WikiArticle.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const articles = await WikiArticle.find(filter)
      .sort({ order: 1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data: articles,
      pagination: { page, pages, total, limit },
    });
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    res.status(500).json({ message: "Error al obtener artículos", error });
  }
};

// 📌 Obtener artículo por slug
// getArticleBySlug - búsqueda tolerante y logging para depuración
exports.getArticleBySlug = async (req, res) => {
  try {
    console.log(">>> getArticleBySlug llamado - controller cargado");
    console.log("slug recibido (raw):", req.params.slug);
    let rawSlug = req.params.slug;
    if (!rawSlug) return res.status(400).json({ message: "Slug requerido" });

    // Log para depuración inmediata
    console.log("GET /api/articles/:slug -> slug recibido:", rawSlug);

    // Decodificar por si el frontend envía caracteres URL encoded
    try {
      rawSlug = decodeURIComponent(rawSlug);
    } catch (e) {
      /* ignore */
    }

    const normalize = (s = "") =>
      s
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quitar acentos
        .replace(/[^a-z0-9\s-]/g, "") // limpiar caracteres extraños
        .trim();

    const slug = rawSlug.toString().toLowerCase().trim();

    // 1) intento: slug exacto
    let article = await WikiArticle.findOne({ slug }).lean();
    console.log("-> búsqueda exacta slug:", !!article);

    if (article) return res.json(article);

    // 2) intento: slug normalizado (quita acentos, normaliza espacios a guiones)
    const altSlug = normalize(slug).replace(/\s+/g, "-").replace(/-+/g, "-");
    if (altSlug !== slug) {
      article = await WikiArticle.findOne({ slug: altSlug }).lean();
      console.log(
        "-> búsqueda slug normalizado:",
        !!article,
        "altSlug:",
        altSlug
      );
      if (article) return res.json(article);
    }

    // 3) intento: buscar por title (revirtiendo guiones a espacios), regex case-insensitive
    const titleLike = slug.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    if (titleLike.length > 0) {
      const esc = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const reStart = new RegExp("^" + esc(titleLike), "i"); // empieza por...
      article = await WikiArticle.findOne({ title: reStart }).lean();
      console.log(
        "-> búsqueda por título 'startsWith':",
        !!article,
        "pattern:",
        reStart
      );
      if (article) return res.json(article);

      // anywhere in title
      const reAnywhere = new RegExp(esc(titleLike), "i");
      article = await WikiArticle.findOne({ title: reAnywhere }).lean();
      console.log(
        "-> búsqueda por título 'anywhere':",
        !!article,
        "pattern:",
        reAnywhere
      );
      if (article) return res.json(article);
    }

    // 4) intento: búsqueda parcial de slug con '.*' entre palabras (último recurso)
    const parts = slug.split("-").filter(Boolean);
    if (parts.length) {
      const pattern = parts
        .map((esc) => esc.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
        .join(".*");
      const slugRegex = new RegExp(pattern, "i");
      article = await WikiArticle.findOne({ slug: slugRegex }).lean();
      console.log(
        "-> búsqueda slug regex parcial:",
        !!article,
        "pattern:",
        slugRegex
      );
      if (article) return res.json(article);
    }

    // No encontrado
    console.log("Artículo NO encontrado para slug:", rawSlug);
    return res.status(404).json({ message: "Artículo no encontrado" });
  } catch (error) {
    console.error("Error al obtener artículo por slug:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener artículo", error });
  }
};

// 📌 Filtrar artículos por tipo (category) - compatibilidad (devuelve array)
exports.getArticlesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const includeUnpublished = req.query.includeUnpublished === "true";
    const articles = await WikiArticle.findByCategory(type, includeUnpublished);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar artículos", error });
  }
};

// 📌 Buscar artículos (texto completo) - paginado
exports.searchArticles = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q)
      return res.status(400).json({ message: "Query de búsqueda requerido" });

    const { page, limit } = parsePageLimit(req.query.page, req.query.limit);

    // Filtro base: texto completo + sólo publicados por defecto
    const filter = {
      $text: { $search: q },
      status: "published",
      publishedAt: { $lte: new Date() },
    };
    if (req.query.category) filter.category = req.query.category;

    const total = await WikiArticle.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const articles = await WikiArticle.find(filter, {
      score: { $meta: "textScore" },
    })
      .sort({ score: { $meta: "textScore" }, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      data: articles,
      pagination: { page, pages, total, limit },
    });
  } catch (error) {
    console.error("Error en búsqueda de artículos:", error);
    res.status(500).json({ message: "Error en búsqueda", error });
  }
};

// 📌 Crear un artículo
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      subcategory,
      tags,
      ttrpg,
      status,
      author,
      featured,
      order,
      parentArticle,
      seo,
    } = req.body;

    const featuredImage = safeParseJSON(req.body.featuredImage, null);
    const gallery = safeParseJSON(req.body.gallery, []);
    const parsedTags = safeParseJSON(tags, []);

    // Sanitizar SEO (metaDescription truncado a 160)
    const parsedSeo = safeParseJSON(seo, {});
    if (parsedSeo && parsedSeo.metaDescription) {
      parsedSeo.metaDescription = truncate(parsedSeo.metaDescription, 160);
    }

    const newArticle = new WikiArticle({
      title,
      content,
      excerpt,
      category,
      subcategory,
      tags: parsedTags,
      ttrpg,
      status,
      author,
      featuredImage,
      gallery,
      featured,
      order,
      parentArticle,
      seo: parsedSeo,
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    console.error("❌ Error al crear artículo:", error);
    res.status(500).json({ message: "Error al crear artículo", error });
  }
};

// 📌 Actualizar artículo por slug
exports.updateArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let updatedFields = { ...req.body };

    // Manejar JSON si vienen como string
    if (updatedFields.tags && typeof updatedFields.tags === "string") {
      updatedFields.tags = safeParseJSON(updatedFields.tags, []);
    }
    if (
      updatedFields.featuredImage &&
      typeof updatedFields.featuredImage === "string"
    ) {
      updatedFields.featuredImage = safeParseJSON(
        updatedFields.featuredImage,
        null
      );
    }
    if (updatedFields.gallery && typeof updatedFields.gallery === "string") {
      updatedFields.gallery = safeParseJSON(updatedFields.gallery, []);
    }
    if (updatedFields.seo && typeof updatedFields.seo === "string") {
      updatedFields.seo = safeParseJSON(updatedFields.seo, {});
    }

    // Truncar metaDescription si existe
    if (updatedFields.seo && updatedFields.seo.metaDescription) {
      updatedFields.seo.metaDescription = truncate(
        updatedFields.seo.metaDescription,
        160
      );
    }

    const updatedArticle = await WikiArticle.findOneAndUpdate(
      { slug },
      updatedFields,
      { new: true }
    );

    if (!updatedArticle)
      return res.status(404).json({ message: "Artículo no encontrado" });

    res.json(updatedArticle);
  } catch (error) {
    console.error("❌ Error al actualizar artículo:", error);
    res.status(500).json({ message: "Error al actualizar artículo", error });
  }
};

// 📌 Eliminar artículo por slug
exports.deleteArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedArticle = await WikiArticle.findOneAndDelete({ slug });
    if (!deletedArticle)
      return res.status(404).json({ message: "Artículo no encontrado" });
    res.json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar artículo", error });
  }
};

// 📌 Estadísticas generales
exports.getStats = async (req, res) => {
  try {
    const total = await WikiArticle.countDocuments();
    const published = await WikiArticle.countDocuments({ status: "published" });
    const drafts = await WikiArticle.countDocuments({ status: "draft" });
    const archived = await WikiArticle.countDocuments({ status: "archived" });

    res.json({ total, published, drafts, archived });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
};
