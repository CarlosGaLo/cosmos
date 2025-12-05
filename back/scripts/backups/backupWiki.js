const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const WikiArticle = require("../../models/info/WikiArticle.js"); // ajusta ruta

async function backupWiki() {
  try {
    const outputDir = process.argv[2] || __dirname; // <--- carpeta de salida
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cosmos-rol";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB");

    const articles = await WikiArticle.find().lean();
    console.log(`Artículos encontrados: ${articles.length}`);

    const date = new Date();
    const fecha = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(date.getDate()).padStart(2, "0")}`;
    const filename = path.join(outputDir, `wiki-${fecha}.json`);

    fs.writeFileSync(filename, JSON.stringify(articles, null, 2), "utf-8");
    console.log(`Backup guardado en ${filename}`);

    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.error("Error creando backup:", error);
    process.exit(1);
  }
}

backupWiki();
