"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useVehicleStore } from "@/store/vehicleStore";
import { getValidImageUrl } from "@/lib/utils";
import { Loading } from "@/components/shared/Loading";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { vehicleDetail, loading, error, fetchVehicleDetail } =
    useVehicleStore();
  const router = useRouter();

  useEffect(() => {
    if (id) fetchVehicleDetail(id as string);
  }, [id, fetchVehicleDetail]);

  if (loading) {
    return <Loading variant="dots" text="Chargement..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Erreur</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link
          href="/achat"
          className="inline-block mt-4 text-primary underline"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (!vehicleDetail) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h2 className="text-xl font-bold">Véhicule non trouvé</h2>
        <Link
          href="/achat"
          className="inline-block mt-4 text-primary underline"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  const displayPrice =
    vehicleDetail.vehicle_type === "sale"
      ? `${parseInt(vehicleDetail.sale_price || "0").toLocaleString()} €`
      : `${parseInt(vehicleDetail.rent_price || "0").toLocaleString()} € / mois`;

  const offerLabel =
    vehicleDetail.vehicle_type === "sale" ? "Achat" : "Location LLD";

  const imageUrl = getValidImageUrl(vehicleDetail.images?.[0]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Bouton retour */}
      <Link
        href={vehicleDetail.vehicle_type === "sale" ? "/achat" : "/location"}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        ← Retour à la liste
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image principale */}
        <div className="relative h-96 w-full bg-muted rounded-lg overflow-hidden">
          <Image
            src={imageUrl[0] || "/images/placeholder-car.jpg"}
            alt={`${vehicleDetail.brand} ${vehicleDetail.model}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {vehicleDetail.brand} {vehicleDetail.model}
          </h1>

          {vehicleDetail.year && (
            <p className="text-muted-foreground">
              Année : {vehicleDetail.year}
            </p>
          )}

          {vehicleDetail.mileage && (
            <p className="text-muted-foreground">
              Kilométrage : {vehicleDetail.mileage.toLocaleString()} km
            </p>
          )}

          <div className="text-3xl font-bold text-primary">{displayPrice}</div>

          <div className="inline-block bg-secondary px-3 py-1 rounded-full text-sm">
            {offerLabel}
          </div>

          {vehicleDetail.description && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {vehicleDetail.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
              onClick={() => {
                router.push(`/dossier`);
              }}
            >
              Réserver
            </button>
          </div>
        </div>
      </div>

      {/* Galerie (si disponible) */}
    </div>
  );
}
