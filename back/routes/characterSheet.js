const express = require("express");
const router = express.Router();
const characterSheetController = require("../controllers/characterSheet");
const verifyToken = require("../middlewares/authMiddleware"); // IMPORTANTE

// Rutas protegidas (requieren autenticación)
router.post("/", verifyToken, characterSheetController.createCharacterSheet);
router.get(
  "/my-sheets",
  verifyToken,
  characterSheetController.getUserCharacterSheets
); // NUEVO
router.get("/:id", verifyToken, characterSheetController.getCharacterSheetById);
router.put("/:id", verifyToken, characterSheetController.updateCharacterSheet);
router.delete(
  "/:id",
  verifyToken,
  characterSheetController.deleteCharacterSheet
);

// Públicas (opcional, para búsqueda por nombre)
router.get("/name/:name", characterSheetController.getCharacterSheetByName);

module.exports = router;
