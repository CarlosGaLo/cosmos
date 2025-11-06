import { defineStore } from "pinia";
import human from "../dataBase/characterTemplates/human.json";

export const characterDataBase = defineStore("characterDataBase", {
  state: () => {
    return {
      competence: {
        id: 0,
        name: "0",
        description: "0",
        requisites: {},
        isAdquired: false,
      },
      competenceList: [],
    };
  },
  getters: {},
  actions: {
    async getAllCompetences() {
      try {
        const response = await fetch(`${API_URL}/competences/all`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de competencias");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error al obtener los datos de competencias:", error);
        return null;
      }
    },
    async getAllFeats() {
      try {
        const response = await fetch(`${API_URL}/feats/`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de feats");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error al obtener los datos de competencias:", error);
        return null;
      }
    },
    async getAllUnfeats() {
      try {
        const response = await fetch(`${API_URL}/unfeats/`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de competencias");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error al obtener los datos de competencias:", error);
        return null;
      }
    },
    getAllAdquiredCompetences() {
      return human;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "characterDataBase",
        storage: localStorage,
      },
    ],
  },
});
