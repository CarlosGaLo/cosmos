const mongoose = require("mongoose");
const { Schema } = mongoose;

// Subdocumento para Regen
const RegenSchema = new Schema(
  {
    life: {
      type: Number,
      required: true,
      min: 0,
    },
    mana: {
      type: Number,
      required: true,
      min: 0,
    },
    energy: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Subdocumento para Camp
const CampSchema = new Schema(
  {
    art: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    cul: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    mov: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    sob: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    sup: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
    vig: {
      type: Schema.Types.ObjectId,
      ref: "Camp",
      required: true,
    },
  },
  { _id: false }
);

// Subdocumento para Lang
const LangSchema = new Schema(
  {
    languages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Language",
        required: true,
      },
    ],
  },
  { _id: false }
);

// Definición del Schema para Character
const CharacterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specie: {
      type: Schema.Types.ObjectId,
      ref: "Specie", // ✔ este es el nombre del modelo registrado
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    ageState: {
      type: String,
      enum: ["Joven", "Adulto", "Anciano", "none"],
      default: "Adulto",
    },
    sex: {
      type: String,
      enum: ["Masculino", "Femenino", "Otro", "masculino", "femenino", "otro"],
      default: "Masculino",
    },
    regen: {
      type: RegenSchema,
      required: true,
    },
    camp: {
      type: CampSchema,
      required: true,
    },
    lang: {
      type: LangSchema,
      required: true,
    },
  },
  { timestamps: true }
);

// Crear y exportar el modelo
module.exports = mongoose.model("Character", CharacterSchema, "characters");
