"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import Link from "next/link";
import { toast } from "sonner";
import { Folder } from "@/types/backoffice-types";
import { FolderDetails } from "@/types/dashboard-types";

export default function MesDossiers() {
  const { user } = useAuthStore();
  const [folders, setFolders] = useState<FolderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFolders = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("access_token");
      const listRes = await fetch(`${API_URL}/folders/?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!listRes.ok) throw new Error("Erreur chargement liste");
      const data = await listRes.json();
      const foldersList = Array.isArray(data) ? data : data.results || [];
      const folderIds = foldersList.map((f: Folder) => f.id);

      const foldersDetails = await Promise.all(
        folderIds.map(async (id: number) => {
          const detailRes = await fetch(`${API_URL}/folders/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!detailRes.ok) throw new Error(`Erreur chargement dossier ${id}`);
          return detailRes.json();
        }),
      );
      setFolders(foldersDetails);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  const handleDelete = async (folderId: number) => {
    const confirm = window.confirm("Supprimer définitivement ce dossier ?");
    if (!confirm) return;

    setDeletingId(folderId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/folders/${folderId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText}`);
      }
      toast.success("Dossier supprimé");
      // Recharger la liste
      await fetchFolders();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="container py-8">Chargement...</div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Mes dossiers</h1>
      {folders.length === 0 ? (
        <p>
          Aucun dossier pour le moment. Commencez par réserver un véhicule dans
          le catalogue.
        </p>
      ) : (
        <div className="space-y-4">
          {folders.map((folder) => {
            const docCount = folder.document_files?.length || 0;
            const isRent = folder.vehicle_details?.vehicle_type === "rent";
            const requiredDocs = isRent ? 3 : 2;
            const hasRequiredDocs = docCount >= requiredDocs;
            const isPending = folder.status === "pending";
            const canDelete = isPending; // ou autoriser aussi si aucun document

            return (
              <div key={folder.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {folder.vehicle_details?.brand}{" "}
                      {folder.vehicle_details?.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      ID dossier : {folder.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Statut :{" "}
                      <span className="font-medium">
                        {folder.status === "pending" && "⏳ En attente"}
                        {folder.status === "approved" && "✅ Validé"}
                        {folder.status === "rejected" && "❌ Refusé"}
                        {!folder.status && "📝 Brouillon"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Documents : {docCount} / {requiredDocs}
                      {!hasRequiredDocs && folder.status === "pending" && (
                        <span className="text-red-500 ml-2">(manquants)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Créé le :{" "}
                      {new Date(folder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(folder.id)}
                      disabled={deletingId === folder.id}
                      className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                    >
                      {deletingId === folder.id ? "..." : "Supprimer"}
                    </button>
                  )}
                </div>
                <div className="mt-2">
                  <Link
                    href={`/dossier/${folder.id}/documents?vehicleId=${folder.vehicle_details?.id}`}
                    className="text-blue-600 text-sm underline inline-block"
                  >
                    {folder.status === "pending"
                      ? hasRequiredDocs
                        ? "Modifier les documents"
                        : "Ajouter les documents manquants"
                      : "Voir le dossier"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
