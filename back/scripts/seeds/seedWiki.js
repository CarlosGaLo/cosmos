const mongoose = require("mongoose");
const WikiArticle = require("../../models/info/WikiArticle");
const articlesData = require("../../data/info/wiki.json");

const seedWikiArticles = async () => {
  try {
    // 🗑️ Elimina todos los artículos antes de insertar los nuevos
    await WikiArticle.deleteMany();

    // 🔄 Limpiar _id para evitar conflictos
    const cleanData = articlesData.map(article => {
      const { _id, ...rest } = article;
      return rest;
    });

    // Insertar todos los artículos
    await WikiArticle.insertMany(cleanData);

    console.log("✅ Artículos de wiki inicializados en la BD.");
  } catch (error) {
    console.error("❌ Error al ejecutar seeds de wiki:", error);
  }
};

// Para ejecutarlo directamente desde Node
if (require.main === module) {
  mongoose.connect("mongodb://localhost:27017/cosmos-rol", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("🔌 Conectado a MongoDB");
    await seedWikiArticles();
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ Error de conexión a MongoDB:", err));
}

module.exports = seedWikiArticles;
