"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function ImageGallery({
  images,
  vehicleName,
}: {
  images: string[];
  vehicleName: string;
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  if (!images || images.length === 0) {
    return (
      <Image
        src="/images/placeholder-car.png"
        alt="Aucune image"
        width={800}
        height={500}
        className="w-full h-100 object-cover"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="flex">
        {images.map((img, idx) => {
          const url = typeof img === "string" ? img : img.image;
          if (!url) return null;
          return (
            <div
              key={idx}
              className="relative min-w-0 flex-shrink-0 flex-grow-0 basis-full"
            >
              <Image
                src={url} // déjà absolue (http://localhost:8000/...)
                alt={`${vehicleName} ${idx + 1}`}
                width={800}
                height={500}
                className="w-full h-[400px] object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
