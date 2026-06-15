"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
// ----- Components -----
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
// ----- Types -----
import { Vehicle } from "@/types";
// ----- Utils -----
import { getValidImageUrl } from "@/lib/utils";

// ----- Props -----
interface VehicleCardProps {
  vehicle: Omit<Vehicle, "images"> & {
    images?: { id?: number; image: string; order?: number }[];
  };
}

/**
 * Vehicle card
 * @param vehicle - The vehicle to display on the card
 * @returns A JSX element representing the vehicle card
 */
export default function VehicleCard({
  vehicle,
}: VehicleCardProps): JSX.Element {
  const displayPrice =
    vehicle.vehicle_type === "sale"
      ? `${parseInt(vehicle.sale_price || "0").toLocaleString()} €`
      : `${parseInt(vehicle.rent_price || "0").toLocaleString()} € / mois`;

  const offerLabel = vehicle.vehicle_type === "sale" ? "Achat" : "Location LLD";

  const firstImage = vehicle.images?.[0];
  const rawImageUrl =
    typeof firstImage === "string" ? firstImage : firstImage?.image || "";
  const imageUrl = getValidImageUrl(rawImageUrl);

  return (
    <Link href={`/catalogue/${vehicle.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image compacte (ratio 16/9 mais moins haute) */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="space-y-0 px-3 pt-2 pb-0 flex justify-between items-center">
          <div className="">
            <h3 className="text-base font-bold leading-tight truncate">
              {vehicle.brand} {vehicle.model}
            </h3>
            {vehicle.year && (
              <p className="text-xs text-muted-foreground">
                Année : {vehicle.year}
              </p>
            )}
            {vehicle.mileage && (
              <p className="text-xs text-muted-foreground">
                {vehicle.mileage.toLocaleString()} km
              </p>
            )}
          </div>
          <div className="">
            <Badge
              variant={
                vehicle.vehicle_type === "sale" ? "default" : "secondary"
              }
              className="rounded-full px-2 py-0 text-xs font-normal"
            >
              {offerLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-3 pt-1 pb-0">
          <p className="text-lg font-bold text-primary">{displayPrice}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
