const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Types } = mongoose;

// Importar modelos
const Species = require("../../models/sheet/commons/Specie");
const SpeciesSpecial = require("../../models/sheet/commons/specieSpecials");
const Camp = require("../../models/sheet/commons/Camp");

const seedSpecies = async () => {
  try {
    // Ruta a la carpeta con todos los archivos JSON
    const dirPath = path.resolve(__dirname, "../../data/species/");

    // Leer todos los archivos en la carpeta
    const files = fs.readdirSync(dirPath);

    // Filtrar solo archivos JSON
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // Comprobación si no hay archivos JSON
    if (jsonFiles.length === 0) {
      console.log("⚠️ No se encontraron archivos JSON en species.");
      return;
    }

    // Limpiar colección
    await Species.deleteMany({});

    // Leer y procesar cada archivo JSON
    for (const file of jsonFiles) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      try {
        // Convertir JSON a objeto de JS
        const jsonData = JSON.parse(fileContent);

        // Validar que sea un array
        if (!Array.isArray(jsonData)) {
          console.error(
            `❌ El archivo ${file} no contiene un array de objetos`
          );
          continue;
        }

        // Procesar cada especie
        for (const item of jsonData) {
          // 1. Buscar specieSpecial (ahora es un array)
          if (item.specieSpecial && Array.isArray(item.specieSpecial)) {
            const specieSpecialIds = await Promise.all(
              item.specieSpecial.map(async (specialName) => {
                const specialDoc = await SpeciesSpecial.findOne({
                  name: specialName,
                });
                if (!specialDoc) {
                  console.error(
                    `❌ SpecieSpecial "${specialName}" no encontrado en la BD.`
                  );
                  return null; // Retorna null si no se encuentra
                }
                return new Types.ObjectId(specialDoc._id);
              })
            );

            // Filtrar nulos y asignar
            item.specieSpecial = specieSpecialIds.filter((id) => id !== null);

            // Verificar que todos se hayan encontrado
            if (item.specieSpecial.length !== item.specieSpecial.length) {
              console.error(
                `⚠️ Algunos SpecieSpecial no se encontraron para "${item.name}". Saltando este ítem.`
              );
              continue;
            }
          }

          // 2. Buscar y convertir camps usando "code"
          if (item.camp && Array.isArray(item.camp)) {
            const campIds = await Promise.all(
              item.camp.map(async (campCode) => {
                const campDoc = await Camp.findOne({ code: campCode });
                if (!campDoc) {
                  console.error(
                    `❌ Camp con code "${campCode}" no encontrado en la BD.`
                  );
                  return null;
                }
                return new Types.ObjectId(campDoc._id);
              })
            );
            // Filtrar nulos y asignar
            item.camp = campIds.filter((id) => id !== null);

            // Verificar que todos se hayan encontrado
            if (item.camp.length !== item.camp.length) {
              console.error(
                `⚠️ Algunos Camps no se encontraron para "${item.name}". Saltando este ítem.`
              );
              continue;
            }
          }

          // 3. Insertar o actualizar la especie
          await Species.updateOne(
            { name: item.name }, // Buscar por nombre
            { $set: item }, // Actualizar todos los campos
            { upsert: true } // Crear si no existe
          );
        }
        console.log(
          `✅ Datos insertados o actualizados exitosamente desde ${file}`
        );
      } catch (error) {
        console.error(`❌ Error al procesar ${file}:`, error);
      }
    }
  } catch (error) {
    console.error("❌ Error en seedSpecies:", error);
  }
};

module.exports = seedSpecies;
