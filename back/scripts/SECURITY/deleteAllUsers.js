// /scripts/deleteAllUsers.js

const mongoose = require("mongoose");
const User = require("../../models/users/User");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cosmos-rol";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("📡 Conexión establecida con MongoDB");

  try {
    const result = await User.deleteMany({});
    console.log(`✅ Usuarios eliminados || Usuarios restantes: ${result.deletedCount}`);
  } catch (err) {
    console.error("❌ Error al eliminar usuarios:", err);
  } finally {
    mongoose.connection.close();
  }
});
