<template class="fill-web-page">
  <Header />
  <figure class="borders">
    <RouterView />
  </figure>
  <FooterBar />
</template>

<script setup>
import Header from "./components/Header.vue";
import FooterBar from "./components/wiki/FooterBar.vue";
import FeatList from "./components/sheetComponent/pieces/FeatList.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const router = useRouter();
const userStore = useUserStore();
const { userName } = storeToRefs(userStore);

onMounted(() => {
  userStore.autoLogin();
});

const logout = () => {
  userStore.logout();
  router.push("/login");
};

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fill-web-page {
  margin: 0;
  padding: 0;
  min-height: 100%;
}

.borders {
  margin: 0 var(--margin-general);
}

@media (max-width: 1000px) {
  .borders {
    margin: 0 var(--margin-responsive);
  }
}

@import "./assets/css/styles.css";
</style>
