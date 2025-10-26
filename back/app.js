// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./models/registerModels");

// Config
const app = express();
const PORT = process.env.PORT || 3000;

const articlesRouter = require("./routes/Articles.js");
const featsRouter = require("./routes/Feats.js");
const unfeatsRouter = require("./routes/Unfeats.js");
const martialsRouter = require("./routes/Martials.js");
const competencesRouter = require("./routes/Competences.js");
const spellsRouter = require("./routes/Spells.js");
const rulesRoutes = require("./routes/rulesRoutes");
const characterRoutes = require("./routes/characters.js");
const languageRoutes = require("./routes/languages");
const creatureRoutes = require("./routes/Creatures.js");
const characterSheetRoutes = require("./routes/characterSheet.js");

// Auth
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user");

// Conect
mongoose.connect("mongodb://localhost:27017/cosmos-rol", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verify db conection
mongoose.connection.on("connected", () => {
  console.log("Conexión a MongoDB establecida");
});

// Allow All CORS
app.use(cors());

// Aumenta el límite de tamaño de JSON a 50mb
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Rutas
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 📌 Habilita acceso a imágenes
app.use("/api/articles", articlesRouter);
app.use("/api/feats", featsRouter);
app.use("/api/unfeats", unfeatsRouter);
app.use("/api/competences", competencesRouter);
app.use("/api/martials", martialsRouter);
app.use("/api/spells", spellsRouter);
app.use("/api/rules", rulesRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/creatures", creatureRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/character-sheets", characterSheetRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
