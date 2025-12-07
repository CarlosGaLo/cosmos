const mongoose = require("mongoose");
const { Schema } = mongoose;
const CharacterSchema = require("./Character").schema; // Importamos solo el schema

// Subdocumento: CharacterType
const CharacterTypeSchema = new Schema(
  {
    label: { type: String, default: "" },
    xp: { type: Number, default: 0 },
  },
  { _id: false }
);

// Subdocumento: MetaData
const MetaDataSchema = new Schema(
  {
    freeXP: { type: Number, default: 0 },
    usedXP: { type: Number, default: 0 },
    featXP: { type: Number, default: 0 },
    competencesXP: { type: Number, default: 0 },
    playerName: { type: String, default: "" },
    campCost: { type: Number, default: 0 },
    skillCost: { type: Number, default: 0 },
    specialityCost: { type: Number, default: 0 },
    comments: { type: String, default: "" },
    id: { type: Schema.Types.Mixed, default: null },
    specImagePath: { type: String, default: "" },
    specShieldPath: { type: String, default: "" },
    magicXP: { type: Number, default: 0 },
    martialXP: { type: Number, default: 0 },
    skillCapMultiplier: { type: Number, default: 5 },
    characterType: { type: CharacterTypeSchema, default: () => ({}) },
  },
  { _id: false }
);

// Modelo de la ficha de personaje completa
const CharacterSheetSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // <-- aquí
    metaData: { type: MetaDataSchema, default: () => ({}) },
    character: { type: CharacterSchema, required: true },
    competences: [{ type: Schema.Types.ObjectId, ref: "Competences" }],
    feats: [{ type: Schema.Types.ObjectId, ref: "Feat" }],
    unfeats: [{ type: Schema.Types.ObjectId, ref: "Feat" }],
    languages: [{ type: Schema.Types.ObjectId, ref: "Language" }],
    spells: [{ type: Schema.Types.ObjectId, ref: "Spell" }],
    martials: [{ type: Schema.Types.ObjectId, ref: "Martial" }],
    speed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CharacterSheet",
  CharacterSheetSchema,
  "characterSheets"
);
