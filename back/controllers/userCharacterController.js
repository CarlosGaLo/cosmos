// controllers/userCharacterController.js
const UserCharacter = require("../models/sheet/userCharacterSheet");

// Normaliza y sanitiza payload
const normalizePayload = (body, userId) => {
  // el frontend puede enviar { character: { ... } } o directamente el objeto
  const character = body.character || body || {};

  // ----------------- SPECIE -----------------
  const specie = character.specie?.name || character.specie || null;

  // ----------------- LANGUAGES -----------------
  // Acepta: character.lang.languages (array de strings u objetos{name})
  // o character.languages (array)
  const languagesFromLang = Array.isArray(character.lang?.languages)
    ? character.lang.languages
    : [];
  const languagesFromTop = Array.isArray(character.languages)
    ? character.languages
    : [];
  const languagesRaw = languagesFromLang.length
    ? languagesFromLang
    : languagesFromTop;

  const languages = (languagesRaw || [])
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter(Boolean);

  const lang = { languages };

  // ----------------- REGEN -----------------
  const regen = {
    life: Number(character.regen?.life ?? 0),
    mana: Number(character.regen?.mana ?? 0),
    energy: Number(character.regen?.energy ?? 0),
  };

  // ----------------- CAMP -----------------
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

  // ----------------- META DATA -----------------
  // El frontend puede enviar metaData tanto en body.metaData como en character.metaData
  const md = body.metaData || character.metaData || {};

  const metaData = {
    freeXP: Number(md.freeXP ?? md.freeXp ?? 0),
    usedXP: Number(md.usedXP ?? 0),
    featXP: Number(md.featXP ?? 0),
    competencesXP: Number(md.competencesXP ?? 0),
    // magicXP puede ser array o mixed
    magicXP: Array.isArray(md.magicXP)
      ? md.magicXP
      : md.magicXP
      ? [md.magicXP]
      : [],
    // martialXP puede ser número o array -> lo guardamos tal cual en mixed
    martialXP: md.martialXP ?? md.martialXp ?? 0,
    playerName: md.playerName ?? "",
    campCost: Number(md.campCost ?? 100),
    purchasedMagicSpecialties: Array.isArray(md.purchasedMagicSpecialties)
      ? md.purchasedMagicSpecialties
      : [],
    maxMagicSpecialties: Number(md.maxMagicSpecialties ?? 0),
    skillCost: Number(md.skillCost ?? 30),
    specialityCost: Number(md.specialityCost ?? 10),
    comments: md.comments ?? "",
    id: md.id ?? md._id ?? null,
    specImagePath: md.specImagePath ?? "",
    specShieldPath: md.specShieldPath ?? "",
    unfeatXP: Number(md.unfeatXP ?? 0),
    skillCapMultiplier: Number(md.skillCapMultiplier ?? 5),
    allowNegativeXP: Boolean(md.allowNegativeXP ?? false),
    // por compatibilidad: si envían martialXP como lista alternativa
    martialXPList: Array.isArray(md.martialXPList)
      ? md.martialXPList
      : md.martialXPList
      ? [md.martialXPList]
      : [],
    characterType: {
      label: md.characterType?.label ?? "",
      xp: Number(md.characterType?.xp ?? 0),
    },
  };

  // ----------------- LISTS -----------------
  // Aceptamos arrays de objetos o strings; guardamos tal cual (Mixed) pero limpiamos valores nulos
  const safeArray = (arr) =>
    Array.isArray(arr) ? arr.filter((i) => i !== null && i !== undefined) : [];

  const competences = safeArray(
    body.competences || character.competences || []
  );
  const feats = safeArray(body.feats || character.feats || []);
  const unfeats = safeArray(body.unfeats || character.unfeats || []);
  const zonaAfin = safeArray(body.zonaAfin || character.zonaAfin || []);
  const spells = safeArray(body.spells || character.spells || []);
  const martials = safeArray(body.martials || character.martials || []);

  // speed: puede venir en top-level body.speed o character.speed
  const speed = Number(body.speed ?? character.speed ?? 0);

  // ----------------- OWNER -----------------
  // Determina ownerId (prioridad userId)
  let ownerId = null;
  if (userId) {
    ownerId = userId;
  } else if (character.owner) {
    // Aceptamos strings o objetos {_id: ...}
    if (typeof character.owner === "string") ownerId = character.owner;
    else if (character.owner?._id) ownerId = character.owner._id;
  } else if (body.owner) {
    if (typeof body.owner === "string") ownerId = body.owner;
    else if (body.owner?._id) ownerId = body.owner._id;
  }

  // Forzar formato string (si tienes ids válidos)
  try {
    ownerId = ownerId ? String(ownerId) : null;
  } catch (e) {
    ownerId = null;
  }

  // ----------------- EXTRAS -----------------
  const extras =
    character.extras && typeof character.extras === "object"
      ? character.extras
      : undefined;

  // ----------------- CONSTRUCCIÓN DEL PAYLOAD -----------------
  const payload = {
    name: typeof character.name === "string" ? character.name.trim() : "",
    specie,
    specieState: character.specieState ?? character.specie_state ?? "",
    age: Number(character.age ?? 0),
    ageState: character.ageState ?? "Adulto",
    sex: character.sex ?? "Masculino",
    regen,
    camp,
    lang,
    metaData,
    competences,
    feats,
    unfeats,
    zonaAfin,
    languages, // top-level convenience array (además de lang.languages)
    spells,
    martials,
    speed,
    owner: ownerId,
  };

  if (extras) payload.extras = extras;

  return payload;
};

// ----------------- CONTROLLERS -----------------
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
