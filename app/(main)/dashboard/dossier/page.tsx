"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
// import { HistoryList } from "@/components/dashboard/HistoryList";
// import { VehicleList } from "@/components/dashboard/VehicleList";
// import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { Loading } from "@/components/shared/Loading";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    fetchUser,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthenticated, user, fetchUser]);

  if (authLoading)
    return (
      <Loading variant="spinner" text="Chargement du dashboard..." fullScreen />
    );

  if (!user) return redirect("/connexion");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Bonjour {user.username} 👋</h1>
      <p className="text-muted-foreground">
        Bienvenue sur votre espace personnel M-motors
      </p>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="profile">Mon profil</TabsTrigger>
          <TabsTrigger value="history">Historique des demandes</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules achetés/loués</TabsTrigger>
          <TabsTrigger value="notifications">
            Alertes & notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Modifiez votre nom d&apos;utilisateur, email ou mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">{/* <HistoryList /> */}</TabsContent>

        <TabsContent value="vehicles">{/* <VehicleList /> */}</TabsContent>

        <TabsContent value="notifications">
          {/* <NotificationsPanel /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
