// seeds/seedUnfeat.js
const fs = require("fs");
const path = require("path");
const Unfeat = require("../../models/sheet/commons/Unfeats");

const seedUnfeat = async () => {
  try {
    await Unfeat.deleteMany();

    const unfeatFilePath = path.join(
      __dirname,
      "../../data/commons/unfeat.json"
    );
    const unfeatData = JSON.parse(fs.readFileSync(unfeatFilePath, "utf8"));

    await Unfeat.insertMany(unfeatData);
    console.log("Seed de Unfeat completado.");
  } catch (err) {
    console.error("Error al hacer seed de Unfeat:", err);
  }
};

module.exports = seedUnfeat;
