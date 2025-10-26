const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definición del Schema para SpeciesSpecials
const SpeciesSpecialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    effect: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    requisites: {
      type: [String],
      default: [],
    },
    specie: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Crear y exportar el modelo
module.exports = mongoose.model(
  "SpeciesSpecial",
  SpeciesSpecialSchema,
  "speciesSpecial"
);
