const Ability = require("../models/enemies/Ability");
const mongoose = require("mongoose");

// 📌 Obtener todas las Abilities (opcional: filtrar por nombre)
exports.getAllAbilities = async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = new RegExp(req.query.name, "i"); // Búsqueda flexible
    }

    const abilities = await Ability.find(query).populate("bodyParts");
    res.json(abilities);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener Abilities", error });
  }
};

// 📌 Obtener una Ability por ID o por nombre
exports.getAbility = async (req, res) => {
  try {
    const { idOrName } = req.params;

    let ability;
    if (mongoose.isValidObjectId(idOrName)) {
      ability = await Ability.findById(idOrName).populate("bodyPart"); // Buscar por ID
    } else {
      ability = await Ability.findOne({
        name: new RegExp(idOrName, "i"),
      }).populate("bodyPart"); // Buscar por nombre
    }

    if (!ability)
      return res.status(404).json({ message: "Ability no encontrada" });
    res.json(ability);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener Ability", error });
  }
};

// 📌 Crear una nueva Ability
exports.createAbility = async (req, res) => {
  try {
    const newAbility = new Ability(req.body);
    await newAbility.save();
    res.status(201).json(newAbility);
  } catch (error) {
    res.status(400).json({ message: "Error al crear Ability", error });
  }
};

// 📌 Actualizar una Ability por ID
exports.updateAbility = async (req, res) => {
  try {
    const updatedAbility = await Ability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAbility)
      return res.status(404).json({ message: "Ability no encontrada" });
    res.json(updatedAbility);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar Ability", error });
  }
};

// 📌 Eliminar una Ability por ID
exports.deleteAbility = async (req, res) => {
  try {
    const deletedAbility = await Ability.findByIdAndDelete(req.params.id);
    if (!deletedAbility)
      return res.status(404).json({ message: "Ability no encontrada" });
    res.json({ message: "Ability eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar Ability", error });
  }
};
