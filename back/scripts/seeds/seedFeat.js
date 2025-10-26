// seeds/seedFeat.js
const fs = require("fs");
const path = require("path");
const Feat = require("../../models/sheet/commons/Feats");

const seedFeat = async () => {
  try {
    await Feat.deleteMany();

    const featFilePath = path.join(__dirname, "../../data/commons/feat.json");
    const featData = JSON.parse(fs.readFileSync(featFilePath, "utf8"));

    await Feat.insertMany(featData);
    console.log("Seed de Feat completado.");
  } catch (err) {
    console.error("Error al hacer seed de Feat:", err);
  }
};

module.exports = seedFeat;
