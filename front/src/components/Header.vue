<template>
  <header class="header">
    <a class="logo-link" href="/">
      <img class="logo-size" src="@/assets/Logo_Cosmos_Rol_lite.png" alt="Cosmos Rol Logo" />
      <h2 class="logo-letter">Cosmos Rol</h2>
    </a>

    <button
      class="menu-toggle"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle menu"
    >
      <span class="menu-icon" :class="{ open: isMenuOpen }"></span>
      <span class="menu-icon" :class="{ open: isMenuOpen }"></span>
      <span class="menu-icon" :class="{ open: isMenuOpen }"></span>
    </button>

    <nav :class="{ 'menu-open': isMenuOpen }" class="menu">
      <router-link class="router-link" to="/wiki" @click="closeMenu">Wiki-Rol</router-link>
      <router-link class="router-link" to="/characterSheet" @click="closeMenu">Personaje</router-link>
      <router-link class="router-link" to="/creature" @click="closeMenu">Criaturas</router-link>
      <router-link class="router-link" to="/spell" @click="closeMenu">Magia</router-link>
      <router-link class="router-link" to="/rules" @click="closeMenu">Reglas</router-link>
      <router-link class="router-link" to="/initiative" @click="closeMenu">Iniciativa</router-link>

      <div v-if="!isAuthenticated" class="auth-link">
        <router-link class="router-link" to="/login" @click="closeMenu">Iniciar sesión</router-link>
      </div>

      <!-- NUEVO MENÚ USUARIO CON CLICK OUTSIDE -->
      <div class="user-menu-wrapper" ref="userMenuRef" v-else>
        <button class="router-link user-button" @click="toggleUserMenu">
          {{ userName }} ▾
        </button>
        <transition name="fade">
          <div v-if="userMenuOpen" class="user-menu-dropdown">
            <router-link to="/dashboard" class="dropdown-item" @click="closeMenu">Dashboard</router-link>
            <button @click="handleLogout" class="dropdown-item">Cerrar sesión</button>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();
const { isAuthenticated, userName } = storeToRefs(userStore);

const isMenuOpen = ref(false);
const userMenuOpen = ref(false);
const userMenuRef = ref(null);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
  userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const handleLogout = () => {
  userStore.logout();
  closeMenu();
  router.push("/login");
};

// Detectar click fuera del menú
const handleClickOutside = (event) => {
  if (userMenuOpen.value && userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>



<style scoped>
/* MISMO ESTILO ANTERIOR + NUEVO DROPDOWN */
.header {
  height: 88px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(179, 178, 165, 0) 0%, rgba(252, 243, 213, 0.308) 92%, rgba(179, 178, 165, 0.622) 100%);
  position: relative;
  z-index: 10;
}

.logo-link {
  display: flex;
  align-items: center;
}
.logo-size {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}
.logo-letter {
  letter-spacing: 3.2px;
  text-transform: uppercase;
  font-family: "FedraStdMedium";
  color: var(--color-dark-blue);
}

.menu {
  display: flex;
  gap: 20px;
  align-items: center;
}
.router-link {
  color: var(--color-light-blue);
  text-decoration: none;
  font-family: "FedraStdBook";
  transition: color 0.2s ease;
}
.router-link:hover {
  color: var(--color-medium-blue);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 30;
  text-align: -webkit-right;
}
.menu-icon {
  width: 30px;
  height: 3px;
  margin-bottom: 3px;
  background-color: var(--color-dark-blue);
  display: block;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 2px;
}
.menu-icon::before,
.menu-icon::after {
  content: "";
  width: 30px;
  height: 3px;
  background-color: var(--color-dark-blue);
  position: absolute;
  transition: all 0.3s ease;
  border-radius: 2px;
}
.menu-icon::before {
  transform: translateY(-9px);
}
.menu-icon::after {
  transform: translateY(9px);
}
.menu-icon.open {
  opacity: 40%;
  width: 15px;
}
.menu-icon.open:nth-child(1) {
  opacity: 50%;
}
.menu-icon.open:nth-child(2) {
  opacity: 20%;
  width: 10px;
}
.menu-icon.open:nth-child(3) {
  opacity: 50%;
}

.auth-link {
  margin-left: 20px;
}
.user-menu-wrapper {
  position: relative;
}
.user-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: "FedraStdBook";
  font-size: 16px;
  color: var(--color-light-blue);
}
.user-menu-dropdown {
  position: fixed; /* antes: absolute */
  top: 88px; /* igual al height del header */
  right: 20px; /* alineado con padding del header */
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ccc;
  border-radius: 8px;
  min-width: 160px;
  z-index: 999;
  padding: 8px 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
}
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  background: none;
  border: none;
  font-family: "FedraStdBook";
  font-size: 14px;
  color: var(--color-dark-blue);
  cursor: pointer;
  text-decoration: none;
}
.dropdown-item:hover {
  background-color: #eee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .menu {
    flex-direction: column;
    background: rgb(179, 178, 165, 0.98);
    position: fixed;
    top: 88px;
    right: 0;
    width: 200px;
    height: calc(100vh - 88px);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    padding-top: 20px;
    z-index: 25;
  }
  .menu-open {
    transform: translateX(0);
  }
  .menu a {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    text-align: center;
  }
  .menu-toggle {
    display: block;
  }
}
</style>
