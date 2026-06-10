"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import Link from "next/link";
import { toast } from "sonner";
import { Folder, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

interface FolderStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

function ClientDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<FolderStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/folders/?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur chargement");
        const data = await res.json();
        const foldersList = Array.isArray(data) ? data : data.results || [];
        const pending = foldersList.filter(
          (f: any) => f.status === "pending",
        ).length;
        const approved = foldersList.filter(
          (f: any) => f.status === "approved",
        ).length;
        const rejected = foldersList.filter(
          (f: any) => f.status === "rejected",
        ).length;
        setStats({
          total: foldersList.length,
          pending,
          approved,
          rejected,
        });
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-8">
        Chargement de votre tableau de bord...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Bienvenue {user?.username} 👋</h1>
      <p className="text-gray-600 mb-8">
        Gérez vos demandes d&apos;achat ou de location.
      </p>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Folder className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total dossiers</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">En attente</p>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Validés</p>
            <p className="text-2xl font-bold">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Refusés</p>
            <p className="text-2xl font-bold">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          href="/dossier"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
        >
          <FileText className="h-4 w-4" />
          Voir mes dossiers
        </Link>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg transition"
        >
          <Folder className="h-4 w-4" />
          Nouvelle demande
        </Link>
      </div>
    </div>
  );
}

export default ClientDashboard;
