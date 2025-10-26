const mongoose = require("mongoose");

const CreatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  habitat: {
    type: [String],
    required: true,
    default: [],
  },
  bodyParts: {
    type: [
      {
        part: { type: String, required: true, trim: true },
        hp: { type: Number, required: true, min: 0 },
        abilities: [
          {
            name: { type: String, required: true, trim: true },
            description: { type: String, required: true, trim: true },
            effect: { type: String, required: true, trim: true },
          },
        ],
      },
    ],
    required: false,
    default: [],
  },
  camps: {
    type: [
      {
        name: { type: String, required: true, trim: true },
        total: { type: Number, required: true },
      },
    ],
    required: false,
    default: [],
  },
  turn: {
    type: Number,
    default: 0,
    required: false,
  },
  damage: {
    type: mongoose.Schema.Types.Mixed, // Puede ser número o string
    default: 0,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const Creature = mongoose.model("Creature", CreatureSchema);
module.exports = Creature;
