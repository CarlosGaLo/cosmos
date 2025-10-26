const express = require("express");
const router = express.Router();
const Article = require("../models/info/article.js");

//Get All
router.get("/All", async (req, res) => {
  const article = await Article.find();
  res.json(article);
});

// Get by Id
router.get("/getById/:name", async (req, res) => {
  try {
    const id = req.params.id;
    const competence = await Competence.findOne({ id: id });
    if (!competence) {
      return res.status(404).json({ message: "Competence no encontrado" });
    }
    res.json(competence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get by Name
router.get("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const article = await Article.findOne({ name: name });
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post using Body
router.post("/", async (req, res) => {
  try {
    const newArticle = new Article({
      name: req.body.name,
      type: req.body.type,
      ttrpg: req.body.ttrpg,
      text: req.body.text,
      lastModification: req.body.lastModification,
      lastUserModifier: req.body.lastUserModifier,
      securityVersión: req.body.securityVersión,
      resume: req.body.resume,
    });

    // Save
    const saveArticle = await newArticle.save();

    // Response
    res.status(201).json(saveArticle);
  } catch (error) {
    // Errors
    res.status(500).json({ message: error.message });
  }
});

// Put name, text and lastModification date
router.put("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const { newName, newText, newLastModification, newResume } = req.body;

    // Verify if article exist
    const article = await Article.findOne({ name: name });
    if (!article) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Update properties
    article.name = newName || article.name;
    article.text = newText || article.text;
    article.lastModification = newLastModification || article.lastModification;
    article.resume = newResume || article.resume;

    // Guardar el artículo actualizado
    const updatedArticle = await article.save();

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete using name
router.delete("/:name", async (req, res) => {
  try {
    const name = req.params.name;

    // Buscar y eliminar el artículo por su nombre
    const deletedArticle = await Article.findOneAndDelete({ name: name });

    if (!deletedArticle) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    res.json({ message: "Artículo eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
