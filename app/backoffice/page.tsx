"use client";
import { useAuthStore } from "@/store/authStore";

export default function BackofficePage() {
  const { user } = useAuthStore();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Espace commercial / admin</h1>
      <p>
        Bienvenue {user?.username} (rôle : {user?.role})
      </p>
      {/* Ajouter ici la gestion des véhicules, des dossiers clients, etc. */}
    </div>
  );
}
