const CharacterSheet = require("../models/sheet/CharacterSheet");
const {
  normalizeCharacterSheet,
} = require("../scripts/utils/normalizeCharacterSheets");

// ✅ Registro explícito de todos los modelos necesarios ANTES de los populate
require("../models/registerModels");

// Crear una ficha
exports.createCharacterSheet = async (req, res) => {
  try {
    const userId = req.user.id; // Viene del middleware de autenticación
    const processedData = await normalizeCharacterSheet(req.body);
    const sheet = new CharacterSheet({ ...processedData, userId });
    await sheet.save();
    res.status(201).json(sheet);
  } catch (error) {
    console.error("❌ Error creating character sheet:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las fichas
exports.getCharacterSheets = async (req, res) => {
  try {
    const sheets = await CharacterSheet.find()
      .populate("character.specie")
      .populate("character.art")
      .populate("character.cul")
      .populate("character.mov")
      .populate("character.sob")
      .populate("character.sup")
      .populate("character.vig")
      .populate({ path: "competences", model: "Competences" })
      .populate({ path: "feats", model: "Feats" })
      .populate({ path: "unfeats", model: "Feats" })
      // .populate({ path: "zonaAfin" }) // si no tiene modelo asociado, se puede dejar así
      .populate({ path: "languages", model: "Languages" })
      .populate({ path: "spells", model: "Spells" })
      .populate({ path: "martials", model: "Martials" });

    res.json(sheets);
  } catch (error) {
    console.error("❌ Error fetching character sheets:", error);
    res.status(500).json({ message: "Error fetching character sheets", error });
  }
};

exports.getUserCharacterSheets = async (req, res) => {
  try {
    const userId = req.user.id;
    const sheets = await CharacterSheet.find({ userId })
      .populate("character.specie")
      .populate("character.art")
      .populate("character.cul")
      .populate("character.mov")
      .populate("character.sob")
      .populate("character.sup")
      .populate("character.vig")
      .populate({ path: "competences", model: "Competences" })
      .populate({ path: "feats", model: "Feats" })
      .populate({ path: "unfeats", model: "Feats" })
      .populate({ path: "languages", model: "Languages" })
      .populate({ path: "spells", model: "Spells" })
      .populate({ path: "martials", model: "Martials" })
      .sort({ updatedAt: -1 });

    res.json(sheets);
  } catch (error) {
    console.error("❌ Error fetching user sheets:", error);
    res.status(500).json({ message: "Error fetching character sheets", error });
  }
};

// Obtener una ficha por ID
exports.getCharacterSheetById = async (req, res) => {
  try {
    const sheet = await CharacterSheet.findById(req.params.id)
      .populate("character.specie")
      .populate("character.art")
      .populate("character.cul")
      .populate("character.mov")
      .populate("character.sob")
      .populate("character.sup")
      .populate("character.vig")
      .populate({ path: "competences", model: "Competences" })
      .populate({ path: "feats", model: "Feats" })
      .populate({ path: "unfeats", model: "Feats" })
      // .populate({ path: "zonaAfin" })
      .populate({ path: "languages", model: "Languages" })
      .populate({ path: "spells", model: "Spells" })
      .populate({ path: "martials", model: "Martials" });

    if (!sheet)
      return res.status(404).json({ message: "Character sheet not found" });

    res.json(sheet);
  } catch (error) {
    console.error("❌ Error fetching character sheet by ID:", error);
    res.status(500).json({ message: "Error fetching character sheet", error });
  }
};

// Obtener ficha por nombre
exports.getCharacterSheetByName = async (req, res) => {
  try {
    const name = req.params.name;
    console.log("🔍 Buscando ficha por nombre:", name);

    const sheet = await CharacterSheet.findOne({ "character.name": name })
      .populate({
        path: "character.camp.art",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.camp.cul",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.camp.mov",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.camp.sob",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.camp.sup",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.camp.vig",
        options: { strictPopulate: false },
      })
      .populate({
        path: "character.specie",
        options: { strictPopulate: false },
      })
      .populate({ path: "competences", model: "Competences" })
      .populate({ path: "feats", model: "Feats" })
      .populate({ path: "unfeats", model: "Feats" })
      .populate({ path: "languages", model: "Languages" })
      .populate({ path: "spells", model: "Spells" })
      .populate({ path: "martials", model: "Martials" });

    if (!sheet) {
      console.log("❌ Ficha no encontrada para:", name);
      return res.status(404).json({ message: "Ficha no encontrada" });
    }

    console.log("✅ Ficha encontrada y enviada:", sheet.character.name);
    return res.json(sheet);
  } catch (error) {
    console.error("❌ Error interno en getCharacterSheetByName:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error });
  }
};

// Actualizar ficha
exports.updateCharacterSheet = async (req, res) => {
  try {
    const updatedSheet = await CharacterSheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSheet)
      return res.status(404).json({ message: "Character sheet not found" });

    res.json(updatedSheet);
  } catch (error) {
    console.error("❌ Error updating character sheet:", error);
    res.status(500).json({ message: "Error updating character sheet", error });
  }
};

// Eliminar ficha
exports.deleteCharacterSheet = async (req, res) => {
  try {
    const deleted = await CharacterSheet.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Character sheet not found" });

    res.json({ message: "Character sheet deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting character sheet:", error);
    res.status(500).json({ message: "Error deleting character sheet", error });
  }
};
