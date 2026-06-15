import { create } from "zustand";
import { API_URL } from "@/constants/api";
import { AuthState } from "@/types";

const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchWithCredentials(`${API_URL}/auth/login/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Identifiants invalides");
      }
      // backend set cookies, fetch user
      await get().fetchUser();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (username, email, password, password2) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchWithCredentials(`${API_URL}/auth/register/`, {
        method: "POST",
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
      await get().fetchUser();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  refreshToken: async () => {
    try {
      const response = await fetchWithCredentials(`${API_URL}/auth/refresh/`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Refresh failed");
      return true;
    } catch (error) {
      throw error;
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchWithCredentials(`${API_URL}/auth/me/`);
      if (response.status === 401) {
        // Refresh token if expired
        try {
          await get().refreshToken();
          // after refresh, fetch user
          const retryResponse = await fetchWithCredentials(
            `${API_URL}/auth/me/`,
          );
          if (!retryResponse.ok) throw new Error("Not authenticated");
          const userData = await retryResponse.json();
          set({ user: userData, isAuthenticated: true, isLoading: false });
          return;
        } catch (refreshError) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
      }
      if (!response.ok) throw new Error("Not authenticated");
      const userData = await response.json();
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await fetchWithCredentials(`${API_URL}/auth/logout/`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    // Cookies are deleted by the backend
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initAuth: async () => {
    if (!get().isAuthenticated) {
      await get().fetchUser();
    }
  },
}));
