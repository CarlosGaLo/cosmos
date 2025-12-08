import { defineStore } from "pinia";
import axios from "axios";
import { characterFunctions } from "@/store/characterSheet";
import { globalFunctions } from "@/store/globalFunctions";

const URL = process.env.VUE_APP_API_URL;

const characterSheetUtils = characterFunctions();
const functions = globalFunctions();

export const useCharacterSheetStore = defineStore("characterSheet", {
  state: () => ({
    characterSheets: [],
    characterSheet: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserCharacterSheets() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${URL}/user-character-sheets/my-sheets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.characterSheets = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener fichas del usuario:", error);
      } finally {
        this.loading = false;
      }
    },

    async saveCurrentCharacterSheet() {
      this.loading = true;

      try {
        const token = localStorage.getItem("token");
        const sheetData = {
          metaData: characterSheetUtils.metaData,
          character: characterSheetUtils.character,
          competences: characterSheetUtils.competences,
          feats: characterSheetUtils.feats,
          unfeats: characterSheetUtils.unfeats,
          languages: characterSheetUtils.languages,
          spells: characterSheetUtils.spells,
          martials: characterSheetUtils.martials,
          speed: characterSheetUtils.speed,
        };
        console.log(sheetData);
        const normalizedData = this.normalizeCharacterSheet(sheetData);
        const response = await axios.post(
          `${URL}/user-character-sheets`,
          normalizedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.characterSheet = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al guardar ficha:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    mapCharacterSheetToStore(sheet) {
      if (!sheet) return;

      const character = sheet.character || {};
      const meta = sheet.metaData || {};

      // META DATA
      characterSheetUtils.metaData = {
        freeXP: meta.freeXP || 0,
        usedXP: meta.usedXP || 0,
        featXP: meta.featXP || 0,
        competencesXP: meta.competencesXP || 0,
        playerName: meta.playerName || "",
        campCost: meta.campCost || 0,
        skillCost: meta.skillCost || 0,
        specialityCost: meta.specialityCost || 0,
        comments: meta.comments || "",
        id: meta.id || null,
        specImagePath: meta.specImagePath || "",
        specShieldPath: meta.specShieldPath || "",
        magicXP: meta.magicXP || 0,
        martialXP: meta.martialXP || 0,
        skillCapMultiplier: meta.skillCapMultiplier || 5,
        characterType: {
          label: meta.characterType?.label || "",
          xp: meta.characterType?.xp || 0,
        },
      };

      // CHARACTER
      characterSheetUtils.character = {
        name: character.name || "",
        specie: character.specie?.name || character.specie || null,
        age: character.age || 0,
        ageState: character.ageState || "Adulto",
        sex: character.sex || "Masculino",
        regen: {
          life: character.regen?.life || 0,
          mana: character.regen?.mana || 0,
          energy: character.regen?.energy || 0,
        },
        camp: {
          art: character.camp?.art || null,
          cul: character.camp?.cul || null,
          mov: character.camp?.mov || null,
          sob: character.camp?.sob || null,
          sup: character.camp?.sup || null,
          vig: character.camp?.vig || null,
        },
        lang: {
          languages: (character.lang?.languages || []).map((lang) =>
            typeof lang === "string" ? lang : lang.name
          ),
        },
      };

      // OTRAS LISTAS
      characterSheetUtils.competences = sheet.competences || [];
      characterSheetUtils.feats = sheet.feats || [];
      characterSheetUtils.unfeats = sheet.unfeats || [];
      characterSheetUtils.zonaAfin = sheet.zonaAfin || [];
      characterSheetUtils.languages = sheet.languages || [];
      characterSheetUtils.spells = sheet.spells || [];
      characterSheetUtils.martials = sheet.martials || [];
      characterSheetUtils.speed = sheet.speed || 0;
    },
    async fetchCharacterSheets() {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/user-character-sheets`);
        this.characterSheets = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener las fichas:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCharacterSheet(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/user-character-sheets/${id}`);
        this.characterSheet = response.data;
        this.mapCharacterSheetToStore(response.data); // << INTEGRACIÓN AUTOMÁTICA
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener la ficha:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchCharacterSheetByName(name) {
      this.loading = true;
      try {
        const response = await axios.get(
          `${URL}/user-character-sheets/name/${name}`
        );
        this.characterSheet = response.data;
        this.mapCharacterSheetToStore(response.data);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener la ficha por nombre:", error);
      } finally {
        this.loading = false; // <-- Esto es crítico
      }
    },
    async createCharacterSheet(sheetData) {
      this.loading = true;
      try {
        const normalizedData = this.normalizeCharacterSheet(sheetData);
        const response = await axios.post(
          `${URL}/user-character-sheets`,
          normalizedData
        );
        this.characterSheets.push(response.data);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al crear la ficha:", error);
      } finally {
        this.loading = false;
      }
    },
    async updateCharacterSheet(id, updatedData) {
      this.loading = true;
      try {
        const normalizedData = this.normalizeCharacterSheet(updatedData);
        const response = await axios.put(
          `${URL}/user-character-sheets/${id}`,
          normalizedData
        );
        const index = this.characterSheets.findIndex((s) => s._id === id);
        if (index !== -1) {
          this.characterSheets[index] = {
            ...this.characterSheets[index],
            ...response.data,
          };
        }
      } catch (error) {
        this.error = error;
        console.error("❌ Error al actualizar la ficha:", error);
      } finally {
        this.loading = false;
      }
    },
    async deleteCharacterSheet(id) {
      this.loading = true;
      try {
        await axios.delete(`${URL}/user-character-sheets/${id}`);
        this.characterSheets = this.characterSheets.filter((s) => s._id !== id);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al eliminar la ficha:", error);
      } finally {
        this.loading = false;
      }
    },
    normalizeCharacterSheet(sheet) {
      if (!sheet || typeof sheet !== "object") {
        console.warn("❗ Hoja de personaje no válida:", sheet);
        return {
          metaData: {},
          character: {},
          competences: [],
          feats: [],
          unfeats: [],
          zonaAfin: [],
          languages: [],
          spells: [],
          martials: [],
          speed: 0,
        };
      }

      const metaData = sheet.metaData || {};
      const character = sheet.character || {};

      const normalized = {
        metaData: {
          freeXP: metaData.freeXP || 0,
          usedXP: metaData.usedXP || 0,
          featXP: metaData.featXP || 0,
          competencesXP: metaData.competencesXP || 0,
          playerName: functions.normalizeString(metaData.playerName || ""),
          campCost: metaData.campCost || 0,
          skillCost: metaData.skillCost || 0,
          specialityCost: metaData.specialityCost || 0,
          comments: metaData.comments || "",
          id: metaData.id || null,
          specImagePath: metaData.specImagePath || "",
          specShieldPath: metaData.specShieldPath || "",
          magicXP: metaData.magicXP || 0,
          martialXP: metaData.martialXP || 0,
          skillCapMultiplier: metaData.skillCapMultiplier || 5,
          characterType: {
            label: functions.normalizeString(
              metaData.characterType?.label || ""
            ),
            xp: metaData.characterType?.xp || 0,
          },
        },
        character: {
          name: functions.normalizeString(character.name || ""),
          specie: character.specie?._id || character.specie || null,
          age: character.age || 0,
          ageState: character.ageState || "Adulto",
          sex: character.sex || "Masculino",
          regen: {
            life: character.regen?.life || 0,
            mana: character.regen?.mana || 0,
            energy: character.regen?.energy || 0,
          },
          camp: {
            art: character.camp?.art?._id || character.camp?.art || null,
            cul: character.camp?.cul?._id || character.camp?.cul || null,
            mov: character.camp?.mov?._id || character.camp?.mov || null,
            sob: character.camp?.sob?._id || character.camp?.sob || null,
            sup: character.camp?.sup?._id || character.camp?.sup || null,
            vig: character.camp?.vig?._id || character.camp?.vig || null,
          },
          lang: {
            languages: (character.lang?.languages || []).map((l) => l._id || l),
          },
        },
        competences: (sheet.competences || []).map((c) => c._id || c),
        feats: (sheet.feats || []).map((f) => f._id || f),
        unfeats: (sheet.unfeats || []).map((uf) => uf._id || uf),
        zonaAfin: (sheet.zonaAfin || []).map((z) => z._id || z),
        languages: (sheet.languages || []).map((l) => l._id || l),
        spells: (sheet.spells || []).map((s) => s._id || s),
        martials: (sheet.martials || []).map((m) => m._id || m),
        speed: sheet.speed || 0,
      };

      return normalized;
    },
  },
});
