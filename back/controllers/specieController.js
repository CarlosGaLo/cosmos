const Specie = require("../models/sheet/commons/Specie");

exports.getAllSpecies = async (req, res) => {
  try {
    const species = await Specie.find()
      .populate("specieSpecial")
      .populate("camp");
    res.json(species);
  } catch (error) {
    console.error("❌ Error en getAllSpecies:", error);
    res.status(500).json({
      message: "Error al obtener las especies",
      error: error.message,
    });
  }
};

exports.getSpecieByName = async (req, res) => {
  try {
    const name = req.params.name;
    console.log("🔍 Buscando especie:", name);

    const specie = await Specie.findOne({ name: new RegExp(name, "i") })
      .populate("specieSpecial")
      .populate("camp");

    console.log("📦 Resultado:", specie);

    if (!specie) {
      return res.status(404).json({ message: "Especie no encontrada" });
    }

    res.json(specie);
  } catch (error) {
    console.error("❌ Error en getSpecieByName:", error);
    console.error("❌ Stack:", error.stack);
    res.status(500).json({
      message: "Error al obtener la especie",
      error: error.message,
      stack: error.stack,
    });
  }
};
