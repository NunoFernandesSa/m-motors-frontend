export interface MobileMenuButtonProps {
  ariaMobileMenuOpenlabel?: string;
  ariaMobileMenuCloseLabel?: string;
  className?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

/**
 * ----- Zustand State -----
 * Interface représents a vehicle
 */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  price: number;
  offer_type: "achat" | "location";
  image?: string;
  year?: number;
  mileage?: number;
}

/**
 * ----- Zustand State -----
 * Interface représents a vehicle state
 */
export interface VehicleState {
  vehicles: Vehicle[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filters: {
    offer_type: string;
    brand: string;
    search: string;
    min_price: string;
    max_price: string;
  };
  // Pagination
  page: number;
  pageSize: number;
  hasMore: boolean;
  // Actions
  setFilters: (filters: Partial<VehicleState["filters"]>) => void;
  resetFilters: () => void;
  fetchVehicles: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  clearVehicles: () => void;
}

/**
 * ----- Vehicle Filters Component -----
 * Interface représents a vehicle filters
 */
export interface Filters {
  offer_type: string;
  brand: string;
  search: string;
  min_price: string;
  max_price: string;
}
export interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
}
