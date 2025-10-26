const express = require("express");
const router = express.Router();
const Language = require("../models/sheet/commons/language"); // Asegúrate de que la ruta es correcta

// Obtener todos los idiomas
router.get("/", async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los idiomas" });
  }
});

module.exports = router;
