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
        credentials: "include", // ← crucial
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Identifiants invalides");
      }
      await get().fetchUser();
      set({ isAuthenticated: true, isLoading: false });
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
        credentials: "include",
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
      await get().fetchUser();
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUser: async () => {
    try {
      const response = await fetch(`${API_URL}/me/`, {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        set({ user: userData, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetch(`${API_URL}/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
