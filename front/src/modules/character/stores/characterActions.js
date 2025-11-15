import { XPCalculator } from "../services/xpCalculator";
import { CapCalculator } from "../services/capCalculator";
import { CharacterCalculator } from "../services/characterCalculator";
import { CHARACTER_TYPES } from "../constants/xp";

/**
 * Acciones del personaje
 * Todas las mutaciones del estado pasan por aquí
 */
export function useCharacterActions(state) {
  // ==================== XP MANAGEMENT ====================

  /**
   * Incrementa o decrementa XP de forma segura
   * @param {Object} params
   * @param {number} params.camp - Incremento de campos
   * @param {number} params.skill - Incremento de habilidades
   * @param {number} params.speciality - Incremento de especialidades
   * @param {number} params.other - Coste directo (competencias, feats)
   */
  function modifyXP({ camp = 0, skill = 0, speciality = 0, other = 0 }) {
    const transactions = [
      { type: "camp", amount: camp },
      { type: "skill", amount: skill },
      { type: "speciality", amount: speciality },
      { type: "other", amount: other },
    ].filter((t) => t.amount !== 0);

    const totalCost = XPCalculator.calculateBatchCost(transactions);

    // Validar transacción
    const validation = XPCalculator.validateTransaction(
      state.metaData.value.freeXP,
      totalCost
    );

    if (!validation.valid) {
      console.warn(`⚠️ Transacción XP rechazada: ${validation.reason}`);
      return false;
    }

    // Aplicar transacción
    try {
      const newMetadata = XPCalculator.applyTransaction(
        state.metaData.value,
        totalCost
      );

      state.metaData.value.freeXP = newMetadata.freeXP;
      state.metaData.value.usedXP = newMetadata.usedXP;

      return true;
    } catch (error) {
      console.error("❌ Error al aplicar transacción XP:", error);
      return false;
    }
  }

  /**
   * Establece el tipo de personaje (Héroe, Avanzado, Normal)
   */
  function selectCharacterType(typeLabel) {
    const type = CHARACTER_TYPES[typeLabel.toUpperCase()];

    if (!type) {
      console.warn(`⚠️ Tipo de personaje no válido: ${typeLabel}`);
      return;
    }

    state.metaData.value.characterType = type;
    state.metaData.value.competencesXP = type.competencesXP;
    state.metaData.value.featXP = type.featXP;

    // Calcular XP libre (total - usado)
    state.metaData.value.freeXP = type.baseXP - state.metaData.value.usedXP;

    // Recalcular XP de magia y marcial
    updateMagicXP();
    updateMartialXP();
  }

  // ==================== CHARACTER MANAGEMENT ====================

  /**
   * Establece los datos básicos del personaje
   */
  function setBasicInfo({ name, age, ageState, sex }) {
    if (name !== undefined) state.character.value.name = name;
    if (age !== undefined) state.character.value.age = Number(age);
    if (ageState !== undefined) state.character.value.ageState = ageState;
    if (sex !== undefined) state.character.value.sex = sex;
  }

  /**
   * Carga una plantilla de especie
   */
  function loadSpecieTemplate(specieName, sex) {
    try {
      // Normalizar nombre de especie
      const specieMap = {
        humano: "human",
        kordún: "kordun",
        kordun: "kordun",
        námester: "namester",
        namester: "namester",
        urcan: "urcan",
        zannin: "zannin",
        nergal: "nergal",
      };

      const normalizedSpecie =
        specieMap[specieName.toLowerCase()] || specieName.toLowerCase();

      // Cargar template
      let template;
      if (normalizedSpecie === "nergal") {
        // Nergal tiene templates separados por sexo
        const gender = sex.toLowerCase() === "femenino" ? "F" : "M";
        template = require(`@/dataBase/characterTemplates/nergal${gender}.json`);
      } else {
        template = require(`@/dataBase/characterTemplates/${normalizedSpecie}.json`);
      }

      // Preservar datos importantes antes de cargar template
      const preservedData = {
        name: state.character.value.name,
        age: state.character.value.age,
        ageState: state.character.value.ageState,
        sex: sex,
      };

      // Cargar template
      state.character.value = {
        ...template,
        ...preservedData,
      };

      // Actualizar specie state
      state.character.value.specieState = normalizedSpecie;

      // Cargar feats de especie
      loadSpecieFeats(normalizedSpecie, sex);

      // Actualizar rutas de imágenes
      updateImagePaths(normalizedSpecie, sex);

      // Recalcular todo
      recalculateAll();

      return true;
    } catch (error) {
      console.error("❌ Error al cargar plantilla de especie:", error);
      return false;
    }
  }

  /**
   * Carga los feats específicos de una especie
   */
  function loadSpecieFeats(specie, sex) {
    try {
      const featsDB = require("@/dataBase/feats/feats.json");

      const featMap = {
        human: "humanFeats",
        kordun: "kordunFeats",
        urcan: "urcanFeats",
        zannin: "zanninFeats",
        namester: "namesterFeats",
        nergal:
          sex.toLowerCase() === "femenino"
            ? "nergalFemaleFeats"
            : "nergalMaleFeats",
      };

      const featKey = featMap[specie];
      if (featKey && featsDB[featKey]) {
        state.feats.value = featsDB[featKey];
      }
    } catch (error) {
      console.error("❌ Error al cargar feats de especie:", error);
    }
  }

  /**
   * Actualiza las rutas de imágenes según especie y sexo
   */
  function updateImagePaths(specie, sex) {
    const gender = sex.toLowerCase() === "masculino" ? "m" : "f";
    state.metaData.value.specImagePath = `/images-png/species/${specie}_${gender}.png`;
    state.metaData.value.specShieldPath = `/images-png/shields/${specie}.png`;
  }

  // ==================== CAMP MANAGEMENT ====================

  /**
   * Incrementa el base de un campo
   */
  function increaseCampBase(campCode, amount = 1) {
    const camp = state.character.value.camp[campCode];
    if (!camp) {
      console.warn(`⚠️ Campo no encontrado: ${campCode}`);
      return false;
    }

    // Calcular cap disponible
    const maxBase = camp.cap - camp.specie - camp.age;

    // Validar incremento
    const validation = CapCalculator.validateIncrement(
      camp.base,
      amount,
      maxBase
    );
    if (!validation.valid) {
      console.warn(`⚠️ ${validation.reason}`);
      return false;
    }

    // Intentar modificar XP
    const xpSuccess = modifyXP({ camp: amount });
    if (!xpSuccess) return false;

    // Aplicar cambio
    camp.base += amount;

    // Recalcular campo y sus dependencias
    recalculateCamp(campCode);

    return true;
  }

  /**
   * Incrementa el base de una habilidad
   */
  function increaseSkillBase(campCode, skillName, amount = 1) {
    const camp = state.character.value.camp[campCode];
    if (!camp) return false;

    const skill = camp.skills?.[skillName];
    if (!skill) {
      console.warn(`⚠️ Habilidad no encontrada: ${skillName}`);
      return false;
    }

    // Validar incremento
    const validation = CapCalculator.validateIncrement(
      skill.base,
      amount,
      skill.cap
    );
    if (!validation.valid) {
      console.warn(`⚠️ ${validation.reason}`);
      return false;
    }

    // Intentar modificar XP
    const xpSuccess = modifyXP({ skill: amount });
    if (!xpSuccess) return false;

    // Aplicar cambio
    skill.base += amount;

    // Recalcular campo
    recalculateCamp(campCode);

    return true;
  }

  /**
   * Incrementa el base de una especialidad
   */
  function increaseSpecialityBase(
    campCode,
    skillName,
    specialityName,
    amount = 1
  ) {
    const camp = state.character.value.camp[campCode];
    if (!camp) return false;

    const skill = camp.skills?.[skillName];
    if (!skill) return false;

    const speciality = skill.specialities?.[specialityName];
    if (!speciality) {
      console.warn(`⚠️ Especialidad no encontrada: ${specialityName}`);
      return false;
    }

    // El cap de la especialidad es el total de la skill
    const cap = skill.total;

    // Validar incremento
    const validation = CapCalculator.validateIncrement(
      speciality.base,
      amount,
      cap
    );
    if (!validation.valid) {
      console.warn(`⚠️ ${validation.reason}`);
      return false;
    }

    // Intentar modificar XP
    const xpSuccess = modifyXP({ speciality: amount });
    if (!xpSuccess) return false;

    // Aplicar cambio
    speciality.base += amount;

    // Recalcular especialidad
    speciality.final = CharacterCalculator.calculateSpecialityTotal(speciality);

    return true;
  }

  // ==================== RECALCULATION ====================

  /**
   * Recalcula un campo específico y todas sus dependencias
   */
  function recalculateCamp(campCode) {
    const camp = state.character.value.camp[campCode];
    if (!camp) return;

    const recalculated = CharacterCalculator.recalculateCamp(camp);
    state.character.value.camp[campCode] = recalculated;
  }

  /**
   * Recalcula todos los campos del personaje
   */
  function recalculateAll() {
    const recalculated = CharacterCalculator.recalculateAllCamps(
      state.character.value.camp,
      state.character.value.ageState
    );

    state.character.value.camp = recalculated;

    // Actualizar XP mágica y marcial
    updateMagicXP();
    updateMartialXP();
  }

  /**
   * Actualiza el XP mágica disponible
   */
  function updateMagicXP() {
    const sob = state.character.value.camp.sob;
    if (!sob || !sob.skills?.hechiceria) {
      state.metaData.value.magicXP = [];
      return;
    }

    const hechiceria = sob.skills.hechiceria.specialities || {};
    state.metaData.value.magicXP = Object.values(hechiceria).map((spec) => ({
      name: spec.name,
      total: spec.final || 0,
    }));
  }

  /**
   * Actualiza el XP marcial disponible
   */
  function updateMartialXP() {
    const vig = state.character.value.camp.vig;
    if (!vig || !vig.skills?.energia) {
      state.metaData.value.martialXP = { name: "", total: 0 };
      return;
    }

    const marcial = vig.skills.energia.specialities?.marcial;
    if (marcial) {
      state.metaData.value.martialXP = {
        name: marcial.name,
        total: marcial.final || 0,
      };
    }
  }

  // ==================== LISTS MANAGEMENT ====================

  /**
   * Añade un idioma a la lista
   */
  function addLanguage(languageId) {
    if (!state.character.value.lang.languages.includes(languageId)) {
      state.character.value.lang.languages.push(languageId);
    }
  }

  /**
   * Elimina un idioma del personaje
   */
  function removeLanguage(languageId) {
    const index = state.character.value.lang.languages.indexOf(languageId);
    if (index > -1) {
      state.character.value.lang.languages.splice(index, 1);
    }
  }

  /**
   * Establece información básica del personaje
   */
  function setBasicInfo(data) {
    Object.assign(state.character.value, data);
  }

  /**
   * Añade una competencia y gasta XP
   */
  function addCompetence(competence) {
    const xpSuccess = modifyXP({ other: competence.xp });
    if (!xpSuccess) return false;

    state.competences.value.push(competence);
    state.metaData.value.competencesXP -= competence.xp;
    return true;
  }

  /**
   * Elimina una competencia y recupera XP
   */
  function removeCompetence(competenceId) {
    const index = state.competences.value.findIndex(
      (c) => c.id === competenceId
    );
    if (index === -1) return false;

    const competence = state.competences.value[index];
    const xpSuccess = modifyXP({ other: -competence.xp });
    if (!xpSuccess) return false;

    state.competences.value.splice(index, 1);
    state.metaData.value.competencesXP += competence.xp;
    return true;
  }

  // ==================== RETURN ====================
  return {
    // XP
    modifyXP,
    selectCharacterType,

    // Character
    setBasicInfo,
    loadSpecieTemplate,

    // Camps
    increaseCampBase,
    increaseSkillBase,
    increaseSpecialityBase,

    // Recalculation
    recalculateCamp,
    recalculateAll,
    updateMagicXP,
    updateMartialXP,

    // Lists
    addLanguage,
    removeLanguage,
    addCompetence,
    removeCompetence,
  };
}
