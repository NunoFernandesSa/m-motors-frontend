"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useVehicleStore } from "@/store/vehicleStore";

export default function VehiclesPage() {
  const { vehicles, loading, fetchAllVehicles, deleteVehicle } =
    useVehicleStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllVehicles();
  }, [fetchAllVehicles]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    const success = await deleteVehicle(id);
    if (success) {
      toast.success("Véhicule supprimé");
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredVehicles = vehicles.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des véhicules</h1>
        <Link href="/backoffice/vehicules/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Rechercher un véhicule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="relative w-24 h-24 bg-muted rounded overflow-hidden">
                  {/* <Image
                    src={vehicle.images?.[0] || "/placeholder-car.jpg"}
                    alt={vehicle.model}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.year} • {vehicle.mileage?.toLocaleString()} km
                  </p>
                  <p className="text-sm">
                    {vehicle.vehicle_type === "sale"
                      ? `Achat: ${parseInt(vehicle.sale_price || "0").toLocaleString()} €`
                      : `Location: ${parseInt(vehicle.rent_price || "0").toLocaleString()} €/mois`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/backoffice/vehicules/${vehicle.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
