interface DocumentFile {
  id: number;
  file: string;
  uploaded_at: string;
}

export interface FolderDetails {
  id: number;
  comment: string;
  validation_comment: string;
  status: string;
  created_at: string;
  vehicle_details: {
    id: number;
    brand: string;
    model: string;
    vehicle_type: "sale" | "rent";
  };
  document_files: DocumentFile[];
}

export interface FolderStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  unreadCount: number;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: string;
  vehicle_type: "sale" | "rent";
}
