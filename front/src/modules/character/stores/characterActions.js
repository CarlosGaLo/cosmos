import { XPCalculator } from "../services/xpCalculator";
import { CapCalculator } from "../services/capCalculator";
import { CharacterCalculator } from "../services/characterCalculator";
import { CHARACTER_TYPES, XP_COSTS } from "../constants/xp";
import { useSpeciesStore } from "@/store/speciesStore";
import { AgeCalculator } from "../services/ageCalculator";

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

    // Validar transacción con allowNegativeXP
    const validation = XPCalculator.validateTransaction(
      state.metaData.value.freeXP,
      totalCost,
      state.metaData.value.allowNegativeXP || false
    );

    if (!validation.valid) {
      console.warn(`⚠️ Transacción XP rechazada: ${validation.reason}`);
      return false;
    }

    // Aplicar transacción con allowNegativeXP
    try {
      const newMetadata = XPCalculator.applyTransaction(
        state.metaData.value,
        totalCost,
        state.metaData.value.allowNegativeXP || false
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
   * Actualiza el XP mágica disponible
   */
  function updateMagicXP() {
    const sob = state.character.value.camp.sob;
    if (!sob || !sob.skills?.hechiceria) {
      state.metaData.value.magicXP = [];
      state.metaData.value.maxMagicSpecialties = 0;
      return;
    }

    // ✅ Calcular máximo de especialidades basado en campo Sobrenatural
    state.metaData.value.maxMagicSpecialties = sob.total || 0;

    const hechiceria = sob.skills.hechiceria.specialities || {};

    // ✅ Solo incluir especialidades que el personaje ha comprado
    const purchasedCodes = state.metaData.value.purchasedMagicSpecialties || [];

    const newMagicXP = Object.entries(hechiceria)
      .filter(([key, spec]) => {
        const code = (spec.name || "").toLowerCase();
        return purchasedCodes.includes(code);
      })
      .map(([key, spec]) => {
        const code = (spec.name || "").toLowerCase();
        const existingEntry = state.metaData.value.magicXP?.find(
          (m) => m.code === code
        );

        return {
          name: spec.name,
          code: code,
          total: spec.final || 0,
          used: existingEntry?.used || 0,
        };
      });

    state.metaData.value.magicXP = newMagicXP;
  }

  /**
   * Compra una especialidad mágica
   */
  function purchaseMagicSpecialty(specialtyCode) {
    const purchased = state.metaData.value.purchasedMagicSpecialties || [];
    const maxAllowed = state.metaData.value.maxMagicSpecialties;
    const specie = state.character.value.specieState;

    // ✅ Validar límite
    if (purchased.length >= maxAllowed) {
      return {
        success: false,
        message: `Ya has comprado el máximo de especialidades (${maxAllowed})`,
      };
    }

    // ✅ Validar primera especialidad según especie
    if (purchased.length === 0) {
      const requiredFirst =
        specie === "kordun" ? "kairomancia" : "arcanomancia";

      if (specialtyCode !== requiredFirst) {
        return {
          success: false,
          message: `La primera especialidad debe ser ${
            requiredFirst.charAt(0).toUpperCase() + requiredFirst.slice(1)
          }`,
        };
      }
    }

    // ✅ Validar que no esté ya comprada
    if (purchased.includes(specialtyCode)) {
      return {
        success: false,
        message: "Ya has comprado esta especialidad",
      };
    }

    // ✅ Añadir especialidad
    state.metaData.value.purchasedMagicSpecialties.push(specialtyCode);
    updateMagicXP();

    return { success: true };
  }

  /**
   * Elimina una especialidad mágica (solo si no tiene hechizos)
   */
  function removeMagicSpecialty(specialtyCode) {
    const magicXP = state.metaData.value.magicXP || [];
    const specialtyData = magicXP.find((m) => m.code === specialtyCode);

    // ✅ No permitir eliminar si tiene XP usada
    if (specialtyData && specialtyData.used > 0) {
      return {
        success: false,
        message: "No puedes eliminar una especialidad con hechizos aprendidos",
      };
    }

    // ✅ Eliminar del array
    const index =
      state.metaData.value.purchasedMagicSpecialties.indexOf(specialtyCode);
    if (index > -1) {
      state.metaData.value.purchasedMagicSpecialties.splice(index, 1);
      updateMagicXP();
    }

    return { success: true };
  }

  /**
   * Actualiza el XP marcial disponible
   * martialXP = energia.specialities.marcial.final
   */
  function updateMartialXP() {
    const vig = state.character.value.camp.vig;

    if (!vig || !vig.skills) {
      state.metaData.value.martialXP = 0;
      state.metaData.value.martialUsed = 0;
      return;
    }

    // Soportar clave con y sin acento
    const energia = vig.skills.energía || vig.skills.energia;
    if (!energia || !energia.specialities) {
      state.metaData.value.martialXP = 0;
      state.metaData.value.martialUsed = 0;
      return;
    }

    const marcial = energia.specialities.marcial;
    const finalValue = marcial?.final ?? 0;

    // Si quieres que solo haya XP marcial a partir de cierto umbral:
    // const maxXP = finalValue >= 5 ? finalValue : 0;
    // Si quieres que sea SIEMPRE igual al valor de energia.marcial:
    const maxXP = finalValue;

    state.metaData.value.martialXP = maxXP;

    // No dejar que martialUsed se salga del máximo
    if (!state.metaData.value.martialUsed) {
      state.metaData.value.martialUsed = 0;
    }
    if (state.metaData.value.martialUsed > maxXP) {
      state.metaData.value.martialUsed = maxXP;
    }
  }

  /**
   * Normaliza un string removiendo tildes y caracteres especiales
   */
  function normalizeKey(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
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
   * Carga una plantilla de especie desde la API
   */
  async function loadSpecieTemplate(specieName, sex) {
    try {
      const API_URL = process.env.VUE_APP_API_URL;

      const specieMap = {
        humano: "Human",
        human: "Human",
        kordún: "Kordun",
        kordun: "Kordun",
        námester: "Namester",
        namester: "Namester",
        urcan: "Urcan",
        zannin: "Zannin",
        nergal: "Nergal",
      };

      const normalizedSpecie = specieMap[specieName.toLowerCase()];

      const response = await fetch(`${API_URL}/species/${normalizedSpecie}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const specieData = await response.json();

      // Transformar camps
      const transformedCamps = {};

      if (Array.isArray(specieData.camp)) {
        specieData.camp.forEach((campData) => {
          // Mapear códigos correctos
          let campCode = campData.code.substring(0, 3).toLowerCase();

          transformedCamps[campCode] = {
            name: campData.name,
            code: campCode,
            base: 0,
            specie: campData.race || 0,
            age: 0,
            mod: campData.mod || 0,
            total: campData.race || 0,
            cap: campData.cap || 5,
            skills: campData.skills || {},
          };
        });
      }

      // ACTUALIZAR state directamente
      state.character.value.specie = specieData.name;
      state.character.value.specieState = normalizedSpecie.toLowerCase();
      state.character.value.camp = transformedCamps;

      // Feats
      if (Array.isArray(specieData.specieSpecial)) {
        state.feats.value = specieData.specieSpecial;
      }

      // Imágenes
      const gender = sex.toLowerCase() === "masculino" ? "m" : "f";
      state.metaData.value.specImagePath = `/images-png/species/${normalizedSpecie.toLowerCase()}_${gender}.png`;
      state.metaData.value.specShieldPath = `/images-png/shields/${normalizedSpecie.toLowerCase()}.png`;

      // Aplicar edad
      const ageModifiers = AgeCalculator.getModifiers(
        state.character.value.ageState
      );
      Object.entries(ageModifiers).forEach(([campCode, modifier]) => {
        if (transformedCamps[campCode]) {
          transformedCamps[campCode].age = modifier;
          transformedCamps[campCode].total += modifier;
        }
      });

      // Recalcular
      recalculateAll();

      return true;
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`⚠️ Error: ${error.message}`);
      return false;
    }
  }

  /**
   * Fallback: Cargar desde archivos locales si el backend falla
   */
  function loadSpecieTemplateFallback(specieName, sex) {
    try {
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

      let template;
      if (normalizedSpecie === "nergal") {
        const gender = sex.toLowerCase() === "femenino" ? "F" : "M";
        template = require(`@/dataBase/characterTemplates/nergal${gender}.json`);
      } else {
        template = require(`@/dataBase/characterTemplates/${normalizedSpecie}.json`);
      }

      const preservedData = {
        name: state.character.value.name,
        age: state.character.value.age,
        ageState: state.character.value.ageState,
        sex: sex,
      };

      state.character.value = {
        ...template,
        ...preservedData,
      };

      state.character.value.specieState = normalizedSpecie;

      loadSpecieFeats(normalizedSpecie, sex);
      updateImagePaths(normalizedSpecie, sex);
      recalculateAll();
      return true;
    } catch (error) {
      console.error("❌ Error en fallback local:", error);
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
   * Aumenta/disminuye la base de una habilidad
   */
  function increaseSkillBase(campCode, skillName, amount) {
    const camp = state.character.value.camp[campCode];
    if (!camp) {
      console.error(`❌ Campo ${campCode} no encontrado`);
      return false;
    }

    // Buscar skill por nombre normalizado
    const normalizedSkillName = normalizeKey(skillName);
    const skillEntry = Object.entries(camp.skills).find(([key, skill]) => {
      return (
        normalizeKey(skill.name) === normalizedSkillName ||
        normalizeKey(key) === normalizedSkillName
      );
    });

    if (!skillEntry) {
      console.error(`❌ Habilidad ${skillName} no encontrada en ${campCode}`);
      return false;
    }

    const [skillKey, skill] = skillEntry;

    // Validar XP
    const xpCost = XP_COSTS.SKILL * amount;
    if (amount > 0 && state.metaData.value.freeXP < xpCost) {
      alert("⚠️ No tienes suficiente XP");
      return false;
    }

    // Aplicar cambio
    skill.base += amount;

    // Actualizar XP
    if (amount > 0) {
      state.metaData.value.usedXP += xpCost;
      state.metaData.value.freeXP -= xpCost;
    } else {
      state.metaData.value.usedXP -= Math.abs(xpCost);
      state.metaData.value.freeXP += Math.abs(xpCost);
    }

    // Recalcular
    recalculateAll();
    return true;
  }

  /**
   * Aumenta/disminuye la base de una especialidad
   */
  function increaseSpecialityBase(campCode, skillName, specialityName, amount) {
    const camp = state.character.value.camp[campCode];
    if (!camp) {
      console.error(`❌ Campo ${campCode} no encontrado`);
      return false;
    }

    // Buscar skill normalizada
    const normalizedSkillName = normalizeKey(skillName);
    const skillEntry = Object.entries(camp.skills).find(([key, skill]) => {
      return (
        normalizeKey(skill.name) === normalizedSkillName ||
        normalizeKey(key) === normalizedSkillName
      );
    });

    if (!skillEntry) {
      console.error(`❌ Habilidad ${skillName} no encontrada`);
      return false;
    }

    const [skillKey, skill] = skillEntry;

    // Buscar especialidad normalizada
    const normalizedSpecName = normalizeKey(specialityName);
    const specEntry = Object.entries(skill.specialities || {}).find(
      ([key, spec]) => {
        return (
          normalizeKey(spec.name) === normalizedSpecName ||
          normalizeKey(key) === normalizedSpecName
        );
      }
    );

    if (!specEntry) {
      console.error(`❌ Especialidad ${specialityName} no encontrada`);
      return false;
    }

    const [specKey, speciality] = specEntry;

    // Validar XP
    const xpCost = XP_COSTS.SPECIALITY * amount;
    if (amount > 0 && state.metaData.value.freeXP < xpCost) {
      alert("⚠️ No tienes suficiente XP");
      return false;
    }

    // Aplicar cambio
    speciality.base += amount;

    // Actualizar XP
    if (amount > 0) {
      state.metaData.value.usedXP += xpCost;
      state.metaData.value.freeXP -= xpCost;
    } else {
      state.metaData.value.usedXP -= Math.abs(xpCost);
      state.metaData.value.freeXP += Math.abs(xpCost);
    }

    // Recalcular
    recalculateAll();
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

    // ✅ NUEVO: Magic specialties
    purchaseMagicSpecialty,
    removeMagicSpecialty,

    // Lists
    addLanguage,
    removeLanguage,
    addCompetence,
    removeCompetence,
  };
}
