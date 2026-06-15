"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/constants/api";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, FileText, Filter } from "lucide-react";
import { JSX } from "react";
import { Folder } from "@/types/backoffice-types";

/**
 * Admin page for managing folders.
 * @returns JSX element rendering the folders management interface
 */
export default function AdminFoldersPage(): JSX.Element {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_URL}/folders/`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status}: ${errorText.slice(0, 200)}`);
      }
      const data = await res.json();
      const foldersList = Array.isArray(data) ? data : data.results || [];
      setFolders(foldersList);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filteredFolders =
    statusFilter === "all"
      ? folders
      : folders.filter((f) => f.status === statusFilter);

  if (loading)
    return <div className="container py-8">Chargement des dossiers...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6" /> Gestion des dossiers clients
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
            statusFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <Filter className="h-3 w-3" /> Tous
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Validés
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`px-3 py-1 rounded-full text-sm ${
            statusFilter === "rejected"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Refusés
        </button>
      </div>

      {filteredFolders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun dossier trouvé</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-semibold">
                        {folder.vehicle_details.brand}{" "}
                        {folder.vehicle_details.model}
                      </h2>
                      <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {folder.vehicle_details.vehicle_type === "rent"
                          ? "Location"
                          : "Achat"}
                      </span>
                      <span
                        className={`text-sm px-2 py-0.5 rounded-full ${
                          folder.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : folder.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {folder.status === "pending"
                          ? "En attente"
                          : folder.status === "approved"
                            ? "Validé"
                            : "Refusé"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Client : {folder.user_details.username} (
                      {folder.user_details.email})
                    </p>
                    {folder.comment && (
                      <p className="text-gray-500 text-sm italic">
                        📝 {folder.comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Créé le : {new Date(folder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/dossiers/${folder.id}`}
                      className="flex items-center gap-1 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition"
                    >
                      <Eye className="h-4 w-4" /> Détail
                    </Link>
                  </div>
                </div>

                {/* Documents */}
                {folder.document_files && folder.document_files.length > 0 && (
                  <div className="mt-4 pt-3 border-t">
                    <h3 className="text-sm font-medium mb-2">
                      Documents fournis :
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {folder.document_files.map((doc) => {
                        let fileUrl = doc.file;
                        if (fileUrl.startsWith("/"))
                          fileUrl = `${API_URL}${fileUrl}`;
                        else if (!fileUrl.startsWith("http"))
                          fileUrl = `${API_URL}/${fileUrl}`;
                        return (
                          <a
                            key={doc.id}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            {fileUrl.split("/").pop() || `doc_${doc.id}`}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
