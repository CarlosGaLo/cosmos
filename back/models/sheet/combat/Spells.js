const mongoose = require("mongoose");

const spellsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lvl: {
    type: Number,
    required: false,
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
    type: Array,
    required: false,
  },
  manaCost: {
    type: Number,
    required: false,
  },
  threshold: {
    type: Number,
    required: false,
  },
  isAdquired: {
    type: Boolean,
    required: false,
  },
  challenge: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Spells", spellsSchema);
