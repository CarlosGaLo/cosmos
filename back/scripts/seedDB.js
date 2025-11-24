require("dotenv").config();
const mongoose = require("mongoose");

// Seeds
const seedRules = require("./seeds/seedRules");
const seedCamps = require("./seeds/seedCamp");
const seedSpells = require("./seeds/seedSpell");
const seedMartials = require("./seeds/seedMartial");
const seedCompetences = require("./seeds/seedCompetence");
const seedSpecies = require("./seeds/seedSpecie");
const seedSpecialSpecies = require("./seeds/seedSpecialSpecie");
const seedLanguages = require("./seeds/seedLanguages");
const seedCharacter = require("./seeds/seedCharacter");
const seedFeats = require("./seeds/seedFeat");
const seedUnfeats = require("./seeds/seedUnfeat");
const seedCreatures = require("./seeds/seedCreature");

// Script para generar character.json
const createCharacterJson = require("./utils/createCharacterJson");

// Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    runSeeds();
  })
  .catch((err) => console.error("❌ Error de conexión:", err));

// Ejecutar todos los seeds en secuencia
const runSeeds = async () => {
  try {
    console.log("🚀 Iniciando Seeds...");

    console.log("🔹 Cargando reglas...");
    await seedRules();

    console.log("🔹 Cargando campos...");
    await seedCamps();

    console.log("🔹 Cargando hechizos...");
    await seedSpells();

    console.log("🔹 Cargando habilidades marciales...");
    await seedMartials();

    console.log("🔹 Cargando competencias...");
    await seedCompetences();

    console.log("🔹 Cargando especies especiales...");
    await seedSpecialSpecies();

    console.log("🔹 Cargando especies...");
    await seedSpecies();

    console.log("🔹 Cargando idiomas...");
    await seedLanguages();

    console.log("🔹 Generando character.json...");
    await createCharacterJson();

    console.log("🔹 Cargando personajes...");
    await seedCharacter();

    console.log("🔹 Cargando méritos...");
    await seedFeats();

    console.log("🔹 Cargando defectos...");
    await seedUnfeats();

    console.log("🔹 Cargando criaturas...")
    await seedCreatures();

    console.log("✅ Todas las seeds han sido insertadas con éxito.");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al ejecutar seeds:", error);
    mongoose.connection.close();
  }
};
