const express = require("express");
const router = express.Router();
const Spell = require("../models/sheet/combat/Spells");

//Get All
router.get("/", async (req, res) => {
  const spell = await Spell.find();
  res.json(spell);
});

//Clear All -> Commented for security reasons
// router.delete("/clearAll", async (req, res) => {
//   try {
//     await Spell.deleteMany();

//     res.json({
//       message: "Todos los elementos de la base de datos han sido eliminados",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Get by Id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const spell = await Spell.findOne({ _id: id });
    if (!spell) {
      return res.status(404).json({ message: "Spell no encontrado" });
    }
    res.json(spell);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get by Name
router.get("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const spell = await Spell.findOne({ name: name });
    if (!spell) {
      return res.status(404).json({ message: "Spell no encontrado" });
    }
    res.json(spell);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post using Body
router.post("/", async (req, res) => {
  try {
    const newFeat = new Spell({
      name: req.body.name,
      xp: req.body.xp,
      requisites: req.body.requisites,
      description: req.body.description,
      resume: req.body.resume,
      isAdquired: req.body.isAdquired,
    });

    // Save
    const saveFeat = await newFeat.save();

    // Response
    res.status(201).json(saveFeat);
  } catch (error) {
    // Errors
    res.status(500).json({ message: error.message });
  }
});

// Put name, text and lastModification date
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Verify if spell exist
    const spell = await Spell.findOne({ _id: id });
    if (!spell) {
      return res
        .status(404)
        .json({ message: "spell no encontrado - Routes>Spells.js" });
    }

    // Update properties
    spell.name = req.body.newName || spell.name;
    spell.lvl = req.body.newLvl || spell.lvl;
    spell.xp = req.body.newXP || spell.xp;
    spell.requisites = req.body.newRequisites || spell.requisites;
    spell.resume = req.body.newResume || spell.resume;
    spell.description = req.body.newDescription || spell.description;
    spell.group = req.body.newGroup || spell.group;
    spell.manaCost = req.body.newManaCost || spell.manaCost;
    spell.threshold = req.body.newThreshold || spell.threshold;
    spell.isAdquired = req.body.newIsAdquired || spell.isAdquired;
    spell.challenge = req.body.newChallenge || spell.challenge;

    // Guardar el artículo actualizado
    const updatedFeat = await spell.save();

    res.json(updatedFeat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Put name, text and lastModification date
router.put("/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const { newName, newXP, newResume, newDescription, newRequisites } =
      req.body;

    // Verify if article exist
    const spell = await Spell.findOne({ name: name });
    if (!spell) {
      return res.status(404).json({ message: "spell no encontrado" });
    }

    // Update properties
    spell.name = newName || spell.name;
    spell.resume = newResume || spell.resume;
    spell.xp = newXP || spell.resume;
    spell.description = newDescription || spell.resume;
    spell.requisites = newRequisites || spell.resume;

    // Guardar el artículo actualizado
    const updatedFeat = await spell.save();

    res.json(updatedFeat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteById/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar y eliminar el artículo por su nombre
    const deletedFeat = await Competence.findOneAndDelete({ id: id });

    if (!deletedFeat) {
      return res.status(404).json({ message: "Competence no encontrado" });
    }

    res.json({ message: "Competence eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:name", async (req, res) => {
  try {
    const name = req.params.name;

    // Buscar y eliminar el artículo por su nombre
    const deletedFeat = await Spell.findOneAndDelete({ name: name });

    if (!deletedFeat) {
      return res.status(404).json({ message: "Spell no encontrado" });
    }

    res.json({ message: "Spell eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
