const fs = require("fs");
const path = require("path");
const Competence = require("../../models/sheet/commons/Competences");

const seedCompetences = async () => {
  try {
    const filePath = path.resolve(
      __dirname,
      "../../data/commons/competence.json"
    );
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Competence.deleteMany({});

    await Competence.insertMany(jsonData);
    console.log("✅ Datos de Camps insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedCamps:", error);
  }
};

module.exports = seedCompetences;
