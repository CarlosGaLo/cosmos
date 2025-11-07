// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const https = require("https");
const http = require("http");
const fs = require("fs");
require("dotenv").config();
require("./models/registerModels");

// Config
const app = express();
const PORT = process.env.PORT || 3100;
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HOST = "0.0.0.0";

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

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/cosmos-rol", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Verify db connection
mongoose.connection.on("connected", () => {
  console.log("✅ Conexión a MongoDB establecida");
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3110",
  "http://79.145.123.81:3110",
  "https://79.145.123.81:3100",
  "http://cosmosrol.com",
  "https://cosmosrol.com",
  "http://www.cosmosrol.com",
  "https://www.cosmosrol.com",
  "https://cosmos-rol-front.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("⚠️ Origen no permitido por CORS:", origin);
        callback(null, true); // Permitir de todos modos para testing
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Rutas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use("/api/character-sheets", characterSheetRoutes);

// Configuración SSL/HTTPS
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

// Iniciar servidor HTTPS
https.createServer(sslOptions, app).listen(PORT, HOST, () => {
  console.log(`🔒 Servidor HTTPS escuchando en https://${HOST}:${PORT}`);
  console.log(`🌍 Acceso externo: https://79.145.123.81:${PORT}`);
  console.log(`🌐 Dominio: https://cosmosrol.com:${PORT}`);
});

// Iniciar servidor HTTP (para redireccionar a HTTPS)
http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host.split(":")[0]}:${PORT}${req.url}`,
    });
    res.end();
  })
  .listen(HTTP_PORT, HOST, () => {
    console.log(
      `↗️  Servidor HTTP redirigiendo en http://${HOST}:${HTTP_PORT} → HTTPS:${PORT}`
    );
  });
