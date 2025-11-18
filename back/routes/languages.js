const express = require("express");
const router = express.Router();
const Language = require("../models/sheet/commons/language");

// Obtener todos los idiomas
router.get("/", async (req, res) => {
  try {
    const languages = await Language.find().sort({ name: 1 });

    console.log(`📚 Languages found: ${languages.length}`);

    res.json(languages);
  } catch (error) {
    console.error("❌ Error fetching languages:", error);
    res.status(500).json({
      error: "Error al obtener los idiomas",
      message: error.message,
    });
  }
});

// Obtener un idioma por ID
router.get("/:id", async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ error: "Idioma no encontrado" });
    }

    res.json(language);
  } catch (error) {
    console.error("❌ Error fetching language:", error);
    res.status(500).json({
      error: "Error al obtener el idioma",
      message: error.message,
    });
  }
});

// Crear un nuevo idioma (admin)
router.post("/", async (req, res) => {
  try {
    const { name, proficiency, description } = req.body;

    const newLanguage = new Language({
      name,
      proficiency: proficiency || "Básico",
      description: description || "Sin descripción disponible",
    });

    await newLanguage.save();

    res.status(201).json(newLanguage);
  } catch (error) {
    console.error("❌ Error creating language:", error);
    res.status(500).json({
      error: "Error al crear el idioma",
      message: error.message,
    });
  }
});

// Actualizar un idioma (admin)
router.put("/:id", async (req, res) => {
  try {
    const { name, proficiency, description } = req.body;

    const updatedLanguage = await Language.findByIdAndUpdate(
      req.params.id,
      { name, proficiency, description },
      { new: true, runValidators: true }
    );

    if (!updatedLanguage) {
      return res.status(404).json({ error: "Idioma no encontrado" });
    }

    res.json(updatedLanguage);
  } catch (error) {
    console.error("❌ Error updating language:", error);
    res.status(500).json({
      error: "Error al actualizar el idioma",
      message: error.message,
    });
  }
});

// Eliminar un idioma (admin)
router.delete("/:id", async (req, res) => {
  try {
    const deletedLanguage = await Language.findByIdAndDelete(req.params.id);

    if (!deletedLanguage) {
      return res.status(404).json({ error: "Idioma no encontrado" });
    }

    res.json({ message: "Idioma eliminado correctamente", deletedLanguage });
  } catch (error) {
    console.error("❌ Error deleting language:", error);
    res.status(500).json({
      error: "Error al eliminar el idioma",
      message: error.message,
    });
  }
});

module.exports = router;
