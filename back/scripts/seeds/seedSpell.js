const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Spell = require("../../models/sheet/combat/Spells");

// Función para recorrer directorios recursivamente
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith(".json")) {
        // Solo archivos JSON
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
};

const seedSpell = async () => {
  try {
    // Ruta base donde están las carpetas y archivos JSON
    const basePath = path.resolve(__dirname, "../../data/combat/spell");

    // Obtener todos los archivos JSON recursivamente
    const allFiles = getAllFiles(basePath);

    // Limpiar la colección antes de insertar
    await Spell.deleteMany({});

    // Insertar cada archivo JSON en la base de datos
    for (const filePath of allFiles) {
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      await Spell.insertMany(jsonData);
    }

    console.log("🚀 Todos los datos han sido insertados exitosamente.");
  } catch (error) {
    console.error("❌ Error en seedSpell:", error);
  }
};

module.exports = seedSpell;
