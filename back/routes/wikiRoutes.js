const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");

// ==========================
// RUTAS DE ARTÍCULOS
// ==========================

// Listar todos los artículos
router.get("/", wikiController.getAllArticles);

// Ver artículo específico por slug
router.get("/:slug", wikiController.getArticleBySlug);

// Filtrar artículos por tipo (category)
router.get("/type/:type", wikiController.getArticlesByType);

// Búsqueda de artículos
router.get("/search", wikiController.searchArticles);

// Crear un nuevo artículo
router.post("/", wikiController.createArticle);

// Actualizar artículo por slug
router.put("/:slug", wikiController.updateArticleBySlug);

// Eliminar artículo por slug
router.delete("/:slug", wikiController.deleteArticleBySlug);

// Obtener estadísticas generales
router.get("/stats", wikiController.getStats);

module.exports = router;
