const fs = require("fs");
const path = require("path");
const SpeciesSpecials = require("../../models/sheet/commons/specieSpecials");

const seedSpecies = async () => {
  try {
    // Ruta a la carpeta con todos los archivos JSON
    const dirPath = path.resolve(__dirname, "../../data/species/specials/");

    // Leer todos los archivos en la carpeta
    const files = fs.readdirSync(dirPath);

    // Filtrar solo archivos JSON
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    // Comprobación si no hay archivos JSON
    if (jsonFiles.length === 0) {
      console.log("⚠️ No se encontraron archivos JSON en SpeciesSpecials.");
      return;
    }

    // Limpiar colección
    await SpeciesSpecials.deleteMany({});

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

        // Insertar o actualizar datos en la base de datos
        for (const item of jsonData) {
          await SpeciesSpecials.updateOne(
            { name: item.name }, // Buscar por el nombre
            { $set: item }, // Actualizar todos los campos
            { upsert: true } // Crear el documento si no existe
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
