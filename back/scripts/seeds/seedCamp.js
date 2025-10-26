const fs = require("fs");
const path = require("path");
const Camp = require("../../models/sheet/commons/Camp");

const seedCamps = async () => {
  try {
    const filePath = path.resolve(
      __dirname,
      "../../data/commons/Camp.json"
    );
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Camp.deleteMany({});

    await Camp.insertMany(jsonData);
    console.log("✅ Datos de Camps insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedCamps:", error);
  }
};

module.exports = seedCamps;
