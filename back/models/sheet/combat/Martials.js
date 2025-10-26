const mongoose = require("mongoose");

const { MARTIALTYPE } = require("../../../config/enum");

const martialsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    required: false,
  },
  requisites: {
    type: Array,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  resume: {
    type: String,
    required: false,
  },
  group: {
    type: String,
    required: true,
    enum: MARTIALTYPE, // Se utiliza el enum para validar los types
  },
  isAdquired: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("Martials", martialsSchema);
