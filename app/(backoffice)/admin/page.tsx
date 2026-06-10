"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans l&apos;espace d&apos;administration
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>

      {/* Section actions rapides */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href="/admin/vehicules/new">➕ Ajouter un véhicule</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/dossiers">📋 Voir tous les dossiers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
