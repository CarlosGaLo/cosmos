<template>
  <div>
    <h3 class="subheader">Wikis y Noticias</h3>
    <div id="article">
      <article
        v-for="article in globaFunction.getAllArticlesWiki"
        :key="article.id"
        class="article-item article-template"
      >
        <div class="image-wrap">
          <img :src="article.headerImg" :alt="article.imgAlt" />
        </div>
        <h4 class="article-title">{{ article.title }}</h4>
        <span class="date"> Hace {{ 1 }} día </span>
        <router-link :to="{ path: '/big/' + article.id }"
          >Saber más</router-link
        >
        <div class="aside-text" v-html="article.description"></div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { globalFunctions } from "@/store/globalFunctions";

const globaFunction = globalFunctions();

async function getArticlesNum(numArticles) {
  let newArticles = await globalFunctions().fetchNum(numArticles);
  globaFunction.changeArticles(newArticles);
}
// Vamos a mostrar, por defecto, 5 artículos en portada.
getArticlesNum(5);
</script>
