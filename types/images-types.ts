export interface ImageItem {
  id?: number;
  image: string;
  order?: number;
  created_at?: string;
}

export interface ImageGalleryProps {
  images: ImageItem[] | string[];
  vehicleName: string;
}
