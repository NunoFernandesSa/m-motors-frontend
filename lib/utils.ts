import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getValidImageUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== "string") return "/images/placeholder-car.jpg";
  const isValid =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/");
  if (isValid && url.length > 3) return url;
  return "/images/placeholder-car.jpg";
};
