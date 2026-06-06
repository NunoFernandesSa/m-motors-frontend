import { VehicleState } from "@/types";
import { create } from "zustand";
import { API_URL } from "@/constants/api";

const initialFilters = {
  vehicle_type: "sale",
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
      if (filters.vehicle_type)
        params.append("vehicle_type", filters.vehicle_type);
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

  // TODO: Add vehicle detail state
  // fetchVehicleDetail: async (id: number) => {
  //   const response = await fetch(`${API_URL}/vehicles/${id}/`);
  //   if (!response.ok) throw new Error("Erreur de chargement");
  //   const data = await response.json();
  //   set((state) => ({
  //     vehicleDetail: data,
  //   }));
  // },
}));
