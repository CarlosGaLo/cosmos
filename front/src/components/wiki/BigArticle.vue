<template>
  <p class="big-article" v-html="nowArticle.name"></p>
  <div>
    <p class="white-space" v-html="nowArticle.text"></p>
  </div>
  <div class="clearfix"></div>
</template>

<script setup>
import { globalFunctions } from "@/store/globalFunctions";
import { useRoute } from "vue-router";
import { ref } from "vue";

let urlID = useRoute().path;
let nowArticle = ref([]);

function returnID(routeLong) {
  return routeLong.slice(5);
}

async function getArticle() {
  nowArticle.value = await globalFunctions().fetchOne(returnID(urlID));
}

getArticle();
</script>

<style>
.big-article {
  margin: 0 auto;
  width: 90%;
  text-align: justify;
  font-size: 18px;
}

#to-home {
  margin: 15px;
}

.white-space {
  white-space: pre-line;
}
</style>
