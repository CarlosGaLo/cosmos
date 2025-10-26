// utils/normalizeCharacterSheet.js
const Spell = require("../../models/sheet/combat/Spells");
const Language = require("../../models/sheet/commons/Language");
const Feat = require("../../models/sheet/commons/Feats");
const Competence = require("../../models/sheet/commons/Competences");
const Martial = require("../../models/sheet/combat/Martials");
const Species = require("../../models/sheet/commons/Specie");
const Character = require("../../models/sheet/Character");
const Camp = require("../../models/sheet/commons/Camp");
const mongoose = require("mongoose");

async function getOrCreateDocuments(Model, array, uniqueField = "name") {
  const ids = [];
  for (const item of array) {
    if (!item || !item[uniqueField]) continue;
    const query = {};
    query[uniqueField] = item[uniqueField];

    let doc = await Model.findOne(query);
    if (!doc) {
      doc = new Model(item);
      await doc.save();
    }
    ids.push(doc._id);
  }
  return ids;
}

async function resolveCampObject(campObj) {
  if (!campObj?.code) throw new Error("Camp object must have a 'code' field");

  let existing = await Camp.findOne({ code: campObj.code });
  if (existing) return existing._id;

  const newCamp = new Camp(campObj);
  await newCamp.save();
  return newCamp._id;
}

async function normalizeCharacterSheet(rawData) {
  console.log(rawData);
  const normalized = { ...rawData };
  const meta = normalized.metaData || {};

  // Si llega como array, sumamos los totales
  if (Array.isArray(meta.magicXP)) {
    meta.magicXP = meta.magicXP.reduce((acc, m) => acc + (m.total || 0), 0);
  } else if (typeof meta.magicXP !== "number") {
    meta.magicXP = Number(meta.magicXP) || 0;
  }

  // Si llega como objeto, extraemos el total
  if (meta.martialXP && typeof meta.martialXP === "object") {
    meta.martialXP = meta.martialXP.total || 0;
  } else if (typeof meta.martialXP !== "number") {
    meta.martialXP = Number(meta.martialXP) || 0;
  }

  normalized.metaData = {
    ...meta,
    magicXP: meta.magicXP,
    martialXP: meta.martialXP,
  };

  // 🔹 Character
  let characterData = normalized.character;
  if (!characterData) throw new Error("character object is required");

  // 1️⃣ Specie → convertir a ObjectId
  const specieDoc = await Species.findOne({
    name: { $regex: `^${characterData.specie}$`, $options: "i" },
  });
  if (!specieDoc)
    throw new Error(`Specie "${characterData.specie}" not found in DB.`);
  characterData.specie = specieDoc._id;

  // 2️⃣ Languages (array de strings → ObjectId[])
  if (characterData.lang?.languages?.length) {
    characterData.lang.languages = await Promise.all(
      characterData.lang.languages.map(async (lang) => {
        const existingLang = await Language.findOne({ name: lang });
        if (existingLang) return existingLang._id;

        const newLang = await new Language({ name: lang }).save();
        return newLang._id;
      })
    );
  }

  // 3️⃣ Resolver campos de Camp (art, cul, mov, sob, sup, vig)
  const campFields = ["art", "cul", "mov", "sob", "sup", "vig"];
  if (!characterData.camp) throw new Error("Missing camp data in character");
  for (const field of campFields) {
    if (characterData.camp[field]) {
      characterData.camp[field] = await resolveCampObject(
        characterData.camp[field]
      );
    } else {
      throw new Error(`Missing camp field: "${field}" in character`);
    }
  }

  // 4️⃣ Crear Character anidado (como subdocumento limpio, no guardar como modelo aparte)
  normalized.character = {
    name: characterData.name || "Sin Nombre",
    specie: characterData.specie,
    age: Number(characterData.age) || 0,
    ageState: characterData.ageState || "Adulto",
    sex: characterData.sex || "Masculino",
    regen: characterData.regen || { life: 0, mana: 0, energy: 0 },
    camp: characterData.camp,
    lang: characterData.lang || { languages: [] },
  };

  // 🔹 Competences
  if (normalized.competences?.length) {
    normalized.competences = await getOrCreateDocuments(
      Competence,
      normalized.competences,
      "name"
    );
  }

  // 🔹 Feats
  if (normalized.feats?.length) {
    normalized.feats = await getOrCreateDocuments(
      Feat,
      normalized.feats,
      "name"
    );
  }

  // 🔹 Unfeats
  if (normalized.unfeats?.length) {
    normalized.unfeats = await getOrCreateDocuments(
      Feat,
      normalized.unfeats,
      "name"
    );
  }

  // 🔹 Languages (metadata level)
  if (normalized.languages?.length) {
    normalized.languages = await getOrCreateDocuments(
      Language,
      normalized.languages,
      "name"
    );
  }

  // 🔹 Spells
  if (normalized.spells?.length) {
    normalized.spells = await getOrCreateDocuments(
      Spell,
      normalized.spells,
      "name"
    );
  }

  // 🔹 Martials
  if (normalized.martials?.length) {
    normalized.martials = await getOrCreateDocuments(
      Martial,
      normalized.martials,
      "name"
    );
  }

  return normalized;
}
module.exports = { normalizeCharacterSheet };
