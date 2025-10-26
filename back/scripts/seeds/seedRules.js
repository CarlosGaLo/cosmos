const fs = require("fs");
const path = require("path");
const Rule = require("../../models/info/Rule");

const seedRules = async () => {
  try {
    const filePath = path.resolve(__dirname, "../../data/info/rules.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Rule.deleteMany({});

    await Rule.insertMany(jsonData);
    console.log("✅ Datos de Rules insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedRules:", error);
  }
};

module.exports = seedRules;
