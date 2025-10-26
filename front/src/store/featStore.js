import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000/api"; // Usa la variable de entorno

export const useFeatStore = defineStore("featStore", {
  state: () => ({
    feats: [],
    feat: null,
    unfeats: [],
    unfeat: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 📌 Obtener todas las feats y unfeats
    async fetchFeats() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/feats`);
        const responseUnfeat = await axios.get(`${API_URL}/unfeats`);
        this.feats = response.data;
        this.unfeats = responseUnfeat.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener feats/unfeats:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener una feat por ID
    async fetchFeat(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/feats/${id}`);
        this.feat = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener feat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener un unfeat por ID
    async fetchUnfeat(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/unfeats/${id}`);
        this.unfeat = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener unfeat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Crear una nueva feat
    async createFeat(feat) {
      this.loading = true;
      try {
        const response = await axios.post(`${API_URL}/feats`, feat);
        this.feats.push(response.data);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al crear feat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Crear un nuevo unfeat
    async createUnfeat(unfeat) {
      this.loading = true;
      try {
        const response = await axios.post(`${API_URL}/unfeats`, unfeat);
        this.unfeats.push(response.data);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al crear unfeat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Actualizar una feat por ID
    async updateFeat(id, updatedFeat) {
      this.loading = true;
      try {
        await axios.put(`${API_URL}/feats/${id}`, updatedFeat);
        const index = this.feats.findIndex((f) => f._id === id);
        if (index !== -1) {
          this.feats[index] = { ...this.feats[index], ...updatedFeat };
        }
      } catch (error) {
        this.error = error;
        console.error("❌ Error al actualizar feat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Actualizar un unfeat por ID
    async updateUnfeat(id, updatedUnfeat) {
      this.loading = true;
      try {
        await axios.put(`${API_URL}/unfeats/${id}`, updatedUnfeat);
        const index = this.unfeats.findIndex((u) => u._id === id);
        if (index !== -1) {
          this.unfeats[index] = { ...this.unfeats[index], ...updatedUnfeat };
        }
      } catch (error) {
        this.error = error;
        console.error("❌ Error al actualizar unfeat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Eliminar una feat por ID
    async deleteFeat(id) {
      this.loading = true;
      try {
        await axios.delete(`${API_URL}/feats/${id}`);
        this.feats = this.feats.filter((f) => f._id !== id);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al eliminar feat:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Eliminar un unfeat por ID
    async deleteUnfeat(id) {
      this.loading = true;
      try {
        await axios.delete(`${API_URL}/unfeats/${id}`);
        this.unfeats = this.unfeats.filter((u) => u._id !== id);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al eliminar unfeat:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
