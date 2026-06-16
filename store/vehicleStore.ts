import { Vehicle, VehicleState } from "@/types";
import { create } from "zustand";
import { API_URL } from "@/constants/api";
import { fetchWithCredentials, useAuthStore } from "./authStore";

// Raw fetch for FormData without refresh logic
const rawFetchFormData = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
  });
};

// Helper function for FormData requests that also handles token refresh
const fetchWithCredentialsFormData = async (
  url: string,
  options: RequestInit = {},
) => {
  let response = await rawFetchFormData(url, options);

  if (response.status === 401) {
    // Try to refresh the token
    const authStore = useAuthStore.getState();
    try {
      await authStore.refreshToken();
      // Retry the original request
      response = await rawFetchFormData(url, options);
    } catch (refreshError) {
      // Refresh failed, log out user
      authStore.logout();
      throw refreshError;
    }
  }

  return response;
};

const initialFilters = {
  vehicle_type: "all",
  brand: "",
  model: "",
  min_price: "",
  max_price: "",
};

export const useVehicleStore = create<VehicleState>()((set, get) => ({
  vehicles: [],
  totalCount: 0,
  loading: false,
  error: null,
  filters: initialFilters,
  page: 1,
  pageSize: 12, // fetch 12 vehicles at a time
  hasMore: true,
  vehicleDetail: null as Vehicle | null,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // reset pagination when filters change
      vehicles: [], // clear vehicles list
      hasMore: true,
    }));
  },

  resetFilters: () => {
    set({
      filters: initialFilters,
      page: 1,
      vehicles: [],
      totalCount: 0,
      hasMore: true,
    });
  },

  fetchVehicles: async (reset = true) => {
    const state = get();
    const pageToUse = reset ? 1 : state.page;
    const { filters, pageSize } = state;

    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams();
      if (filters.vehicle_type && filters.vehicle_type !== "all") {
        params.append("vehicle_type", filters.vehicle_type);
      }
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.model) params.append("model", filters.model);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      params.append("page", pageToUse.toString());
      params.append("page_size", pageSize.toString());

      const response = await fetch(`${API_URL}/vehicles/?${params.toString()}`);
      if (!response.ok) throw new Error("Erreur de chargement");

      const data = await response.json();
      const newVehicles = data.results || data;
      const total = data.count || newVehicles.length;

      set((state) => ({
        vehicles: reset ? newVehicles : [...state.vehicles, ...newVehicles],
        totalCount: total,
        hasMore: !!data.next,
        loading: false,
        page: pageToUse,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  loadMore: async () => {
    const { hasMore, loading, page } = get();
    if (!hasMore || loading) return;
    set({ page: page + 1 });
    await get().fetchVehicles(false);
  },

  clearVehicles: () => {
    set({ vehicles: [], totalCount: 0, page: 1, hasMore: true });
  },

  resetToType: (type: string) => {
    set({
      filters: { ...initialFilters, vehicle_type: type },
      page: 1,
      vehicles: [],
      hasMore: true,
      totalCount: 0,
      error: null,
    });
  },

  fetchVehicleDetail: async (id: string) => {
    set({ loading: true, error: null, vehicleDetail: null });
    try {
      const response = await fetch(`${API_URL}/vehicles/${id}/`);
      if (!response.ok) throw new Error("Véhicule non trouvé");
      const data = await response.json();
      set({ vehicleDetail: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addVehicle: async (formData: FormData) => {
    // !!! Log pour déboguer
    console.log("=== ADD VEHICLE DEBUG ===");
    for (const pair of formData.entries()) {
      console.log(
        pair[0],
        pair[1] instanceof File ? `FILE: ${pair[1].name}` : pair[1],
      );
    }

    set({ loading: true, error: null });
    try {
      const response = await fetchWithCredentialsFormData(
        `${API_URL}/vehicles/`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      const newVehicle = await response.json();
      set((state) => ({ vehicles: [newVehicle, ...state.vehicles] }));
      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },

  updateVehicle: async (id: number, formData: FormData) => {
    // !!! Log pour déboguer
    console.log("=== UPDATE VEHICLE DEBUG ===");
    for (const pair of formData.entries()) {
      console.log(
        pair[0],
        pair[1] instanceof File ? `FILE: ${pair[1].name}` : pair[1],
      );
    }

    set({ loading: true, error: null });
    try {
      const response = await fetchWithCredentialsFormData(
        `${API_URL}/vehicles/${id}/`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la modification");
      const updatedVehicle = await response.json();
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v.id === id ? updatedVehicle : v)),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },

  deleteVehicle: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithCredentials(
        `${API_URL}/vehicles/${id}/`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
        loading: false,
      }));
      return true;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },

  fetchAllVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithCredentials(`${API_URL}/vehicles/`);
      if (!response.ok) throw new Error("Erreur de chargement");
      const data = await response.json();
      set({ vehicles: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
