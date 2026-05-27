/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React & Next.js -----
import Image from "next/image";
import Link from "next/link";
// ----- Shadcn UI -----
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
// ----- Types -----
import { Vehicle } from "@/types";
import { JSX } from "react";

/**
 * VehicleCard component that displays a vehicle information card
 * @param {Object} props - The component props
 * @param {Vehicle} props.vehicle - The vehicle object to display
 * @returns {JSX.Element} The rendered VehicleCard component
 */
function VehicleCard({ vehicle }: { vehicle: Vehicle }): JSX.Element {
  const displayPrice =
    vehicle.vehicle_type === "sale"
      ? `${parseInt(vehicle.sale_price || "0").toLocaleString()} €`
      : `${parseInt(vehicle.rent_price || "0").toLocaleString()} € / mois`;

  const offerLabel = vehicle.vehicle_type === "sale" ? "Achat" : "Location LLD";
  const imageUrl = vehicle.images || "/images/placeholder-car.jpg";

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={imageUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
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

export default VehicleCard;
