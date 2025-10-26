const mongoose = require("mongoose");
const { Schema } = mongoose;

// Importar el enumerado de idiomas
const { LANGUAGES } = require("../../../config/enum");

const LanguageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: LANGUAGES, // Se utiliza el enum para validar los idiomas
    },
    proficiency: {
      type: String,
      enum: ["Básico", "Intermedio", "Avanzado", "Nativo"],
      default: "Básico",
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Languages || mongoose.model("Languages", LanguageSchema);
