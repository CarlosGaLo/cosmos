const express = require("express");
const router = express.Router();
const Feat = require("../models/sheet/commons/Feats");

//Get All
router.get("/", async (req, res) => {
  const feat = await Feat.find();
  res.json(feat);
});

//Clear All -> Commented for security reasons
// router.delete("/clearAll", async (req, res) => {
//   try {
//     await Feat.deleteMany();

//     res.json({
//       message: "Todos los elementos de la base de datos han sido eliminados",
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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
    const feat = await Feat.findOne({ name: name });
    if (!feat) {
      return res.status(404).json({ message: "Feat no encontrado" });
    }
    res.json(feat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post using Body
router.post("/", async (req, res) => {
  try {
    const newFeat = new Feat({
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
    const { newName, newXP, newResume, newDescription, newRequisites } =
      req.body;

    // Verify if article exist
    const feat = await Feat.findOne({ _id: id });
    if (!feat) {
      return res.status(404).json({ message: "feat no encontrado" });
    }

    // Update properties
    feat.name = newName || feat.name;
    feat.resume = newResume || feat.resume;
    feat.xp = newXP || feat.resume;
    feat.description = newDescription || feat.resume;
    feat.requisites = newRequisites || feat.resume;

    // Guardar el artículo actualizado
    const updatedFeat = await feat.save();

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
    const feat = await Feat.findOne({ name: name });
    if (!feat) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    // Update properties
    feat.name = newName || feat.name;
    feat.resume = newResume || feat.resume;
    feat.xp = newXP || feat.resume;
    feat.description = newDescription || feat.resume;
    feat.requisites = newRequisites || feat.resume;

    // Guardar el artículo actualizado
    const updatedFeat = await feat.save();

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
    const deletedFeat = await Feat.findOneAndDelete({ name: name });

    if (!deletedFeat) {
      return res.status(404).json({ message: "Feat no encontrado" });
    }

    res.json({ message: "Feat eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
