"use client";

import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Vehicle } from "@/types";
import { getValidImageUrl } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
}

/**
 * A React component that renders a card displaying vehicle details, including image, price, and key specifications.
 * The card is clickable and links to the vehicle's detailed page in the catalogue.
 * @param {VehicleCardProps} { vehicle } - Props object containing the vehicle data to display
 * @returns {JSX.Element} A card component with vehicle information wrapped in a navigation link
 */
export default function VehicleCard({
  vehicle,
}: VehicleCardProps): JSX.Element {
  const displayPrice =
    vehicle.vehicle_type === "sale"
      ? `${parseInt(vehicle.sale_price || "0").toLocaleString()} €`
      : `${parseInt(vehicle.rent_price || "0").toLocaleString()} € / mois`;

  const offerLabel = vehicle.vehicle_type === "sale" ? "Achat" : "Location LLD";

  // Récupérer l'URL de la première image du tableau
  const rawImageUrl = vehicle.images?.[0] || "/images/placeholder-car.jpg";
  const imageUrl = getValidImageUrl(rawImageUrl);

  return (
    <Link href={`/catalogue/${vehicle.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-bold">
            {vehicle.brand} {vehicle.model}
          </h3>
          {vehicle.year && (
            <p className="text-sm text-muted-foreground">{vehicle.year}</p>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <p className="text-2xl font-bold text-primary">{displayPrice}</p>
          {vehicle.mileage && (
            <p className="text-sm">{vehicle.mileage.toLocaleString()} km</p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Badge
            variant={vehicle.vehicle_type === "sale" ? "default" : "secondary"}
          >
            {offerLabel}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
