// controllers/userCharacterController.js
const UserCharacter = require("../models/sheet/userCharacterSheet");

// Normaliza y sanitiza payload
const normalizePayload = (body, userId) => {
  const character = body.character || body || {};

  // Specie
  const specie = character.specie?.name || character.specie || null;

  // Languages safe map (si vienen objetos, sacamos .name)
  const languages = (character.lang?.languages || character.languages || [])
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter(Boolean);

  const lang = { languages };

  // Regen
  const regen = {
    life: Number(character.regen?.life ?? 0),
    mana: Number(character.regen?.mana ?? 0),
    energy: Number(character.regen?.energy ?? 0),
  };

  // Camp (normaliza cada entrada)
  const rawCamp = character.camp || {};
  const camp = {};
  Object.entries(rawCamp).forEach(([k, v]) => {
    camp[k] = {
      name: v?.name ?? k,
      code: v?.code ?? k.substring(0, 3).toUpperCase(),
      base: Number(v?.base ?? 0),
      mod: Number(v?.mod ?? 0),
      cap: Number(v?.cap ?? 0),
      age: Number(v?.age ?? 0),
      race: Number(v?.race ?? 0),
      total: Number(v?.total ?? 0),
      skills: v?.skills ?? {},
    };
  });

  // Determina ownerId (prioridad userId)
  let ownerId = null;
  if (userId) {
    ownerId = userId;
  } else if (character.owner) {
    // Aceptamos strings o objetos {_id: ...}
    if (typeof character.owner === "string") ownerId = character.owner;
    else if (character.owner?._id) ownerId = character.owner._id;
  }

  // Forzar formato ObjectId string (si tienes ids válidos)
  try {
    ownerId = ownerId ? String(ownerId) : null;
  } catch (e) {
    ownerId = null;
  }

  // Extras: sólo si viene explícito y es un objeto plano (no copiar objetos que contengan correo)
  const extras =
    character.extras && typeof character.extras === "object"
      ? character.extras
      : undefined;

  // Construimos **solo** los campos permitidos — no hacemos spread del objeto original
  const payload = {
    name: typeof character.name === "string" ? character.name.trim() : "",
    specie,
    age: Number(character.age ?? 0),
    ageState: character.ageState ?? "Adulto",
    sex: character.sex ?? "Masculino",
    regen,
    camp,
    lang,
    owner: ownerId,
  };

  if (extras) payload.extras = extras;

  return payload;
};

exports.getAllUserCharacters = async (req, res) => {
  try {
    const list = await UserCharacter.find();
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los userCharacters",
      error: error.message,
    });
  }
};

exports.getUserCharacterById = async (req, res) => {
  try {
    const doc = await UserCharacter.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ message: "UserCharacter no encontrado" });
    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el userCharacter",
      error: error.message,
    });
  }
};

exports.getUserCharacterByName = async (req, res) => {
  try {
    const name = req.params.name;
    const doc = await UserCharacter.findOne({
      name: new RegExp("^" + name + "$", "i"),
    });
    if (!doc)
      return res.status(404).json({ message: "UserCharacter no encontrado" });
    return res.status(200).json(doc);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener por nombre", error: error.message });
  }
};

exports.createUserCharacter = async (req, res) => {
  try {
    // userId si tienes autenticación (req.user._id)
    const userId = req.user?._id;
    const payload = normalizePayload(req.body, userId);

    const newDoc = new UserCharacter(payload);
    await newDoc.save();
    return res.status(201).json(newDoc);
  } catch (error) {
    console.error("Error creando userCharacter:", error.stack || error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Error de validación", errors: error.errors });
    }
    return res.status(500).json({
      message: "Error al crear el userCharacter",
      error: error.message,
    });
  }
};

exports.updateUserCharacter = async (req, res) => {
  try {
    const userId = req.user?._id;
    const payload = normalizePayload(req.body, userId);

    const updated = await UserCharacter.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );
    if (!updated)
      return res.status(404).json({ message: "UserCharacter no encontrado" });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error actualizando userCharacter:", error.stack || error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Error de validación", errors: error.errors });
    }
    return res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

exports.deleteUserCharacter = async (req, res) => {
  try {
    const deleted = await UserCharacter.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "UserCharacter no encontrado" });
    return res.status(200).json({ message: "UserCharacter eliminado" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar", error: error.message });
  }
};
