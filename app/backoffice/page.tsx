"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useVehicleStore } from "@/store/vehicleStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BackofficePage() {
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const { user } = useAuthStore();
  const { fetchAllVehicles, vehicles, loading } = useVehicleStore();

  useEffect(() => {
    fetchAllVehicles();
  }, [fetchAllVehicles]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Espace commercial / admin</h1>
      <p>
        Bienvenue {user?.username} (rôle : {user?.role})
      </p>

      <div className="space-y-6 pt-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/backoffice/vehicules">
            <Card className="hover:bg-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {loading ? "..." : vehicles.length}
                </p>
                <p className="text-xs text-muted-foreground">total</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/backoffice/dossiers">
            <Card className="hover:bg-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dossiers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">3 en attente</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
