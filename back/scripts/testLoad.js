require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Art = require("../models/sheet/commons/Camp.js"); // Este es el modelo

// Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    initializeData();
  })
  .catch((err) => console.error("❌ Error de conexión:", err));

// Función para inicializar datos
const initializeData = async () => {
  try {
    // Leer archivo JSON
    const filePath = path.resolve(__dirname, "../data/commons/camp.json");
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Verificar que los datos son un array
    if (!Array.isArray(jsonData)) {
      console.error("❌ Los datos no son un array");
      return;
    }

    // Limpiar colección
    await Art.deleteMany({});
    console.log('🧹 Colección "camps" limpiada');

    // Insertar datos
    await Art.insertMany(jsonData);
    console.log("✅ Datos insertados exitosamente");

    // Cerrar conexión
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al inicializar datos:", error);
  }
};
