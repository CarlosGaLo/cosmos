import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000";

export const useRulesStore = defineStore("rules", {
  state: () => ({
    rules: [],
    selectedRule: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 📌 Obtener TODAS las reglas con filtros opcionales
    async fetchAllRules(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/rules`, {
          params: filters,
        });
        this.rules = response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Error al obtener las reglas";
        console.error("❌ fetchAllRules Error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener una regla por ID o por sID
    async fetchRuleByIdOrName(idOrName) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/rules/${idOrName}`);
        this.selectedRule = response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Error al obtener la regla";
        console.error("❌ fetchRuleByIdOrName Error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Crear una nueva regla
    async createRule(ruleData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/rules`, ruleData);
        this.rules.push(response.data);
      } catch (error) {
        this.error = error.response?.data?.message || "Error al crear la regla";
        console.error("❌ createRule Error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Actualizar una regla por ID
    async updateRule(id, updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_URL}/rules/${id}`, updatedData);
        const index = this.rules.findIndex((rule) => rule._id === id);
        if (index !== -1) this.rules[index] = response.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Error al actualizar la regla";
        console.error("❌ updateRule Error:", this.error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Eliminar una regla por ID
    async deleteRule(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/rules/${id}`);
        this.rules = this.rules.filter((rule) => rule._id !== id);
      } catch (error) {
        this.error =
          error.response?.data?.message || "Error al eliminar la regla";
        console.error("❌ deleteRule Error:", this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
