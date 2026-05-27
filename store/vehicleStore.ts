import { VehicleState } from "@/types";
import { create } from "zustand";
import { API_URL } from "@/constants/api";

export const useVehicleStore = create<VehicleState>()((set, get) => ({
  vehicles: [],
  totalCount: 0,
  loading: false,
  error: null,
  filters: {
    offer_type: "",
    brand: "",
    search: "",
    min_price: "",
    max_price: "",
  },
  page: 1,
  pageSize: 10, // fetch 10 vehicles at a time
  hasMore: true,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // reset pagination when filters change
      vehicles: [], // clear vehicles list
      hasMore: true,
    }));
    // Trigger a new fetch when filters change
    get().fetchVehicles(true);
  },

  resetFilters: () => {
    set({
      filters: {
        offer_type: "",
        brand: "",
        search: "",
        min_price: "",
        max_price: "",
      },
      page: 1,
      vehicles: [],
      hasMore: true,
    });
    get().fetchVehicles(true);
  },

  fetchVehicles: async (reset = true) => {
    const { filters, page, pageSize } = get();
    if (reset) {
      set({ loading: true, error: null, vehicles: [], page: 1, hasMore: true });
    } else {
      set({ loading: true, error: null });
    }

    try {
      // Build request parameters
      const params = new URLSearchParams();
      if (filters.offer_type) params.append("offer_type", filters.offer_type);
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.search) params.append("search", filters.search);
      if (filters.min_price) params.append("min_price", filters.min_price);
      if (filters.max_price) params.append("max_price", filters.max_price);
      params.append("page", page.toString());
      params.append("page_size", pageSize.toString());

      const response = await fetch(`${API_URL}/vehicles/?${params}`);
      if (!response.ok) throw new Error("Erreur de chargement");

      const data = await response.json();
      // Handle pagination data
      const newVehicles = data.results || data;
      const total = data.count || newVehicles.length;

      set((state) => ({
        vehicles: reset ? newVehicles : [...state.vehicles, ...newVehicles],
        totalCount: total,
        hasMore: !!data.next, // if API provides a next URL, there are more vehicles
        loading: false,
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
