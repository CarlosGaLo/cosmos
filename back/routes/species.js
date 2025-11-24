const express = require("express");
const router = express.Router();
const specieController = require("../controllers/specieController");

// Obtener todas las especies
router.get("/", specieController.getAllSpecies);

// Obtener una especie por nombre
router.get("/:name", specieController.getSpecieByName);

module.exports = router;
