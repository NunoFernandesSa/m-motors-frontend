"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useVehicleStore } from "@/store/vehicleStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JSX } from "react";

/**
 * Main page component for managing vehicles in the admin dashboard.
 * Handles vehicle listing, filtering, searching, and deletion operations.
 * @returns JSX element rendering the vehicles management interface
 */
export default function VehiclesPage(): JSX.Element {
  const { vehicles, loading, fetchAllVehicles, deleteVehicle } =
    useVehicleStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sale" | "rent">("all");

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

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch = `${v.brand} ${v.model}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = typeFilter === "all" || v.vehicle_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des véhicules</h1>
        <Link href="/admin/vehicules/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Rechercher un véhicule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={typeFilter}
          onValueChange={(value) =>
            setTypeFilter(value as "all" | "sale" | "rent")
          }
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="sale">Achat</SelectItem>
            <SelectItem value="rent">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : filteredVehicles.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Aucun véhicule trouvé
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Réf: {vehicle.ref}
                  </p>
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
                  <Link href={`/admin/vehicules/${vehicle.id}`}>
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
