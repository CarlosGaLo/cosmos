// store/characterSheetDB.js
import { defineStore } from "pinia";
import axios from "axios";
import { characterFunctions } from "@/store/characterSheet";

const URL = process.env.VUE_APP_API_URL;
const characterSheetUtils = characterFunctions();

export const useCharacterSheetStore = defineStore("characterSheet", {
  state: () => ({
    characterSheets: [],
    characterSheet: null,
    loading: false,
    error: null,
  }),

  actions: {
    // ==================== OBTENER MIS FICHAS ====================

    async fetchUserCharacterSheets() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No hay token de autenticación");
        }

        const response = await axios.get(
          `${URL}/user-character-sheets/my-sheets`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.characterSheets = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error("❌ Error al obtener fichas del usuario:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ==================== GUARDAR FICHA ACTUAL ====================

    async saveCurrentCharacterSheet() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Debes iniciar sesión para guardar fichas");
        }

        // ✅ Preparar payload simplificado
        const payload = this.preparePayload();

        console.log("📤 Enviando payload:", payload);

        const response = await axios.post(
          `${URL}/user-character-sheets`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Ficha guardada:", response.data);

        this.characterSheet = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error(
          "❌ Error al guardar ficha:",
          error.response?.data || error
        );
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ==================== PREPARAR PAYLOAD ====================

    preparePayload() {
      const character = characterSheetUtils.character;
      const metaData = characterSheetUtils.metaData;

      return {
        metaData: {
          freeXP: metaData.freeXP || 0,
          usedXP: metaData.usedXP || 0,
          featXP: metaData.featXP || 0,
          competencesXP: metaData.competencesXP || 0,
          playerName: metaData.playerName || "",
          campCost: metaData.campCost || 100,
          skillCost: metaData.skillCost || 30,
          specialityCost: metaData.specialityCost || 10,
          comments: metaData.comments || "",
          specImagePath: metaData.specImagePath || "",
          specShieldPath: metaData.specShieldPath || "",
          magicXP: metaData.magicXP || 0,
          martialXP: metaData.martialXP || 0,
          skillCapMultiplier: metaData.skillCapMultiplier || 5,
          characterType: metaData.characterType || { label: "", xp: 0 },
        },
        character: {
          name: character.name || "",
          specie: this.extractSpecieName(character.specie),
          age: character.age || 0,
          ageState: character.ageState || "Adulto",
          sex: character.sex || "Masculino",
          regen: {
            life: character.regen?.life || 0,
            mana: character.regen?.mana || 0,
            energy: character.regen?.energy || 0,
          },
          camp: character.camp || {},
          lang: {
            languages: this.extractLanguageNames(
              character.lang?.languages || []
            ),
          },
        },
        competences: this.extractIds(characterSheetUtils.competences),
        feats: this.extractIds(characterSheetUtils.feats),
        unfeats: this.extractIds(characterSheetUtils.unfeats),
        languages: this.extractIds(characterSheetUtils.languages),
        spells: this.extractIds(characterSheetUtils.spells),
        martials: this.extractIds(characterSheetUtils.martials),
        speed: characterSheetUtils.speed || 0,
      };
    },

    // ==================== HELPERS ====================

    extractSpecieName(specie) {
      if (!specie) return null;
      if (typeof specie === "string") return specie;
      if (specie.name) return specie.name;
      return null;
    },

    extractLanguageNames(languages) {
      return languages
        .map((lang) => {
          if (typeof lang === "string") return lang;
          if (lang.name) return lang.name;
          return null;
        })
        .filter(Boolean);
    },

    extractIds(array) {
      if (!Array.isArray(array)) return [];
      return array
        .map((item) => {
          if (typeof item === "string") return item;
          if (item._id) return item._id;
          return null;
        })
        .filter(Boolean);
    },

    // ==================== CARGAR FICHA ====================

    mapCharacterSheetToStore(sheet) {
      if (!sheet) return;

      const character = sheet.character || sheet;
      const meta = sheet.metaData || {};

      // META DATA
      characterSheetUtils.metaData = {
        freeXP: meta.freeXP || 0,
        usedXP: meta.usedXP || 0,
        featXP: meta.featXP || 0,
        competencesXP: meta.competencesXP || 0,
        playerName: meta.playerName || "",
        campCost: meta.campCost || 100,
        skillCost: meta.skillCost || 30,
        specialityCost: meta.specialityCost || 10,
        comments: meta.comments || "",
        id: meta.id || null,
        specImagePath: meta.specImagePath || "",
        specShieldPath: meta.specShieldPath || "",
        magicXP: meta.magicXP || 0,
        martialXP: meta.martialXP || 0,
        skillCapMultiplier: meta.skillCapMultiplier || 5,
        characterType: meta.characterType || { label: "", xp: 0 },
      };

      // CHARACTER
      characterSheetUtils.character = {
        name: character.name || sheet.name || "",
        specie: this.extractSpecieName(character.specie || sheet.specie),
        age: character.age || sheet.age || 0,
        ageState: character.ageState || sheet.ageState || "Adulto",
        sex: character.sex || sheet.sex || "Masculino",
        regen: {
          life: character.regen?.life || sheet.regen?.life || 0,
          mana: character.regen?.mana || sheet.regen?.mana || 0,
          energy: character.regen?.energy || sheet.regen?.energy || 0,
        },
        camp: character.camp || sheet.camp || {},
        lang: {
          languages: this.extractLanguageNames(
            character.lang?.languages || sheet.lang?.languages || []
          ),
        },
      };

      // OTRAS LISTAS
      characterSheetUtils.competences = sheet.competences || [];
      characterSheetUtils.feats = sheet.feats || [];
      characterSheetUtils.unfeats = sheet.unfeats || [];
      characterSheetUtils.languages = sheet.languages || [];
      characterSheetUtils.spells = sheet.spells || [];
      characterSheetUtils.martials = sheet.martials || [];
      characterSheetUtils.speed = sheet.speed || 0;
    },

    // ==================== OTRAS OPERACIONES ====================

    async fetchCharacterSheets() {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/user-character-sheets`);
        this.characterSheets = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
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
        this.mapCharacterSheetToStore(response.data);
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
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
        this.error = error.response?.data?.message || error.message;
        console.error("❌ Error al obtener la ficha por nombre:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateCharacterSheet(id, updatedData) {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const payload = this.preparePayload();

        const response = await axios.put(
          `${URL}/user-character-sheets/${id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const index = this.characterSheets.findIndex((s) => s._id === id);
        if (index !== -1) {
          this.characterSheets[index] = response.data;
        }

        this.characterSheet = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error("❌ Error al actualizar la ficha:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCharacterSheet(id) {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${URL}/user-character-sheets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.characterSheets = this.characterSheets.filter((s) => s._id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error("❌ Error al eliminar la ficha:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
