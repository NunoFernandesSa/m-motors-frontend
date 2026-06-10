import { API_URL } from "@/constants/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getValidImageUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/images/placeholder-car.jpg";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_URL}${url}`;
};
