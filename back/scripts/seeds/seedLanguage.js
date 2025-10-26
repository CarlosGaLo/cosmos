const fs = require("fs");
const path = require("path");
const Language = require("../../models/sheet/commons/language");

const seedLanguage = async () => {
  try {
    const filePath = path.resolve(__dirname, "../../data/commons/lang.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Language.deleteMany({});

    await Language.insertMany(jsonData);
    console.log("✅ Datos de Camps insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedCamps:", error);
  }
};

module.exports = seedLanguage;
