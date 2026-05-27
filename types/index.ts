/**
 * ----- Mobile Menu Button Component -----
 * Interface représents a mobile menu button component
 */
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
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  images?: string;
  vehicle_type: "sale" | "rent";
  sale_price?: string;
  rent_price?: string;
  rent_duration_min?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  price?: string;
}
export interface VehicleState {
  vehicles: Vehicle[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  filters: Filters;
  page: number;
  pageSize: number;
  hasMore: boolean;
  setFilters: (filters: Partial<Filters>) => void;
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
  vehicle_type: string; // 'sale', 'rent', ou ''
  brand: string;
  model: string; // search text
  min_price: string;
  max_price: string;
}
export interface FilterSidebarProps {
  filters: Filters;
  onVehicleTypeChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void; // ← ajouté
}

/**
 * ----- Error Message Component -----
 * Interface représents a error message component
 */
export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ----- Vehicle Card Component -----
 * Interface représents a vehicle card component
 */
export interface VehicleCardProps {
  vehicle: Vehicle;
}
