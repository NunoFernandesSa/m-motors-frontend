import { create } from "zustand";
import { API_URL } from "@/constants/api";
import { AuthState } from "@/types";

// Raw fetch function without refresh logic (to avoid infinite loops)
const rawFetchWithCredentials = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

// Create the store first
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (username, password) => {
    console.log("🔐 Login attempt started");
    set({ isLoading: true, error: null });
    try {
      const response = await rawFetchWithCredentials(`${API_URL}/auth/login/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log("📡 Login response:", {
        ok: response.ok,
        status: response.status,
        data,
      });

      if (!response.ok) {
        throw new Error(data.detail || "Identifiants invalides");
      }
      // backend set cookies, fetch user
      await get().fetchUser();
      set({ isLoading: false });
      console.log("✅ Login completed");
    } catch (error) {
      console.error("❌ Login error:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (username, email, password, password2) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rawFetchWithCredentials(
        `${API_URL}/auth/register/`,
        {
          method: "POST",
          body: JSON.stringify({ username, email, password, password2 }),
        },
      );
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
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  refreshToken: async () => {
    try {
      const response = await rawFetchWithCredentials(
        `${API_URL}/auth/refresh/`,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );
      if (!response.ok) throw new Error("Refresh failed");
      return true;
    } catch (error) {
      throw error;
    }
  },

  fetchUser: async () => {
    console.log("👤 fetchUser started");
    set({ isLoading: true });
    try {
      const response = await rawFetchWithCredentials(`${API_URL}/auth/me/`);
      console.log("📡 fetchUser response status:", response.status);

      if (response.status === 401) {
        // Refresh token if expired
        try {
          await get().refreshToken();
          // after refresh, fetch user
          const retryResponse = await rawFetchWithCredentials(
            `${API_URL}/auth/me/`,
          );
          if (!retryResponse.ok) throw new Error("Not authenticated");
          const userData = await retryResponse.json();
          console.log("✅ User data (after refresh):", userData);
          set({ user: userData, isAuthenticated: true, isLoading: false });
          return;
        } catch (refreshError) {
          console.error("❌ Refresh failed:", refreshError);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
      }
      if (!response.ok) throw new Error("Not authenticated");
      const userData = await response.json();
      console.log("✅ User data:", userData);
      console.log("✅ Setting isAuthenticated to true and user:", userData);
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("❌ fetchUser error:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await rawFetchWithCredentials(`${API_URL}/auth/logout/`, {
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

// Exported to be used in other stores (now uses the store correctly!)
export const fetchWithCredentials = async (
  url: string,
  options: RequestInit = {},
) => {
  let response = await rawFetchWithCredentials(url, options);

  if (response.status === 401) {
    // Try to refresh the token
    const authStore = useAuthStore.getState();
    try {
      await authStore.refreshToken();
      // Retry the original request
      response = await rawFetchWithCredentials(url, options);
    } catch (refreshError) {
      // Refresh failed, log out user
      authStore.logout();
      throw refreshError;
    }
  }

  return response;
};
