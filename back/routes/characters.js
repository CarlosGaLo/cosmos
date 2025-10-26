const express = require("express");
const router = express.Router();
const CharacterController = require("../controllers/CharacterController");

// Rutas para CRUD de Characters
router.get("/name/:name", CharacterController.getCharacterByName);
router.get("/:id", CharacterController.getCharacterById);
router.get("/", CharacterController.getAllCharacters);

router.post("/", CharacterController.createCharacter);

router.put("/:id", CharacterController.updateCharacter);

router.delete("/:id", CharacterController.deleteCharacter);

module.exports = router;
