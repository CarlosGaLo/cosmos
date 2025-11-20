import { defineStore } from "pinia";
import axios from "axios";

const API_URL = process.env.VUE_APP_API_URL || "https://localhost:3100/api";

export const useCreaturesStore = defineStore("creaturesStore", {
  state: () => ({
    creatures: [],
    creature: null,
    abilities: [],
    ability: null,
    bodyParts: [],
    bodyPart: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 📌 Obtener todas las criaturas, habilidades y partes del cuerpo
    async fetchCreatures() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/creatures`);
        this.creatures = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener criaturas:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Obtener una criatura, habilidad o parte del cuerpo por ID
    async fetchCreature(id) {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/creatures/${id}`);
        this.creature = response.data;
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener criatura:", error);
      } finally {
        this.loading = false;
      }
    },

    // 📌 Crear una nueva criatura, habilidad o parte del cuerpo
    async createCreature(creature) {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("name", creature.name);
        formData.append("habitat", JSON.stringify(creature.habitat));
        formData.append("bodyParts", JSON.stringify(creature.bodyParts));
        formData.append("camps", JSON.stringify(creature.camps));
        formData.append("turn", creature.turn);
        formData.append("damage", creature.damage);

        if (creature.image && creature.image instanceof File) {
          formData.append("image", creature.image); // ✅ Enviar archivo correctamente
        }

        const response = await axios.post(`${API_URL}/creatures`, formData, {
          headers: { "Content-Type": "multipart/form-data" }, // ✅ Indicar a Axios que envía FormData
        });

        this.creatures.push(response.data);
      } catch (error) {
        console.error("❌ Error al crear criatura:", error);
      } finally {
        this.loading = false;
      }
    },
    // 📌 Actualizar una criatura, habilidad o parte del cuerpo
    async updateCreature(id, updatedCreature) {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("name", updatedCreature.name);
        formData.append("habitat", JSON.stringify(updatedCreature.habitat));
        formData.append("bodyParts", JSON.stringify(updatedCreature.bodyParts));
        formData.append("camps", JSON.stringify(updatedCreature.camps));
        formData.append("turn", updatedCreature.turn);
        formData.append("damage", updatedCreature.damage);

        // ✅ Enviar la imagen si es un archivo nuevo
        if (updatedCreature.image && updatedCreature.image instanceof File) {
          formData.append("image", updatedCreature.image);
        }

        const response = await axios.put(
          `${API_URL}/creatures/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }, // ✅ Importante para enviar archivos
          }
        );

        const index = this.creatures.findIndex((c) => c._id === id);
        if (index !== -1) {
          this.creatures[index] = {
            ...this.creatures[index],
            ...response.data,
          };
        }
      } catch (error) {
        this.error = error;
        console.error("❌ Error al actualizar criatura:", error);
      } finally {
        this.loading = false;
      }
    },
    // 📌 Eliminar una criatura, habilidad o parte del cuerpo por ID
    async deleteCreature(id) {
      this.loading = true;
      try {
        await axios.delete(`${API_URL}/creatures/${id}`);
        this.creatures = this.creatures.filter((c) => c._id !== id);
      } catch (error) {
        this.error = error;
        console.error("❌ Error al eliminar criatura:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
