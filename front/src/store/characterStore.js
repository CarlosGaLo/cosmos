import { defineStore } from "pinia";
import axios from "axios";
import { characterFunctions } from "@/store/characterSheet";
import { globalFunctions } from "@/store/globalFunctions";

const URL = process.env.VUE_APP_API_URL;

const characterSheet = characterFunctions();
const functions = globalFunctions();

export const useCharacterStore = defineStore("characterStore", {
  state: () => ({
    characters: [],
    character: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCharacters() {
      this.loading = true;
      try {
        const response = await axios.get(URL + "/api/characters");
        this.characters = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCharacter(id) {
      this.loading = true;
      try {
        const response = await axios.get(URL + `/api/characters/${id}`);
        this.character = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCharacterByName(name) {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/api/characters/name/${name}`);
        this.character = response.data;
        this.character.specie = this.character.specie.name;
        characterSheet.character = this.character;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener el personaje:", error);
      } finally {
        this.loading = false;
      }
    },

    async createCharacter(character) {
      this.loading = true;
      try {
        const response = await axios.post(URL + "/api/characters", character);
        this.characters.push(response.data);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async updateCharacter(id, updatedCharacter) {
      this.loading = true;
      try {
        await axios.put(URL + `/api/characters/${id}`, updatedCharacter);
        const index = this.characters.findIndex((c) => c._id === id);
        if (index !== -1) {
          this.characters[index] = {
            ...this.characters[index],
            ...updatedCharacter,
          };
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCharacter(id) {
      this.loading = true;
      try {
        await axios.delete(URL + `/api/characters/${id}`);
        this.characters = this.characters.filter((c) => c._id !== id);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async saveCharacter(characterData) {
      for (const key in characterData) {
        if (typeof characterData[key] === "string") {
          characterData[key] = globalFunctions().normalizeString(
            characterData[key]
          );
        }
      }
      try {
        // Procesar el objeto para que cumpla con el schema de Mongoose
        const processedData = {
          name: characterData.name,
          specie: characterData.specie,
          age: characterData.age,
          ageState: characterData.ageState || "Adulto",
          sex: characterData.sex || "Masculino",
          specie: characterData.specie,
          regen: {
            life: characterData.regen?.life || 0,
            mana: characterData.regen?.mana || 0,
            energy: characterData.regen?.energy || 0,
          },
          camp: {
            art: characterData.camp?.art || null,
            cul: characterData.camp?.cul || null,
            mov: characterData.camp?.mov || null,
            sob: characterData.camp?.sob || null,
            sup: characterData.camp?.sup || null,
            vig: characterData.camp?.vig || null,
          },
          lang: {
            languages: characterData.languages || [],
          },
        };

        // Enviar datos al backend usando Axios
        const response = await axios.post(
          `http://localhost:3000/api/characters`,
          processedData
        );
      } catch (error) {
        console.error("❌ Error al guardar el personaje:", error);
      }
    },
  },
});
