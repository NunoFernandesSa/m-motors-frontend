"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function BackofficePage() {
  const { user } = useAuthStore();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Espace commercial / admin</h1>
      <p>
        Bienvenue {user?.username} (rôle : {user?.role})
      </p>

      <div className="space-y-6 pt-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">+2 ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">3 en attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-muted-foreground">+12 ce mois</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
