<template>
  <div class="dashboard">
    <h2>Bienvenido, {{ userName }}</h2>
    <p>Esta vista solo es visible si estás logueado.</p>
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();
const { userName } = storeToRefs(userStore);

const logout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}
</style>
