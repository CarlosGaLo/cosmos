// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
require("./models/registerModels");

// Config
const app = express();
const HTTPS_PORT = process.env.HTTPS_PORT || 3100;
const HOST = "0.0.0.0";

// Importar rutas
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

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de conexión a MongoDB:", err);
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3110",
  "https://localhost:3110",
  "http://79.145.123.81:3110",
  "https://79.145.123.81:3110",
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
      if (!origin) {
        console.log("✅ Petición sin origin permitida (Postman/curl)");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origen permitido:", origin);
        callback(null, true);
      } else {
        console.log("⚠️ Origen no en whitelist (permitido):", origin);
        callback(null, true); // Permitir de todos modos
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url} - Origin: ${req.headers.origin || "No origin"}`);
  next();
});

// Body parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Cosmos Rol API Server - HTTPS",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    endpoints: {
      articles: "/api/articles",
      feats: "/api/feats",
      unfeats: "/api/unfeats",
      competences: "/api/competences",
      martials: "/api/martials",
      spells: "/api/spells",
      rules: "/api/rules",
      characters: "/api/characters",
      languages: "/api/languages",
      creatures: "/api/creatures",
      auth: "/api/auth",
      user: "/api/user",
      characterSheets: "/api/character-sheets",
    },
  });
});

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "API Root",
    version: "2.0.0",
    protocol: "HTTPS",
  });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: process.env.NODE_ENV === "development" ? err.message : "Error interno",
  });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 - Endpoint no encontrado:", req.url);
  res.status(404).json({
    error: "Endpoint no encontrado",
    path: req.url,
    availableEndpoints: ["/", "/api", "/api/languages"],
  });
});

// Configuración SSL/HTTPS
const certPath = path.join(__dirname, "server.cert");
const keyPath = path.join(__dirname, "server.key");

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error("❌ FALTA: server.cert o server.key");
  console.error("📝 Generar con:");
  console.error('   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.cert');
  process.exit(1);
}

const sslOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  // Permitir conexiones sin verificación estricta (desarrollo)
  requestCert: false,
  rejectUnauthorized: false,
};

// Iniciar servidor HTTPS
const server = https.createServer(sslOptions, app);

server.listen(HTTPS_PORT, HOST, () => {
  console.log("\n" + "=".repeat(60));
  console.log("🔒 SERVIDOR HTTPS INICIADO");
  console.log("=".repeat(60));
  console.log(`📍 Host: ${HOST}`);
  console.log(`🔌 Puerto: ${HTTPS_PORT}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log("\n📡 URLs de acceso:");
  console.log(`   - Local:     https://localhost:${HTTPS_PORT}`);
  console.log(`   - Red local: https://79.145.123.81:${HTTPS_PORT}`);
  console.log(`   - Dominio:   https://cosmosrol.com:${HTTPS_PORT}`);
  console.log("\n🧪 Tests:");
  console.log(`   curl -k https://localhost:${HTTPS_PORT}/`);
  console.log(`   curl -k https://localhost:${HTTPS_PORT}/api/languages`);
  console.log(`   curl -k https://79.145.123.81:${HTTPS_PORT}/api/languages`);
  console.log("\n⚠️  Nota: Usa -k con curl para ignorar el certificado autofirmado");
  console.log("=".repeat(60) + "\n");
});

server.on("error", (error) => {
  console.error("❌ Error al iniciar el servidor:", error);
  if (error.code === "EADDRINUSE") {
    console.error(`⚠️  El puerto ${HTTPS_PORT} ya está en uso`);
  }
  process.exit(1);
});

// Manejo de señales de terminación
process.on("SIGTERM", () => {
  console.log("📴 Señal SIGTERM recibida. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente");
    mongoose.connection.close(false, () => {
      console.log("✅ Conexión MongoDB cerrada");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("\n📴 Señal SIGINT recibida. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado correctamente");
    mongoose.connection.close(false, () => {
      console.log("✅ Conexión MongoDB cerrada");
      process.exit(0);
    });
  });
});