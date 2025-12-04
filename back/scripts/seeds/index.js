// seeds/index.js

// Importar todos los seeds
const seedRules = require("./seedRules");
const seedCamp = require("./seedCamp");
const seedSpecie = require("./seedSpecie");
const seedSpell = require("./seedSpell");
const seedMartial = require("./seedMartial");
const seedCompetence = require("./seedCompetence");
const seedFeat = require("./seedFeat");
const seedUnfeat = require("./seedUnfeat");
const seedLanguage = require("./seedLanguage");
const seedWiki = require("./seedWiki")

// Exportar como un solo módulo
module.exports = {
  seedRules,
  seedCamp,
  seedSpecie,
  seedSpell,
  seedMartial,
  seedCompetence,
  seedFeat,
  seedUnfeat,
  seedLanguage,
  seedWiki
};
