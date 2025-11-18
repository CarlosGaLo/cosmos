const mongoose = require("mongoose");
const { Schema } = mongoose;

// Importar el enumerado de idiomas
const { LANGUAGES } = require("../../../config/enum");

const LanguageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: LANGUAGES,
    },
    proficiency: {
      type: String,
      enum: ["Básico", "Intermedio", "Avanzado", "Nativo"],
      default: "Básico",
    },
    description: {
      type: String,
      required: false, // ✅ CAMBIADO: No obligatorio
      default: "Sin descripción disponible",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Languages || mongoose.model("Languages", LanguageSchema);
