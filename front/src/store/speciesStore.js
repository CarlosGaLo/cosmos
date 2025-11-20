import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "https://79.145.123.81:3100/api";

const SERVER_URL = process.env.VUE_APP_API_URL?.includes("http")
  ? process.env.VUE_APP_API_URL
  : `${window.location.protocol}//${window.location.hostname}:3100${process.env.VUE_APP_API_URL}`;

export const useSpeciesStore = defineStore("speciesStore", {
  state: () => ({
    species: [],
    currentSpecie: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSpecieByName(name) {
      this.loading = true;
      this.error = null;
      try {
        const url = `${SERVER_URL}/species/${name}`;
        const response = await axios.get(url);
        this.currentSpecie = response.data;
        return response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
