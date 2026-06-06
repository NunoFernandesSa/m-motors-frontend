import { create } from "zustand";
import { API_URL } from "@/constants/api";
import { AuthState } from "@/types";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Identifiants invalides");
      }
      // Stocker les tokens dans localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      await get().fetchUser();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (username, email, password, password2) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2 }),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMsg = "L'inscription a échoué";
        if (typeof data === "object") {
          if (data.username) errorMsg = data.username.join(", ");
          else if (data.email) errorMsg = data.email.join(", ");
          else if (data.password) errorMsg = data.password.join(", ");
          else if (data.non_field_errors)
            errorMsg = data.non_field_errors.join(", ");
          else if (data.detail) errorMsg = data.detail;
        }
        throw new Error(errorMsg);
      }
      // Stocker les tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      await get().fetchUser();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        // Token invalide ou expiré
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Appel au backend pour invalider (optionnel)
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
