"use client";

import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/constants/api";
import { toast } from "sonner";
import { FolderOpen, Car, PlusCircle, ListChecks } from "lucide-react";
import { DashboardStats } from "@/types/backoffice-types";

/**
 * Main admin dashboard component that displays system-wide statistics and quick actions
 * Renders overview metrics for folders and vehicles, with navigation links to manage sections
 * @returns JSX element rendering the admin dashboard interface with stats cards and action buttons
 */
export default function AdminDashboard(): JSX.Element {
  const [stats, setStats] = useState<DashboardStats>({
    totalFolders: 0,
    totalVehicles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      // find all folders (admin has access to all)
      const foldersRes = await fetch(`${API_URL}/folders/`, {
        credentials: "include",
      });
      if (!foldersRes.ok) throw new Error("Erreur chargement dossiers");
      const foldersData = await foldersRes.json();
      const foldersList = Array.isArray(foldersData)
        ? foldersData
        : foldersData.results || [];

      // find all vehicles (admin has access to all)
      const vehiclesRes = await fetch(`${API_URL}/vehicles/`, {
        credentials: "include",
      });
      if (!vehiclesRes.ok) throw new Error("Erreur chargement véhicules");
      const vehiclesData = await vehiclesRes.json();
      const vehiclesList = Array.isArray(vehiclesData)
        ? vehiclesData
        : vehiclesData.results || [];

      setStats({
        totalFolders: foldersList.length,
        totalVehicles: vehiclesList.length,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchStats}>Réessayer</Button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total dossiers",
      value: stats.totalFolders,
      icon: FolderOpen,
      color: "bg-blue-500",
      href: "/admin/dossiers",
    },
    {
      title: "Véhicules",
      value: stats.totalVehicles,
      icon: Car,
      color: "bg-purple-500",
      href: "/admin/vehicules",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans l&apos;espace d&apos;administration
          </p>
        </div>
        <Button variant="outline" onClick={fetchStats}>
          Rafraîchir
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full text-white`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link
              href="/admin/vehicules/new"
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter un véhicule
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/dossiers" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Voir tous les dossiers
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
