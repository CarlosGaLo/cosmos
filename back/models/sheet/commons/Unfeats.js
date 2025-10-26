const mongoose = require("mongoose");

const unfeatsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // ✅ Elimina espacios innecesarios en los nombres
    unique: true, // ✅ Evita nombres repetidos
  },
  xp: {
    type: Number,
    default: null, // ✅ Permite valores nulos como en el JSON
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
    default: "Sin descripción.",
  },
  resume: {
    type: String,
    trim: true,
    default: "Sin resumen.",
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

module.exports = mongoose.model("Unfeats", unfeatsSchema);
