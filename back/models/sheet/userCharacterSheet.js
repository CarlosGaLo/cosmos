// models/sheet/userCharacterSheet.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const MetaDataSchema = new Schema(
  {
    freeXP: { type: Number, default: 0 },
    usedXP: { type: Number, default: 0 },
    featXP: { type: Number, default: 0 },
    competencesXP: { type: Number, default: 0 },
    magicXP: { type: [Schema.Types.Mixed], default: [] }, // array flexible
    martialXP: { type: Schema.Types.Mixed, default: 0 }, // puede ser número o array según tu frontend
    playerName: { type: String, default: "" },
    campCost: { type: Number, default: 100 },
    purchasedMagicSpecialties: { type: [String], default: [] },
    maxMagicSpecialties: { type: Number, default: 0 },
    skillCost: { type: Number, default: 30 },
    specialityCost: { type: Number, default: 10 },
    comments: { type: String, default: "" },
    id: { type: Schema.Types.Mixed, default: null }, // si pasáis un id externo
    specImagePath: { type: String, default: "" },
    specShieldPath: { type: String, default: "" },
    unfeatXP: { type: Number, default: 0 },
    skillCapMultiplier: { type: Number, default: 5 },
    allowNegativeXP: { type: Boolean, default: false },
    martialXPList: { type: [Schema.Types.Mixed], default: [] }, 
    characterType: {
      label: { type: String, default: "" },
      xp: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const UserCharacterSchema = new Schema(
  {
    // BASIC CHARACTER
    name: { type: String, trim: true, default: "" },
    specie: { type: String, default: null },
    specieState: { type: String, default: "" }, // humano, kordun, etc
    age: { type: Number, default: 0 },
    ageState: {
      type: String,
      enum: ["Niño", "Joven", "Adulto", "Anciano", "none"],
      default: "Adulto",
    },
    sex: { type: String, default: "Masculino" },

    regen: { type: RegenSchema, default: () => ({}) },

    camp: {
      type: Map,
      of: CampSchema,
      default: {},
    },

    lang: { type: LangSchema, default: () => ({}) },
    
    metaData: { type: MetaDataSchema, default: () => ({}) },

    competences: { type: [Schema.Types.Mixed], default: [] }, 
    feats: { type: [Schema.Types.Mixed], default: [] },
    unfeats: { type: [Schema.Types.Mixed], default: [] },
    zonaAfin: { type: [Schema.Types.Mixed], default: [] }, // si son strings puedes cambiar a [String]
    languages: { type: [String], default: [] }, // el array top-level que tienes aparte de lang.languages
    spells: { type: [Schema.Types.Mixed], default: [] },
    martials: { type: [Schema.Types.Mixed], default: [] },
    
    speed: { type: Number, default: 0 },
    
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    
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
