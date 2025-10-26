const fs = require("fs");
const path = require("path");
const Martial = require("../../models/sheet/combat/Martials");

const seedMartial = async () => {
  try {
    const filePath = path.resolve(__dirname, "../../data/combat/martial.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Martial.deleteMany({});

    await Martial.insertMany(jsonData);
    console.log("✅ Datos de Camps insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedCamps:", error);
  }
};

module.exports = seedMartial;
