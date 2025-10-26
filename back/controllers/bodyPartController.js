const mongoose = require("mongoose");
const BodyPart = require("../models/enemies/BodyPart");

// 📌 Obtener todas las BodyParts (opcional: filtrar por nombre)
exports.getAllBodyParts = async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.part = new RegExp(req.query.name, "i"); // Búsqueda flexible (case-insensitive)
    }

    const bodyParts = await BodyPart.find(query);
    res.json(bodyParts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener BodyParts", error });
  }
};

// 📌 Obtener una BodyPart por ID o por nombre
exports.getBodyPart = async (req, res) => {
  try {
    const { idOrName } = req.params;

    let bodyPart;
    if (mongoose.isValidObjectId(idOrName)) {
      bodyPart = await BodyPart.findById(idOrName); // Buscar por ID
    } else {
      bodyPart = await BodyPart.findOne({ part: new RegExp(idOrName, "i") }); // Buscar por nombre
    }

    if (!bodyPart)
      return res.status(404).json({ message: "BodyPart no encontrada" });

    res.json(bodyPart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener BodyPart", error });
  }
};

// 📌 Crear una nueva BodyPart
exports.createBodyPart = async (req, res) => {
  try {
    const newBodyPart = new BodyPart(req.body);
    const savedBodyPart = await newBodyPart.save(); // Guarda en la BD

    console.log("✅ BodyPart guardado en la BD:", savedBodyPart); // 📌 Verifica en la consola del backend

    res.status(201).json(savedBodyPart); // 📌 Asegura que devuelve el objeto con `_id`
  } catch (error) {
    console.error("❌ Error al crear BodyPart:", error);
    res.status(500).json({ message: "Error al crear BodyPart", error });
  }
};

// 📌 Actualizar una BodyPart por ID
exports.updateBodyPart = async (req, res) => {
  try {
    const updatedBodyPart = await BodyPart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBodyPart)
      return res.status(404).json({ message: "BodyPart no encontrada" });

    res.json(updatedBodyPart);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar BodyPart", error });
  }
};

// 📌 Eliminar una BodyPart por ID
exports.deleteBodyPart = async (req, res) => {
  try {
    const deletedBodyPart = await BodyPart.findByIdAndDelete(req.params.id);
    if (!deletedBodyPart)
      return res.status(404).json({ message: "BodyPart no encontrada" });

    res.json({ message: "BodyPart eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar BodyPart", error });
  }
};

exports.getBodyPartsByIds = async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(",") : [];

    if (ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No se han proporcionado IDs válidos." });
    }

    const bodyParts = await BodyPart.find({ _id: { $in: ids } });

    if (!bodyParts.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron BodyParts con esos IDs." });
    }

    res.json(bodyParts);
  } catch (error) {
    console.error("❌ Error al obtener BodyParts:", error);
    res.status(500).json({ message: "Error al obtener BodyParts", error });
  }
};
