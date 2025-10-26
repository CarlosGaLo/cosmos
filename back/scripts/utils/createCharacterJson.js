const fs = require("fs");
const path = require("path");

// Importar modelos
const Species = require("../../models/sheet/commons/Specie");
const Camp = require("../../models/sheet/commons/Camp");
const Language = require("../../models/sheet/commons/Language");

// Función para crear el character.json dinámicamente
const createCharacterJson = async () => {
  try {
    console.log("🚀 Iniciando creación de character.json...");

    // Obtener un Specie aleatorio
    const specie = await Species.aggregate([{ $sample: { size: 1 } }]);
    if (specie.length === 0) {
      console.error("❌ No se encontraron Species en la BD.");
      return;
    }

    // Obtener un Camp para cada categoría
    const camps = {};
    const campCategories = ["art", "cul", "mov", "sob", "sup", "vig"];
    for (const category of campCategories) {
      const camp = await Camp.aggregate([{ $sample: { size: 1 } }]);
      if (camp.length > 0) {
        camps[category] = camp[0]._id;
      } else {
        console.error(`❌ No se encontraron Camps para ${category}`);
        return;
      }
    }

    // Obtener uno o más Languages aleatorios
    const languages = await Language.aggregate([{ $sample: { size: 2 } }]);
    if (languages.length === 0) {
      console.error("❌ No se encontraron Languages en la BD.");
      return;
    }
    const languageIds = languages.map((lang) => lang._id);

    // Crear el objeto de personaje
    const character = {
      name: "Thalion",
      specie: specie[0]._id,
      age: 120,
      ageState: "Adulto",
      sex: "Masculino",
      regen: {
        life: 100,
        mana: 50,
        energy: 80,
      },
      camp: camps,
      lang: {
        languages: languageIds,
      },
    };

    // Crear la carpeta si no existe
    const dirPath = path.resolve(__dirname, "../data/characters");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Escribir el JSON en el archivo
    const filePath = path.join(dirPath, "character.json");
    fs.writeFileSync(filePath, JSON.stringify([character], null, 2));
    console.log("✅ character.json creado exitosamente:", filePath);
  } catch (error) {
    console.error("❌ Error al crear character.json:", error);
  }
};

// Exportar la función para ser utilizada en seedDB.js
module.exports = createCharacterJson;
