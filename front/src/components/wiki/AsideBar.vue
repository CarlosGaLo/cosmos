<template>
  <div class="center">
    <section id="content">
      <ArticleWiki></ArticleWiki>
    </section>
    <aside id="sidebar">
      <div id="nav-blog" class="sidebar-item">
        <h3>Artículos creados</h3>
        <a href="#" class="btn btn-success">Mirar catálogo</a>
      </div>

      <SearchBar></SearchBar>
    </aside>

    <div class="clearfix"></div>
  </div>
</template>

<script>
import ArticleWiki from "../wiki/ArticleWiki.vue";
import SearchBar from "../wiki/SearchBar.vue";

export default {
  components: {
    ArticleWiki: ArticleWiki,
    SearchBar
},
};
</script>
