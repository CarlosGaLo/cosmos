<template>
  <div>
    <div id="search" class="sidebar-item">
      <h3>Buscador</h3>
      <p>¿Qué andas buscando?</p>
      <div action="">
        <input @click="completeSearch" v-model="inputSearch" type="text" name="search" />
        <input type="button" name="submit" value="Buscar" class="btn" @click="completeSearch" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { globalFunctions } from "@/store/globalFunctions";
const inputSearch = ref("");

async function completeSearch() {
  let arrayId = await globalFunctions().manualSearch("id", inputSearch.value);
  let arrayTitle = await globalFunctions().manualSearch("title", inputSearch.value);
  let descriptionTitle = await globalFunctions().manualSearch(
    "description",
    inputSearch.value
  );
  let completeArray = [];



  completeArray = descriptionTitle.concat(arrayTitle, arrayId);

  let filteredArray = [];

  for (let i = 0; i < completeArray.length; i++) {
    if (completeArray[i]) {
      filteredArray.push(completeArray[i].id);
    }
  }

  filteredArray = [...new Set(filteredArray)];

  const finalArray = await globalFunctions().getArticle(filteredArray);
  globalFunctions().UpdateMainArticles(finalArray);
}
</script>