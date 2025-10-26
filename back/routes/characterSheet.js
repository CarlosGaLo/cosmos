const express = require("express");
const router = express.Router();
const characterSheetController = require("../controllers/characterSheet");

// Crear una ficha
router.post("/", characterSheetController.createCharacterSheet);

// Obtener todas las fichas
router.get("/", characterSheetController.getCharacterSheets);

// Obtener una ficha por ID
router.get("/:id", characterSheetController.getCharacterSheetById);

// Actualizar una ficha por ID
router.put("/:id", characterSheetController.updateCharacterSheet);

// Eliminar una ficha por ID
router.delete("/:id", characterSheetController.deleteCharacterSheet);

router.get("/name/:name", characterSheetController.getCharacterSheetByName);

module.exports = router;
