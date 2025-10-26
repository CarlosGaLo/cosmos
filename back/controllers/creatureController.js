const mongoose = require("mongoose"); // ✅ IMPORTANTE: Importar mongoose
const Creature = require("../models/enemies/creature");
const path = require("path");
const fs = require("fs");

// 📌 Obtener todas las criaturas
exports.getAllCreatures = async (req, res) => {
  try {
    const creatures = await Creature.find();
    res.json(creatures);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener criaturas", error });
  }
};

// 📌 Obtener criatura por ID o Nombre
exports.getCreatureById = async (req, res) => {
  try {
    const { idOrName } = req.params; // ✅ CORREGIDO: Se asegura de que el parámetro se capture bien

    const query = mongoose.isValidObjectId(idOrName)
      ? { _id: idOrName }
      : { name: new RegExp(idOrName.replace(/-/g, " "), "i") }; // ✅ Corrige guiones a espacios

    const creature = await Creature.findOne(query);
    if (!creature)
      return res.status(404).json({ message: "Criatura no encontrada" });

    res.json(creature);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener criatura", error });
  }
};

// 📌 Crear una nueva criatura con imagen
exports.createCreature = async (req, res) => {
  try {
    console.log("🖼 Recibiendo datos de la criatura:", req.body);
    console.log("📸 Imagen recibida:", req.file);

    const { name, habitat, bodyParts, camps, turn, damage } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newCreature = new Creature({
      name,
      habitat: JSON.parse(habitat || "[]"),
      bodyParts: JSON.parse(bodyParts || "[]"),
      camps: JSON.parse(camps || "[]"),
      turn,
      damage,
      image, // ✅ Guardamos solo la URL del archivo en MongoDB
    });

    const savedCreature = await newCreature.save();
    res.status(201).json(savedCreature);
  } catch (error) {
    console.error("❌ Error al crear criatura:", error);
    res.status(500).json({ message: "Error al crear criatura", error });
  }
};

// 📌 Obtener criatura por nombre
exports.getCreatureByName = async (req, res) => {
  try {
    const creature = await Creature.findOne({
      name: new RegExp(req.params.name, "i"),
    });
    if (!creature)
      return res.status(404).json({ message: "Criatura no encontrada" });
    res.json(creature);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener criatura", error });
  }
};

// 📌 Actualizar criatura por ID
exports.updateCreatureById = async (req, res) => {
  try {
    let updatedFields = { ...req.body };

    // ✅ Convertir campos JSON que pueden ser enviados como string
    if (typeof updatedFields.bodyParts === "string") {
      updatedFields.bodyParts = JSON.parse(updatedFields.bodyParts);
    }

    if (typeof updatedFields.camps === "string") {
      updatedFields.camps = JSON.parse(updatedFields.camps);
    }

    if (typeof updatedFields.habitat === "string") {
      updatedFields.habitat = JSON.parse(updatedFields.habitat);
    }

    // ✅ Manejar la imagen si se sube una nueva
    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;

      // Eliminar la imagen anterior si existe
      const creature = await Creature.findById(req.params.id);
      if (creature && creature.image) {
        const oldImagePath = path.join(__dirname, "..", creature.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedCreature = await Creature.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.json(updatedCreature);
  } catch (error) {
    console.error("❌ Error al actualizar criatura:", error);
    res.status(500).json({ message: "Error al actualizar criatura", error });
  }
};

// 📌 Eliminar criatura por ID
exports.deleteCreatureById = async (req, res) => {
  try {
    await Creature.findByIdAndDelete(req.params.id);
    res.json({ message: "Criatura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar criatura", error });
  }
};
