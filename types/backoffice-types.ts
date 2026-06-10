export interface DashboardStats {
  totalFolders: number;
  totalVehicles: number;
}

export interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export interface DocumentFile {
  id: number;
  file: string;
  uploaded_at: string;
}

export interface Folder {
  id: number;
  user_details: { id: number; username: string; email: string };
  vehicle_details: {
    id: number;
    brand: string;
    model: string;
    vehicle_type: "sale" | "rent";
    year: number;
    mileage: number;
    fuel_type: string;
    transmission: string;
    color: string;
    price: string;
  };
  status: "pending" | "approved" | "rejected";
  comment: string;
  created_at: string;
  document_files: DocumentFile[];
}
