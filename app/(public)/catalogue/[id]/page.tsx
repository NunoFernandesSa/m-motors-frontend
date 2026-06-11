"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useVehicleStore } from "@/store/vehicleStore";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@/components/shared/Loading";
import { toast } from "sonner";
import { API_URL } from "@/constants/api";
import ImageGallery from "@/components/vehicles/ImageGallery";

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { vehicleDetail, loading, error, fetchVehicleDetail } =
    useVehicleStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [creatingFolder, setCreatingFolder] = useState(false);

  useEffect(() => {
    if (id) fetchVehicleDetail(id as string);
  }, [id, fetchVehicleDetail]);

  const handleReservation = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      router.push("/connexion");
      return;
    }
    if (!vehicleDetail) return;

    setCreatingFolder(true);
    try {
      const folderRes = await fetch(`${API_URL}/folders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          vehicle: vehicleDetail.id,
          user: user.id,
          comment: "",
        }),
      });

      if (!folderRes.ok) {
        const errData = await folderRes.json();
        throw new Error(errData.detail || "Erreur création dossier");
      }

      const listRes = await fetch(
        `${API_URL}/folders/?user_id=${user.id}&ordering=-created_at`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      if (!listRes.ok)
        throw new Error("Impossible de récupérer la liste des dossiers");

      const data = await listRes.json();
      const foldersList = data.results || data;
      if (!foldersList || foldersList.length === 0) {
        throw new Error("Aucun dossier trouvé pour cet utilisateur");
      }
      const folderId = foldersList[0].id;
      if (!folderId) throw new Error("ID du dossier introuvable");

      toast.success(
        "Dossier créé, vous pouvez maintenant ajouter vos documents",
      );
      router.push(`/dossier/${folderId}/documents`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    } finally {
      setCreatingFolder(false);
    }
  };

  if (loading) {
    return <Loading variant="dots" text="Chargement..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Erreur</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link
          href="/catalogue"
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
          href="/catalogue"
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

  // Vérifier que vehicleDetail.images existe et est un tableau
  const images = Array.isArray(vehicleDetail.images)
    ? vehicleDetail.images
    : [];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Link
        href="/catalogue"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        ← Retour à la liste
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Galerie d'images (carrousel) */}
        <div className="w-full">
          <ImageGallery
            images={vehicleDetail.images || []}
            vehicleName={`${vehicleDetail.brand} ${vehicleDetail.model}`}
          />
        </div>

        {/* Informations */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            {vehicleDetail.brand} {vehicleDetail.model}
          </h2>

          {vehicleDetail.year && (
            <p className="text-muted-foreground">
              Année : {vehicleDetail.year}
            </p>
          )}

          {vehicleDetail.fuel_type && (
            <p className="text-muted-foreground">
              Type de carburant : {vehicleDetail.fuel_type}
            </p>
          )}

          {vehicleDetail.color && (
            <p className="text-muted-foreground">
              Couleur : {vehicleDetail.color}
            </p>
          )}

          {vehicleDetail.transmission && (
            <p className="text-muted-foreground">
              Type de transmission : {vehicleDetail.transmission}
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

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
              onClick={handleReservation}
              disabled={creatingFolder}
            >
              {creatingFolder ? "Création du dossier..." : "Réserver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
