const mongoose = require("mongoose");
const Language = require("../../models/sheet/commons/language");
const { LANGUAGES, LANGUAGE_DESCRIPTIONS } = require("../../config/enum");

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/cosmos-rol", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedLanguages = async () => {
  try {
    console.log("🌱 Iniciando seed de idiomas...");

    // Limpiar colección existente
    await Language.deleteMany({});
    console.log("🗑️  Idiomas anteriores eliminados");

    // Crear idiomas
    const languagesToInsert = LANGUAGES.map((name) => ({
      name,
      description: LANGUAGE_DESCRIPTIONS[name] || "Sin descripción disponible",
      proficiency: "Básico",
    }));

    const insertedLanguages = await Language.insertMany(languagesToInsert);

    console.log(
      `✅ ${insertedLanguages.length} idiomas insertados correctamente`
    );
    console.log("📋 Idiomas creados:");
    insertedLanguages.forEach((lang) => {
      console.log(`   - ${lang.name} (ID: ${lang._id})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en seed de idiomas:", error);
    process.exit(1);
  }
};

seedLanguages();
