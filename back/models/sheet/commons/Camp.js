const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema para Specialities
const SpecialitySchema = new Schema({
  name: { type: String, required: true },
  base: { type: Number, default: 0 },
  mod: { type: Number, default: 0 },
  heri: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

// Schema para Skills
const SkillSchema = new Schema({
  name: { type: String, required: true },
  base: { type: Number, default: 0 },
  mod: { type: Number, default: 0 },
  atrib: { type: Number, default: 0 },
  cap: { type: Number, default: 0 },
  race: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  specialities: {
    type: Map,
    of: SpecialitySchema
  }
}, { _id: false });

// Schema principal para Arte
const CampSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  base: { type: Number, default: 0 },
  mod: { type: Number, default: 0 },
  cap: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  race: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  skills: {
    type: Map,
    of: SkillSchema
  }
}, { timestamps: true });

module.exports = mongoose.model('Camp', CampSchema);
