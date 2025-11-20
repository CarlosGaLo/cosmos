import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "https://localhost:3100/api";

export const useSpellStore = defineStore("spellStore", {
  state: () => ({
    spells: [],
    spell: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSpells() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/spells`);
        this.spells = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchSpell(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/spells/${id}`);
        this.spell = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async createSpell(spell) {
      this.loading = true;
      try {
        const response = await axios.post(`${API_URL}/spells`, spell);
        this.spells.push(response.data);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async updateSpell(id, updatedSpell) {
      this.loading = true;
      try {
        await axios.put(`${API_URL}/spells/${id}`, updatedSpell);
        const index = this.spells.findIndex((s) => s._id === id);
        if (index !== -1) {
          this.spells[index] = { ...this.spells[index], ...updatedSpell };
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSpell(id) {
      this.loading = true;
      try {
        await axios.delete(`${API_URL}/spells/${id}`);
        this.spells = this.spells.filter((s) => s._id !== id);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
