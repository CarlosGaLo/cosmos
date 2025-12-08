// models/sheet/userCharacterSheet.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Si necesitas importar Camp schema embebido, ajústalo aquí.
// Suponiendo que tienes models/Camp.js que exporta su schema:
const CampModel = require("../sheet/commons/Camp");
const CampSchema = CampModel.schema;

const RegenSchema = new Schema(
  {
    life: { type: Number, default: 0 },
    mana: { type: Number, default: 0 },
    energy: { type: Number, default: 0 },
  },
  { _id: false }
);

const LangSchema = new Schema(
  {
    languages: { type: [String], default: [] },
  },
  { _id: false }
);

const UserCharacterSchema = new Schema(
  {
    name: { type: String, trim: true, default: "" },
    specie: { type: String, default: null },
    age: { type: Number, default: 0 },
    ageState: {
      type: String,
      enum: ["Niño", "Joven", "Adulto", "Anciano", "none"],
      default: "Adulto",
    },
    sex: { type: String, default: "Masculino" },
    regen: { type: RegenSchema, default: () => ({}) },

    // camp: mapa de camps embebidos
    camp: {
      type: Map,
      of: CampSchema,
      default: {},
    },

    lang: { type: LangSchema, default: () => ({}) },

    // owner: referencia a User (solo ObjectId)
    owner: { type: Schema.Types.ObjectId, ref: "User"},

    extras: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports =
  mongoose.models.UserCharacter ||
  mongoose.model("UserCharacter", UserCharacterSchema);
