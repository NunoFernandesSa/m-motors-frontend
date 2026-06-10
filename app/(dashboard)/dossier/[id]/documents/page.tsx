"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { API_URL } from "@/constants/api";

// Type pour le véhicule (tel que retourné par l'API)
interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: string;
  vehicle_type: "sale" | "rent";
}

// Type pour le dossier avec les détails du véhicule inclus
interface Folder {
  id: number;
  comment: string;
  status: string;
  created_at: string;
  vehicle_details: Vehicle;
  document_files: any[];
}

export default function UploadDocumentsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [folder, setFolder] = useState<Folder | null>(null);
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
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Dossier non trouvé: ${res.status} - ${errorText}`);
        }
        const data = await res.json();
        console.log("📁 Dossier reçu:", data);
        setFolder(data);
        setComment(data.comment || "");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
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
      toast.error("Véhicule non trouvé dans le dossier");
      return;
    }

    const isRent = vehicle.vehicle_type === "rent";
    const requiredCount = isRent ? 3 : 2;
    if (files.length < requiredCount) {
      toast.error(
        `Veuillez sélectionner ${requiredCount} document(s) obligatoire(s)`,
      );
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Non authentifié");

      // 1. Mettre à jour le commentaire (PATCH)
      const patchRes = await fetch(`${API_URL}/folders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (!patchRes.ok) {
        const errorText = await patchRes.text();
        throw new Error(
          `Erreur mise à jour commentaire: ${patchRes.status} - ${errorText}`,
        );
      }

      // 2. Uploader chaque document
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file); // champ "file" attendu par l'API
        const uploadRes = await fetch(`${API_URL}/folders/${id}/documents/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!uploadRes.ok) {
          let errorMsg = `Erreur upload ${file.name}`;
          try {
            const errJson = await uploadRes.json();
            errorMsg += `: ${errJson.detail || errJson.message || JSON.stringify(errJson)}`;
          } catch {
            const errText = await uploadRes.text();
            if (errText) errorMsg += `: ${errText}`;
          }
          throw new Error(errorMsg);
        }
      }

      toast.success("Dossier complété avec succès");
      router.push("/dossier");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="container py-8">Chargement du dossier...</div>;
  }

  if (!folder) {
    return (
      <div className="container py-8">
        <p className="text-red-600">Dossier introuvable.</p>
        <button
          onClick={() => router.push("/dashboard/dossier")}
          className="mt-4 text-blue-600 underline"
        >
          Retour à mes dossiers
        </button>
      </div>
    );
  }

  const vehicle = folder.vehicle_details;
  if (!vehicle) {
    return (
      <div className="container py-8">Aucun véhicule associé à ce dossier.</div>
    );
  }

  const isRent = vehicle.vehicle_type === "rent";

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">
        Compléter votre dossier - {vehicle.brand} {vehicle.model}
      </h1>
      <div className="bg-gray-50 p-4 rounded mb-6">
        <p className="text-sm text-gray-600">
          Type : {isRent ? "Location" : "Achat"} - Statut :{" "}
          {folder.status || "En attente"}
        </p>
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
          <h2 className="font-semibold">
            Documents obligatoires pour {isRent ? "la location" : "l'achat"}
          </h2>
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

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Envoi en cours..." : "Finaliser le dossier"}
        </button>
      </form>
    </div>
  );
}
