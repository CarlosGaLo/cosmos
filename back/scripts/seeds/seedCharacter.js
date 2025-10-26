const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Types } = mongoose;

// Importar modelos
const Character = require("../../models/sheet/Character");
const Species = require("../../models/sheet/commons/Specie");
const Camp = require("../../models/sheet/commons/Camp");
const Language = require("../../models/sheet/commons/Language");

const seedCharacter = async () => {
  try {
    // Ruta al archivo JSON
    const filePath = path.resolve(__dirname, "../../data/character.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Reemplazar los nombres por ObjectId reales
    for (const character of jsonData) {
      // Verificar y convertir specie a ObjectId
      if (character.specie) {
        const specieExists = await Species.findOne({ name: character.specie });
        if (!specieExists) {
          console.error(
            `❌ Specie con nombre "${character.specie}" no existe en la BD.`
          );
          return;
        }
        character.specie = specieExists._id;

        // Verificar si la especie es Humano
        character.isHuman = specieExists.name.toLowerCase() === "humano";
      }

      // Verificar y convertir camps a ObjectId
      const campCategories = ["art", "cul", "mov", "sob", "sup", "vig"];
      for (const category of campCategories) {
        if (character.camp[category]) {
          const campExists = await Camp.findOne({
            name: character.camp[category],
          });
          if (!campExists) {
            console.error(
              `❌ Camp con nombre "${character.camp[category]}" no existe en la BD.`
            );
            return;
          }
          character.camp[category] = campExists._id;

          // Agregar el valor total de vigor para calcular regen
          if (category === "vig") {
            character.vigTotal = campExists.total;
          }
        }
      }

      // Verificar y convertir languages a ObjectId
      if (character.lang && character.lang.languages) {
        character.lang.languages = await Promise.all(
          character.lang.languages.map(async (langName) => {
            const languageExists = await Language.findOne({ name: langName });
            if (!languageExists) {
              console.error(
                `❌ Language con nombre "${langName}" no existe en la BD.`
              );
              return;
            }
            return languageExists._id;
          })
        );
      }

      // 🧠 Calcular Regen según reglas:
      // life: vigor.total (+1 si la raza es humano)
      // mana: vigor.total (+1 si la raza es humano)
      // energy: vigor.total (+1 si la raza es humano)
      const bonus = character.isHuman ? 1 : 0;
      character.regen = {
        life: character.vigTotal + bonus,
        mana: character.vigTotal + bonus,
        energy: character.vigTotal + bonus,
      };
    }

    // Limpiar colección
    await Character.deleteMany({});

    // Insertar datos en la base de datos
    await Character.insertMany(jsonData);
    console.log("✅ Datos de Characters insertados exitosamente");
  } catch (error) {
    console.error("❌ Error en seedCharacter:", error);
  }
};

module.exports = seedCharacter;
