import { defineStore } from "pinia";
import axios from "axios";

const URL = process.env.VUE_APP_API_URL; // ej: http://localhost:3000/api

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || "Usuario",
    userEmail: (state) => state.user?.correoElectronico || "",
    userRol: (state) => state.user?.rol || "",
  },

  actions: {
    autoLogin() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token) {
        this.token = token;
      }

      if (user) {
        try {
          this.user = JSON.parse(user);
        } catch (e) {
          this.user = null;
        }
      }
    },

    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem("token");
    },

    setUser(userData) {
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },

    clearUser() {
      this.user = null;
      localStorage.removeItem("user");
    },

    logout() {
      this.clearToken();
      this.clearUser();
    },

    async fetchUserProfile() {
      this.loading = true;
      try {
        const response = await axios.get(`${URL}/user/perfil`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.user = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        this.error = error;
        console.error("❌ Error al obtener perfil:", error);
      } finally {
        this.loading = false;
      }
    },

    async loginUser(credentials) {
      this.loading = true;
      try {
        const response = await axios.post(`${URL}/auth/login`, credentials); // FIXED
        const { token, user } = response.data;

        this.setToken(token);
        this.setUser(user);

        return { success: true };
      } catch (error) {
        this.error = error;
        console.error("❌ Error al iniciar sesión:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Error",
        };
      } finally {
        this.loading = false;
      }
    },

    async registerUser(data) {
      this.loading = true;
      try {
        const response = await axios.post(`${URL}/auth/register`, data); // FIXED
        return { success: true, message: response.data.message };
      } catch (error) {
        this.error = error;
        return {
          success: false,
          message: error.response?.data?.message || "Error al registrar",
        };
      } finally {
        this.loading = false;
      }
    },
    async recoverPassword({ name, correoElectronico }) {
      this.loading = true;
      try {
        const { data } = await axios.post(URL + "/auth/recover-password", {
          name,
          correoElectronico,
        });
        this.loading = false;
        return {
          success: true,
          newPassword: data.newPassword,
          message: data.message,
        };
      } catch (err) {
        this.loading = false;
        return {
          success: false,
          message:
            err.response?.data?.message || "Error al restablecer la contraseña",
        };
      }
    },
  },
});
