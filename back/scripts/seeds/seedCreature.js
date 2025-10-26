const mongoose = require("mongoose");
const Creature = require("../../models/enemies/Creature");
const creaturesData = require("../../data/enemies/creatures.json");

const seedCreatures = async () => {
  try {
    await Creature.deleteMany(); // 🗑️ Elimina todas las criaturas antes de insertar nuevas

    // 🔄 Elimina manualmente el campo `_id` de cada criatura para evitar conflictos
    const cleanData = creaturesData.map((creature) => {
      const { _id, ...rest } = creature;
      return rest;
    });

    await Creature.insertMany(cleanData);
    console.log("✅ Criaturas inicializadas en la BD.");
  } catch (error) {
    console.error("❌ Error al ejecutar seeds:", error);
  }
};

module.exports = seedCreatures;
