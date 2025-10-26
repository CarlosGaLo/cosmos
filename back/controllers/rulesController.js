const mongoose = require("mongoose");
const Rule = require("../models/info/Rule");

// Crear una nueva regla
exports.createRule = async (req, res) => {
  try {
    const rule = new Rule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las reglas con filtros, paginación y relaciones pobladas
exports.getRules = async (req, res) => {
  try {
    const { category, subcategory, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (search) filter.title = { $regex: search, $options: "i" };

    const rules = await Rule.find(filter).populate("relatedRules", "sID title"); // Poblado de relaciones

    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Con paginación, para el futuro.
// exports.getRules = async (req, res) => {
//   try {
//     const { category, subcategory, search, page = 1, limit = 10 } = req.query;
//     const filter = {};

//     if (category) filter.category = category;
//     if (subcategory) filter.subcategory = subcategory;
//     if (search) filter.title = { $regex: search, $options: "i" };

//     const rules = await Rule.find(filter)
//       .populate("relatedRules", "sID title") // Poblado de relaciones
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     res.status(200).json(rules);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Obtener una regla por ID o sID con relaciones pobladas
exports.getRuleByIdOrSID = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si es un ObjectId válido
    let rule;
    if (mongoose.Types.ObjectId.isValid(id)) {
      rule = await Rule.findById(id)
        .populate("relatedRules", "sID title") // Poblado de relaciones
        .exec();
    }

    // Si no es ObjectId o no se encontró, buscar por sID (sin sensibilidad a mayúsculas)
    if (!rule) {
      rule = await Rule.findOne({ sID: new RegExp(`^${id}$`, "i") })
        .populate("relatedRules", "sID title") // Poblado de relaciones
        .exec();
    }

    if (!rule) {
      return res.status(404).json({ message: "Regla no encontrada" });
    }

    console.log("🔍 Regla encontrada:", rule); // LOG PARA DEPURAR
    res.status(200).json(rule);
  } catch (error) {
    console.error("❌ Error al obtener la regla:", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una regla y resolver relaciones
exports.updateRule = async (req, res) => {
  try {
    // Actualizar la regla
    const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("relatedRules", "sID title"); // Poblado de relaciones

    if (!rule) return res.status(404).json({ message: "Regla no encontrada" });

    // Si se actualizaron las relaciones, resolverlas de nuevo
    if (req.body.relatedRules) {
      await resolveRelatedRules(rule);
    }

    res.status(200).json(rule);
  } catch (error) {
    console.error("❌ Error al actualizar la regla:", error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una regla
exports.deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ message: "Regla no encontrada" });
    res.status(200).json({ message: "Regla eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Función auxiliar para resolver relaciones entre reglas
const resolveRelatedRules = async (rule) => {
  try {
    // Buscar los _id de las reglas relacionadas en una sola consulta
    const relatedRulesMap = await Rule.find({
      sID: { $in: rule.relatedRules },
    }).select("_id sID");

    // Convertir los ObjectId encontrados en un array
    const relatedIds = relatedRulesMap.map((rel) => rel._id);

    // Actualizar la regla con los ObjectId de las relaciones
    rule.relatedRules = relatedIds;
    await rule.save();
  } catch (error) {
    console.error("❌ Error al resolver relaciones:", error);
  }
};
