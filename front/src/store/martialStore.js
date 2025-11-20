import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "https://localhost:3100/api";

export const useMartialStore = defineStore("martialStore", {
  state: () => ({
    martials: [],
    martial: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 📥 Recuperar todos los Martials
    async fetchMartials() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/martials`);
        this.martials = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },

    // 📥 Recuperar un Martial por ID
    async fetchMartial(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/martials/${id}`);
        this.martial = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },

    // ➕ Crear un nuevo Martial
    async createMartial(newMartial) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/martials`, newMartial);
        this.martials.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },

    // ✏️ Editar un Martial existente
    async updateMartial(id, updatedMartial) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `${API_URL}/martials/${id}`,
          updatedMartial
        );
        const index = this.martials.findIndex((m) => m._id === id);
        if (index !== -1) {
          this.martials[index] = { ...this.martials[index], ...updatedMartial };
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },

    // ❌ Eliminar un Martial por ID
    async deleteMartial(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/martials/${id}`);
        this.martials = this.martials.filter((m) => m._id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
