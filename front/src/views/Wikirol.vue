<template>
  <div class="navigation-container">
    <div class="header">
      <h1>Cosmos Rol</h1>
      <p>
        Explora un universo de rol con herramientas avanzadas para creación de
        personajes, lore detallado y reglas accesibles.
      </p>
    </div>

    <nav class="routes">
      <h2>📜 Secciones Principales</h2>
      <ul>
        <li v-for="route in routes" :key="route.path">
          <router-link :to="route.path">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>

    <div class="youtube-section">
      <h2>Síguenos en YouTube</h2>
      <a
        href="https://www.youtube.com/@cosmosrol"
        target="_blank"
        class="youtube-button"
      >
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/wW2WyAZrcag?si=xw_WoyyLAws-oXUP"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </a>
    </div>
  </div>
</template>

<script setup>
const routes = [
  { name: "Creación de Fichas", path: "/characterSheet" },
  { name: "Reglas y Mecánicas", path: "/rules" },
  { name: "Hechizos", path: "/spell" },
  //   { name: "Enciclopedia", path: "/enciclopedia" },
  //   { name: "Foro de la Comunidad", path: "/foro" },
  { name: "Contacto", path: "/contacto" },
];
</script>

<style scoped>
.navigation-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  background: var(--color-light-white);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 32px;
  color: var(--color-medium-blue);
}

.header p {
  font-size: 18px;
  color: var(--color-dark-blue);
}

.routes {
  margin-top: 20px;
}

.routes h2 {
  font-size: 24px;
  color: var(--color-medium-blue);
}

.routes ul {
  list-style: none;
  padding: 0;
}

.routes li {
  margin: 10px 0;
}

.routes a {
  font-size: 18px;
  text-decoration: none;
  color: var(--color-dark-blue);
  transition: color 0.3s ease-in-out;
}

.routes a:hover {
  color: var(--color-medium-blue);
}

.youtube-section {
  margin-top: 30px;
}

.youtube-button {
  display: inline-block;
  padding: 12px 20px;
  background: #ff0000;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s;
}

.youtube-button:hover {
  background: #cc0000;
}
</style>
