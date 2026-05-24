import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken });
      },

      logout: async () => {
        // Optionnel : appeler backend pour blacklister le refresh token
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      },

      login: async (username, password) => {
        const response = await api.post("/auth/login/", {
          username,
          password,
        });
        const { access, refresh } = response.data;
        // Décoder le token pour récupérer le nom d'utilisateur et les groupes
        const decoded = jwtDecode(access);
        const user = {
          username: decoded.username,
          groups: decoded.groups || [], // à ajuster selon ton payload JWT
        };
        set({ user, accessToken: access, refreshToken: refresh });
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        return response;
      },

      fetchUser: async () => {
        try {
          const response = await api.get("/auth/me/");
          set({ user: response.data });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      getStorage: () => localStorage, // localStorage for persistence (default: localStorage)
    },
  ),
);

export default useAuthStore;
