"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import Link from "next/link";
import { toast } from "sonner";
import { Folder, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { FolderStats } from "@/types/dashboard-types";

/**
 *
 * @returns
 */
function ClientDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<FolderStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    unreadCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Initialise last visit date if not set
  useEffect(() => {
    if (!localStorage.getItem("last_dossier_visit")) {
      localStorage.setItem("last_dossier_visit", new Date().toISOString());
    }
  }, []);

  const markAsRead = () => {
    localStorage.setItem("last_dossier_visit", new Date().toISOString());
    setStats((prev) => ({ ...prev, unreadCount: 0 }));
  };

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

        const lastVisit = localStorage.getItem("last_dossier_visit");
        const lastVisitDate = lastVisit ? new Date(lastVisit) : new Date(); // fallback sur now

        let pending = 0,
          approved = 0,
          rejected = 0,
          unreadCount = 0;

        for (const f of foldersList) {
          if (f.status === "pending") pending++;
          else if (f.status === "approved") approved++;
          else if (f.status === "rejected") rejected++;

          // Notification : status not "pending" ET updated after last visit
          if (f.status !== "pending") {
            const updatedAt = new Date(f.updated_at);
            if (updatedAt > lastVisitDate) {
              unreadCount++;
            }
          }
        }

        setStats({
          total: foldersList.length,
          pending,
          approved,
          rejected,
          unreadCount,
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        toast.error(errorMessage);
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

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total dossiers with notification badge */}
        <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-4 relative">
          <div className="bg-blue-100 p-3 rounded-full">
            <Folder className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total dossiers</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          {stats.unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {stats.unreadCount > 9 ? "9+" : stats.unreadCount}
            </div>
          )}
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

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Link
          href="/dossier"
          onClick={markAsRead}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
        >
          <FileText className="h-4 w-4" />
          Voir mes dossiers
          {stats.unreadCount > 0 && (
            <span className="ml-1 bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {stats.unreadCount > 9 ? "9+" : stats.unreadCount}
            </span>
          )}
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
