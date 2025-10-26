<template>
  <div class="recover-container">
    <h2>Recuperar contraseña</h2>
    <form @submit.prevent="handleRecover" v-if="!newPassword">
      <input
        v-model="name"
        type="text"
        placeholder="Nombre de usuario"
        required
      />
      <input
        v-model="correoElectronico"
        type="email"
        placeholder="Correo electrónico"
        required
      />
      <button type="submit" :disabled="userStore.loading">
        Generar nueva contraseña
      </button>
    </form>

    <div v-else class="result">
      <p>Tu nueva contraseña es:</p>
      <p class="new-pass">{{ newPassword }}</p>
      <p class="info">
        Copia y guárdala en un lugar seguro. Podrás volver a iniciarla sesión
        con ella.
      </p>
      <router-link to="/login">← Volver al login</router-link>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const name = ref("");
const correoElectronico = ref("");
const newPassword = ref("");
const error = ref("");

const router = useRouter();
const userStore = useUserStore();

const handleRecover = async () => {
  error.value = "";
  const result = await userStore.recoverPassword({
    name: name.value,
    correoElectronico: correoElectronico.value,
  });
  if (result.success) {
    newPassword.value = result.newPassword;
  } else {
    error.value = result.message;
  }
};
</script>

<style scoped>
.recover-container {
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
.result {
  margin-top: 20px;
}
.new-pass {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}
.info {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
