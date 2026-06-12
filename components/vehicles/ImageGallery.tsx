"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState, useEffect, JSX } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/constants/api";
import { ImageGalleryProps } from "@/types/images-types";

/**
 * Image gallery component for displaying vehicle images.
 * @param param0
 * @param param0.images - Array of image items or strings
 * @param param0.vehicleName - Name of the vehicle
 * @returns JSX.Element - Image gallery component
 */
export default function ImageGallery({
  images,
  vehicleName,
}: ImageGalleryProps): JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // extract image URLs from the input images
  const imageUrls = images
    .map((img) => (typeof img === "string" ? img : img?.image))
    .filter(
      (url): url is string =>
        !!url && typeof url === "string" && url.trim() !== "",
    );

  // get full image URL with API_URL prefix
  const getFullUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  // update buttons state when image gallery is mounted
  // and when image gallery is scrolled
  useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", updateButtons);
    updateButtons();
  }, [emblaApi]);

  if (imageUrls.length === 0) {
    return (
      <div className="bg-gray-200 h-64 w-full rounded flex items-center justify-center">
        Aucune image
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full"
            >
              <Image
                src={getFullUrl(url)}
                alt={`${vehicleName} - image ${idx + 1}`}
                width={800}
                height={500}
                className="w-full h-[400px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {imageUrls.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
}
