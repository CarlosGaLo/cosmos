const express = require("express");
const router = express.Router();
const Competence = require("../models/sheet/commons/Competences");

//Get All
router.get("/", async (req, res) => {
  const competence = await Competence.find();
  res.json(competence);
});

//Clear All -> Commented for security reasons
// router.delete("/clearAll", async (req, res) => {
//   try {
//     await Competence.deleteMany();

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
    const competence = await Competence.findOne({ name: name });
    if (!competence) {
      return res.status(404).json({ message: "Competence no encontrado" });
    }
    res.json(competence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post using Body
router.post("/", async (req, res) => {
  try {
    const newFeat = new Competence({
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
router.put("/putById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { newName, newXP, newResume, newDescription, newRequisites } =
      req.body;

    // Verify if article exist
    const unfeat = await Unfeat.findOne({ name: id });
    if (!unfeat) {
      return res.status(404).json({ message: "unfeat no encontrado" });
    }

    // Update properties
    unfeat.name = newName || unfeat.name;
    unfeat.resume = newResume || unfeat.resume;
    unfeat.xp = newXP || unfeat.resume;
    unfeat.description = newDescription || unfeat.resume;
    unfeat.requisites = newRequisites || unfeat.resume;

    // Guardar el artículo actualizado
    const updatedFeat = await unfeat.save();

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
    const competence = await Competence.findOne({ name: name });
    if (!competence) {
      return res.status(404).json({ message: "competence no encontrado" });
    }

    // Update properties
    competence.name = newName || competence.name;
    competence.resume = newResume || competence.resume;
    competence.xp = newXP || competence.resume;
    competence.description = newDescription || competence.resume;
    competence.requisites = newRequisites || competence.resume;

    // Guardar el artículo actualizado
    const updatedFeat = await competence.save();

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
    const deletedFeat = await Competence.findOneAndDelete({ name: name });

    if (!deletedFeat) {
      return res.status(404).json({ message: "Competence no encontrado" });
    }

    res.json({ message: "Competence eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
