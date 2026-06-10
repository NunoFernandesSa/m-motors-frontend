"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { API_URL } from "@/constants/api";
import { FolderDetails } from "@/types/dashboard-types";

export default function UploadDocumentsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [folder, setFolder] = useState<FolderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Non authentifié");
        const res = await fetch(`${API_URL}/folders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Dossier non trouvé");
        const data = await res.json();
        setFolder(data);
        setComment(data.comment || "");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folder) return;
    const vehicle = folder.vehicle_details;
    if (!vehicle) {
      toast.error("Véhicule non trouvé");
      return;
    }
    const isRent = vehicle.vehicle_type === "rent";
    const requiredCount = isRent ? 3 : 2;
    const existingCount = folder.document_files?.length || 0;

    if (existingCount + files.length < requiredCount) {
      toast.error(
        `Vous avez actuellement ${existingCount} document(s). Veuillez en ajouter ${requiredCount - existingCount} supplémentaire(s) pour finaliser.`,
      );
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      // update comment
      await fetch(`${API_URL}/folders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      // upload new files
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch(`${API_URL}/folders/${id}/documents/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) {
          let errorMsg = `Erreur upload ${file.name}`;
          try {
            const errJson = await uploadRes.json();
            errorMsg += `: ${errJson.detail || errJson.message}`;
          } catch {
            const errText = await uploadRes.text();
            if (errText) errorMsg += `: ${errText}`;
          }
          throw new Error(errorMsg);
        }
      }
      toast.success("Dossier mis à jour");
      // refresh data to show new documents
      const refreshed = await fetch(`${API_URL}/folders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedData = await refreshed.json();
      setFolder(refreshedData);
      setFiles([]); // clear selection
      toast.success("Documents ajoutés avec succès");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="container py-8">Chargement...</div>;
  if (!folder) return <div className="container py-8">Dossier introuvable</div>;
  const vehicle = folder.vehicle_details;
  if (!vehicle)
    return <div className="container py-8">Aucun véhicule associé</div>;

  const isRent = vehicle.vehicle_type === "rent";
  const requiredDocs = isRent ? 3 : 2;
  const existingDocs = folder.document_files || [];
  const hasRequired = existingDocs.length >= requiredDocs;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">
        Dossier - {vehicle.brand} {vehicle.model}
      </h1>
      <div className="bg-gray-50 p-4 rounded mb-6">
        <p className="text-sm text-gray-600">
          Type : {isRent ? "Location" : "Achat"} - Statut :{" "}
          {folder.status || "En attente"}
        </p>
        <p className="text-sm text-gray-600">
          Documents : {existingDocs.length} / {requiredDocs}
          {!hasRequired && (
            <span className="text-red-500 ml-2">(manquants)</span>
          )}
        </p>
      </div>

      {/* Show existing documents */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Documents déjà fournis</h2>
        {existingDocs.length === 0 ? (
          <p className="text-gray-500 italic">
            Aucun document pour le moment. Ajoutez-en ci-dessous pour finaliser
            votre dossier.
          </p>
        ) : (
          <ul className="space-y-1">
            {existingDocs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-2 text-sm">
                <span>📄</span>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {doc.file.split("/").pop() || `Document ${doc.id}`}
                </a>
                <span className="text-gray-400 text-xs">
                  ({new Date(doc.uploaded_at).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">
            Message / commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border rounded p-2"
            placeholder="Informations complémentaires..."
          />
        </div>

        <div className="space-y-3 border-t pt-4">
          <h2 className="font-semibold">Ajouter de nouveaux documents</h2>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition">
              Choisir des fichiers
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.png,.jpeg"
              />
            </label>
            {files.length > 0 && (
              <span className="text-sm text-gray-600">
                {files.length} fichier(s) sélectionné(s)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isRent
              ? "Permis de conduire, justificatif de revenus, RIB"
              : "Pièce d'identité, justificatif de domicile"}{" "}
            (PDF, JPG, PNG)
          </p>
          {files.length > 0 && (
            <ul className="text-sm list-disc list-inside mt-2">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Envoi en cours..." : "Ajouter les documents"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dossier")}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}
