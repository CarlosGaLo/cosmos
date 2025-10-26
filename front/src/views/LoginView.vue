<template>
  <div class="login-container">
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="handleLogin">
      <input
        v-model="correoElectronico"
        type="email"
        placeholder="Correo electrónico"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit" :disabled="userStore.loading">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <p class="aux-links">
      <router-link to="/recover-password" class="recover-link">
        ¿Olvidaste tu contraseña?
      </router-link>
      |
      <router-link to="/signin" class="signup-link">
        ¿No tienes cuenta? Regístrate
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const correoElectronico = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  error.value = "";
  const result = await userStore.loginUser({
    correoElectronico: correoElectronico.value,
    password: password.value,
  });

  if (result.success) {
    router.push("/dashboard");
  } else {
    error.value = result.message || "Login fallido";
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}
button {
  padding: 10px 20px;
  background-color: var(--color-dark-blue, #334);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: var(--color-medium-blue, #445);
}
button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 10px;
}
.aux-links {
  margin-top: 16px;
  font-size: 14px;
}
.recover-link,
.signup-link {
  color: var(--color-medium-blue, #445);
  text-decoration: underline;
}
</style>
