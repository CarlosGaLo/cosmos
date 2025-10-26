const Character = require("../models/sheet/Character");
const Species = require("../models/sheet/commons/Specie");
const Camp = require("../models/sheet/commons/Camp");
const mongoose = require("mongoose");
const { Types } = mongoose;


module.exports = {
  getAllCharacters: async (req, res) => {
    try {
      const characters = await Character.find();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCharacterById: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character)
        return res.status(404).json({ message: "Personaje no encontrado" });
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Buscar personaje por nombre
  getCharacterByName: async (req, res) => {
    try {
      // Obtener el parámetro "name" de la URL
      const name = req.params.name;

      // Verificar que el nombre no esté vacío
      if (!name) {
        return res
          .status(400)
          .json({ message: 'El parámetro "name" es obligatorio' });
      }

      // Buscar una coincidencia parcial (case insensitive) y devolver solo un resultado
      // Usando populate para obtener el nombre de la especie y toda la información de camps
      const character = await Character.findOne({
        name: { $regex: name, $options: "i" },
      })
        .populate({
          path: "specie", // 'specie' como está definido en el esquema de Character
          model: "Specie", // 'Specie' como se exporta el modelo
          select: "name", // Solo traer el nombre de la especie
        })
        .populate({
          path: "camp.art",
          model: "Camp",
        })
        .populate({
          path: "camp.cul",
          model: "Camp",
        })
        .populate({
          path: "camp.mov",
          model: "Camp",
        })
        .populate({
          path: "camp.sob",
          model: "Camp",
        })
        .populate({
          path: "camp.sup",
          model: "Camp",
        })
        .populate({
          path: "camp.vig",
          model: "Camp",
        });

      // Verificar si se encontró el personaje
      if (!character) {
        return res
          .status(404)
          .json({ message: "No se encontró ningún personaje con ese nombre" });
      }

      // Responder con el personaje encontrado
      res.status(200).json(character);
    } catch (error) {
      console.error("Error al buscar personaje por nombre:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
  createCharacter: async (req, res) => {
    try {
      const characterData = req.body;
      console.log(characterData);
      // Verificar y convertir specie a ObjectId
      if (characterData.specie) {
        const specie = await Species.findOne({ name: characterData.specie });
        if (specie) {
          characterData.specie = new Types.ObjectId(specie._id);
        } else {
          return res.status(400).json({
            message: `Specie "${characterData.specie}" no encontrada.`,
          });
        }
      } else {
        return res.status(400).json({ message: "La especie es obligatoria." });
      }

      // Verificar y convertir camps usando "code"
      const campCategories = ["art", "cul", "mov", "sob", "sup", "vig"];
      characterData.camp = characterData.camp || {};

      const characterExists = await Character.findOne({
        name: characterData.name,
      });

      for (const category of campCategories) {
        if (characterData.camp[category]) {
          let campCode =
            characterData.camp[category].code || characterData.camp[category];

          let campDoc;

          if (characterExists) {
            // Si el personaje ya existe, recuperar el Camp desde la DB
            campDoc = await Camp.findOne({ code: campCode });
          }

          if (!campDoc) {
            // Si el Camp no existe o el Character es nuevo, crear un nuevo registro
            campDoc = new Camp(characterData.camp[category]);
            await campDoc.save();
          }

          // Asignar solo el _id del Camp al characterData
          characterData.camp[category] = campDoc._id;
        }
      }

      // Verificar y convertir languages a ObjectId
      if (characterData.lang && characterData.lang.languages) {
        characterData.lang.languages = await Promise.all(
          characterData.lang.languages.map(async (langName) => {
            const language = await Language.findOne({ name: langName });
            if (language) {
              return new Types.ObjectId(language._id);
            }
            console.warn(`⚠️ Language con nombre "${langName}" no encontrado.`);
            return null;
          })
        );
        // Filtrar posibles nulls
        characterData.lang.languages = characterData.lang.languages.filter(
          (id) => id !== null
        );
      }

      // Formatear y añadir valores por defecto
      const formattedCharacter = {
        name: characterData.name || "Sin Nombre",
        specie: characterData.specie,
        age: characterData.age || 0,
        ageState: characterData.ageState || "Adulto",
        sex: characterData.sex || "Masculino",
        regen: {
          life: characterData.regen?.life || 0,
          mana: characterData.regen?.mana || 0,
          energy: characterData.regen?.energy || 0,
        },
        camp: characterData.camp,
        lang: characterData.lang || { languages: [] },
      };

      // Crear y guardar el personaje
      const newCharacter = new Character(formattedCharacter);
      await newCharacter.save();

      res.status(201).json(newCharacter);
    } catch (error) {
      console.error("❌ Error al crear el personaje:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  updateCharacter: async (req, res) => {
    try {
      const updatedCharacter = await Character.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCharacter)
        return res.status(404).json({ message: "Personaje no encontrado" });
      res.json(updatedCharacter);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCharacter: async (req, res) => {
    try {
      const deletedCharacter = await Character.findByIdAndDelete(req.params.id);
      if (!deletedCharacter)
        return res.status(404).json({ message: "Personaje no encontrado" });
      res.json({ message: "Personaje eliminado" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
