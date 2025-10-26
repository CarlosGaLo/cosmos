<template>
  <div class="register-container">
    <h2>Registro</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="Nombre" required />
      <input v-model="correoElectronico" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Registrarse</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const name = ref("");
const correoElectronico = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  const result = await userStore.registerUser({ name: name.value, correoElectronico: correoElectronico.value, password: password.value });
  if (result.success) {
    router.push("/login");
  } else {
    error.value = result.message;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
</style>
