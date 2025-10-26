const mongoose = require("mongoose");

const featsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // ✅ Elimina espacios en blanco
    unique: true, // ✅ Evita nombres duplicados
  },
  xp: {
    type: Number,
    default: 0, // ✅ Permite valores nulos
  },
  requisites: {
    type: [
      {
        name: { type: String, trim: true }, // ✅ Nombre del requisito
        value: { type: Number, default: 0 }, // ✅ Valor del requisito
      },
    ],
    default: [],
  },
  description: {
    type: String,
    trim: true,
    default: "Sin descripción.", // ✅ Valor predeterminado si está vacío
  },
  resume: {
    type: String,
    trim: true,
    default: "Sin resumen.", // ✅ Valor predeterminado si está vacío
  },
  isAdquired: {
    type: Boolean,
    default: false, // ✅ Valor predeterminado para evitar undefined
  },
  group: {
    type: String,
    trim: true,
    default: "general", // ✅ Grupo predeterminado si no se especifica
  },
});

module.exports = mongoose.model("Feats", featsSchema);
