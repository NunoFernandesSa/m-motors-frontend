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
  ref: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  images?: string[];
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
  vehicleDetail: Vehicle | null;
  fetchVehicleDetail: (id: string) => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  fetchVehicles: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  clearVehicles: () => void;
  resetToType: (type: string) => void;
  addVehicle: (formData: FormData) => Promise<boolean>;
  updateVehicle: (id: number, formData: FormData) => Promise<boolean>;
  deleteVehicle: (id: number) => Promise<boolean>;
  fetchAllVehicles: () => Promise<void>;
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
export interface FilterBarProps {
  filters: Filters;
  onVehicleTypeChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
  hideVehicleType?: boolean;
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

/**
 * ----- User Interface -----
 */
export interface User {
  id: number;
  email: string;
  username: string;
  role: "admin" | "commercial" | "user";
}

/**
 * ----- Auth State Interface -----
 * Interface représents a auth state
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    password2: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  initAuth: () => Promise<void>;
  refreshToken: () => Promise<string>;
}

/**
 * ----- Vehicle -----
 * Interface représents a vehicle
 */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vehicle_type: "sale" | "rent";
  sale_price?: string;
  rent_price?: string;
  images?: string[];
}

/**
 * ----- Loading Component -----
 * Interface représents a loading component
 */
export interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "skeleton" | "dots" | "pulse";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}
