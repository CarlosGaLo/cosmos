require("dotenv").config();
const mongoose = require("mongoose");

// Probar conexión
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado correctamente a MongoDB");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("❌ Error de conexión a MongoDB:", error);
    process.exit(1);
  });
