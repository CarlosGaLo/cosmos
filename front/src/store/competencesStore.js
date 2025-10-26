import { defineStore } from "pinia";
import axios from "axios";
import { characterFunctions } from "@/store/characterSheet";
import { globalFunctions } from "@/store/globalFunctions";

const URL = process.env.VUE_APP_API_URL;

const characterSheet = characterFunctions();
const functions = globalFunctions();

export const useCompetencesStore = defineStore("competencesStore", {
  state: () => ({
    competences: [],
    competence: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 📌 Obtener todas las competencias
    async fetchCompetences() {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/competences`);
        this.competences = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener competencias:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener una competencia por ID
    async fetchCompetenceById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/competences/${id}`);
        this.competence = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener la competencia:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener una competencia por nombre
    async fetchCompetenceByName(name) {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/competences/name/${name}`);
        this.competence = response.data;
        characterSheet.character.competences = this.competence;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener la competencia:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Crear una nueva competencia
    async createCompetence(competenceData) {
      this.loading = true;
      try {
        const response = await axios.post(
          `${URL}/competences`,
          competenceData
        );
        this.competences.push(response.data);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al crear la competencia:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Actualizar una competencia por ID
    async updateCompetence(id, updatedCompetence) {
      this.loading = true;
      try {
        await axios.put(`${URL}/competences/${id}`, updatedCompetence);
        const index = this.competences.findIndex((c) => c._id === id);
        if (index !== -1) {
          this.competences[index] = {
            ...this.competences[index],
            ...updatedCompetence,
          };
        }
      } catch (error) {
        this.error = error;
        console.error("❌ Error al actualizar la competencia:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Eliminar una competencia por ID
    async deleteCompetence(id) {
      this.loading = true;
      try {
        await axios.delete(`${URL}/competences/${id}`);
        this.competences = this.competences.filter((c) => c._id !== id);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al eliminar la competencia:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Guardar una competencia con normalización de datos
    async saveCompetence(competenceData) {
      for (const key in competenceData) {
        if (typeof competenceData[key] === "string") {
          competenceData[key] = functions.normalizeString(competenceData[key]);
        }
      }

      try {
        const processedData = {
          name: competenceData.name,
          description: competenceData.description || "Sin descripción",
          level: competenceData.level || 1,
          type: competenceData.type || "General",
        };

        const response = await axios.post(
          `${URL}/competences`,
          processedData
        );
      } catch (error) {
        console.error("❌ Error al guardar la competencia:", error);
      }
    },
  },
});
