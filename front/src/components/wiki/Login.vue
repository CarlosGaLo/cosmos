<template>
  <div>
    <div id="login-warning">
      <p>
        Advertencia: Solo puedes tener una cuenta si el administrador de la web
        te crea una. Si no tienes cuenta y quieres una usa el formulario de
        contacto.
      </p>
    </div>
    <form id="login-card" @submit.prevent="login">
      <p>E-mail</p>
      <input
        type="email"
        name="email"
        id="3"
        class="contacto"
        v-model="email"
      />
      <p>Contraseña</p>
      <input type="password" v-model="password" />
      <button class="btnPrimary" type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
</script>
<style scoped>
</style>
