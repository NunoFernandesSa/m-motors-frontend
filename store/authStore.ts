import { create } from "zustand";
import { API_URL } from "@/constants/api";
import { AuthState } from "@/types";
import { deleteCookie, setCookie } from "@/helpers";

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
      // Stock tokens on localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      // Stock tokens on cookies
      // 15 minutes
      setCookie("access_token", data.access, 15 * 60);
      // 7 days
      setCookie("refresh_token", data.refresh, 7 * 24 * 3600);
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
      // Stocker tokens on localStorage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      // Stock tokens on cookies
      // 15 minutes
      setCookie("access_token", data.access, 15 * 60);
      // 7 days
      setCookie("refresh_token", data.refresh, 7 * 24 * 3600);
      await get().fetchUser();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");
    const response = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) throw new Error("Refresh failed");
    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    setCookie("access_token", data.access, 15 * 60);
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
      setCookie("refresh_token", data.refresh, 7 * 24 * 3600);
    }
    return data.access;
  },

  fetchUser: async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const makeRequest = async (t: string) => {
      return fetch(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${t}` },
      });
    };

    try {
      let response = await makeRequest(token);
      if (response.status === 401) {
        try {
          const newToken = await get().refreshToken();
          response = await makeRequest(newToken);
        } catch (refreshError) {
          throw new Error("Refresh failed");
        }
      }
      if (response.ok) {
        const userData = await response.json();
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
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
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  initAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (token && !get().isAuthenticated) {
      await get().fetchUser();
    } else if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
