"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { API_URL } from "@/constants/api";
import { FolderDetails } from "@/types/dashboard-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateFolderForm, updateFolderSchema } from "@/zod/dashboard-schemas";

/**
 * Page component for uploading required documents to complete a vehicle purchase or rental folder.
 * Handles folder data fetching, form submission for user details, and multi-file document uploads.
 * Validates that the minimum required number of documents are submitted based on vehicle type (purchase vs rental).
 *
 * @param id - The ID of the folder to upload documents to.
 * @returns user - The current authenticated user.
 * @returns router - The router instance for navigation.
 * @returns folder - The folder details object.
 * @returns loading - The loading state of the page.
 * @returns uploading - The uploading state of the page.
 * @returns files - The selected files for upload.
 * @returns errors - The form validation errors.
 * @returns onSubmit - The form submission handler.
 * @returns handleFileChange - The file change handler for the document input.
 */
export default function UploadDocumentsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [folder, setFolder] = useState<FolderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateFolderForm>({
    resolver: zodResolver(updateFolderSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

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
        // if data exists, fill form with it
        if (data.full_name) setValue("fullName", data.full_name);
        if (data.phone) setValue("phone", data.phone);
        if (data.address) setValue("address", data.address);
        if (data.comment) setValue("comment", data.comment);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: UpdateFolderForm) => {
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
      // Update folder info (full_name, phone, address, comment)
      await fetch(`${API_URL}/folders/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
          comment: data.comment,
        }),
      });

      // Upload new files
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

      toast.success("Dossier mis à jour avec succès");
      // Refresh folder data
      const refreshed = await fetch(`${API_URL}/folders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedData = await refreshed.json();
      setFolder(refreshedData);
      setFiles([]);
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
      <h2 className="text-2xl font-bold mb-6">
        Dossier - {vehicle.brand} {vehicle.model}
      </h2>
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
        {folder.status === "rejected" && folder.validation_comment && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
            <p className="font-semibold text-red-700">Motif du refus :</p>
            <p className="text-red-600">{folder.validation_comment}</p>
          </div>
        )}
      </div>

      {/* Existing documents list */}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Nom complet *</label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full border rounded p-2"
            placeholder="Votre nom et prénom"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Téléphone *</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full border rounded p-2"
            placeholder="06 12 34 56 78"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Adresse (optionnel)</label>
          <textarea
            {...register("address")}
            rows={2}
            className="w-full border rounded p-2"
            placeholder="Votre adresse complète"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Message / commentaire (optionnel)
          </label>
          <textarea
            {...register("comment")}
            rows={3}
            className="w-full border rounded p-2"
            placeholder="Informations complémentaires..."
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
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
            {uploading ? "Envoi en cours..." : "Envoyer les documents"}
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
