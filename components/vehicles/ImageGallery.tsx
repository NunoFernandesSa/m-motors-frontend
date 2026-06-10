"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageType {
  id: number;
  image: string;
  order: number;
}

interface ImageGalleryProps {
  images: ImageType[];
  vehicleName: string;
}

export default function ImageGallery({
  images,
  vehicleName,
}: ImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", updateButtons);
    updateButtons();
  }, [emblaApi]);

  if (!images.length) {
    return (
      <div className="bg-gray-200 h-64 w-full rounded flex items-center justify-center">
        Pas d’image
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full"
            >
              <Image
                src={img.image}
                alt={vehicleName}
                width={800}
                height={500}
                className="w-full h-[400px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
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
