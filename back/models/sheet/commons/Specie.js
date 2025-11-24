const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

// Definición del Schema para Specie
const SpecieSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Nombre único para evitar duplicados
    },
    specieSpecial: [
      {
        type: Types.ObjectId,
        ref: "SpeciesSpecial", // Referencia al modelo SpecieSpecial
        required: false,
      },
    ],
    camp: [
      {
        type: Types.ObjectId,
        ref: "Camp", // Referencia al modelo Camp
        required: false,
      },
    ],
  },
  { timestamps: true }
);

// Crear y exportar el modelo
module.exports = mongoose.model("Specie", SpecieSchema, "species");
