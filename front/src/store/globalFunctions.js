import { defineStore } from "pinia";
import axios from "axios";

//const SERVER_URL = "http://79.145.17.100:8080"; // URL Java server
const SERVER_URL = "http:///localhost:3000"; // URL NODE server

export const globalFunctions = defineStore("allArticlesWiki", {
  state: () => {
    return { allArticlesWiki: null };
  },
  getters: {
    getAllArticlesWiki() {
      return this.allArticlesWiki;
    },
  },
  actions: {
    normalizeString(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    async getArticle(name) {
      let article = {};
      const response = await axios.get(`${SERVER_URL}/article/${name}`, {
        params: {},
      });
      article = response.data;
      return article;
    },
    UpdateMainArticles(articlesArray) {
      this.allArticlesWiki = articlesArray;
    },
    changeArticles(articlesArray) {
      this.allArticlesWiki = articlesArray;
    },
    async manualSearch(column, keyWord) {
      if (!isNaN(keyWord)) {
        const response = await axios.get(`${SERVER_URL}/articles/search`, {
          params: {
            id: keyWord,
          },
        });
        return response.data;
      } else {
        const response = await axios.get(`${SERVER_URL}/articles/search`, {
          params: {
            column: column,
            keyword: keyWord,
          },
        });
        return response.data;
      }
    },
    async fetchOne(ids) {
      const response = await axios.get(`${SERVER_URL}/articles/${ids}`);
      return response.data;
    },
    async fetchAll() {
      const response = await axios.get(`${SERVER_URL}/articles/All`);
      this.article = response.data;
      return response.data;
    },
    async fetchNum(numArticles) {
      const response = await axios.get(
        `${SERVER_URL}/Article/get/${numArticles}`
      );
      this.article = response.data;
      return response.data;
    },
    async fetchCosmosAll() {
      const response = await axios.get(`${SERVER_URL}/Article/All`, {
        params: {
          game_origin: "Cosmos Rol",
        },
      });
      this.article = response.data;
      return response.data;
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
