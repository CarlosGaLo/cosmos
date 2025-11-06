import { defineStore } from "pinia";
import axios from "axios";

export const publisherStore = defineStore("publisherStore", {
  state: () => {
    return {
      SERVER: process.env.VUE_APP_API_URL.replace('/api', '') + "/articles",
    };
  },
  getters: {},
  actions: {
    async saveArticle(
      title,
      origin,
      editor,
      createdDate,
      headerImage,
      baseDescription
    ) {
      if (!title || !origin || !editor) {
        throw new Error(
          "Error saving article, one field is empty. PublisherStore.js"
        );
      }
      
      try {
        const response = await axios.post(this.SERVER, {
          name: title,
          ttrpg: origin,
          text: editor,
          lastModification: createdDate,
          imageURL: headerImage,
          resume: baseDescription,
          type: "NPC",
          lastUserModifier: "Jarko",
        });

        if (response.status !== 201) {
          throw new Error("Error saving article");
        }

        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Error saving article");
      }
    },
    async getArticleById(id) {
      try {
        const response = await axios.get(`${this.SERVER}/${id}`);

        // Si el servidor devuelve un estado diferente de 200, lanzaremos un error
        if (response.status !== 200) {
          throw new Error(
            "Error fetching article, review PublisherStore - != 200 - getArticleById"
          );
        }

        return response.data;
      } catch (error) {
        console.error(response.data);
        throw new Error(
          "Error fetching article, review PublisherStore - CATCH getArticleById"
        );
      }
    },
    async getArticleByTitle(title) {
      try {
        const response = await axios.get(`${this.SERVER}/${title}`);

        // Si el servidor devuelve un estado diferente de 200, lanzaremos un error
        if (response.status !== 200) {
          throw new Error("Error fetching article");
        }

        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching article");
      }
    },
    async updateArticle(id, title, origin, newText, description, image) {
      let tempArticle = null;
      if (!id || !title)
        throw new Error(
          "Error updating article, one or more fields are empty. PublisherStore.js"
        );
      tempArticle = {
        origin: origin,
        textArticle: newText,
        description: description,
        image: image,
        title: title,
      };
      try {
        const response = await axios.patch(`${this.SERVER}/${id}`, {
          articleText: tempArticle.textArticle,
          description: tempArticle.description,
          headerImg: tempArticle.image,
          title: tempArticle.title,
        });

        // Si el servidor devuelve un estado diferente de 200, lanzaremos un error
        if (response.status !== 200) {
          throw new Error("Error updating article");
        }

        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Error updating article");
      }
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "allArticlesWiki",
        storage: localStorage,
      },
    ],
  },
});
