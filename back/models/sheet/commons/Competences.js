const mongoose = require("mongoose");

const competencesSchema = new mongoose.Schema({
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
    required: false,
  },
  multiple: {
    type: Boolean,
    required: false,
  },
  isAdquired: {
    type: Boolean,
    required: false,
  },
});

module.exports = mongoose.model("Competences", competencesSchema);
