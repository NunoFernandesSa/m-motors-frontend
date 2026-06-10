"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { API_URL } from "@/constants/api";
import {
  DossierFormValues,
  rentDossierSchema,
  buyDossierSchema,
} from "@/zod/dashboard-schemas";
import FileButton from "@/components/dashboard/FileButton";

type Vehicle = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  vehicle_type: "sale" | "rent";
};

export default function NewDossierPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [requestType, setRequestType] = useState<"buy" | "rent" | null>(null);

  // Fichiers
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);
  const [proofOfIncomeFile, setProofOfIncomeFile] = useState<File | null>(null);
  const [ribFile, setRibFile] = useState<File | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [proofOfAddressFile, setProofOfAddressFile] = useState<File | null>(
    null,
  );
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<DossierFormValues>({
    resolver: zodResolver(
      requestType === "rent" ? rentDossierSchema : buyDossierSchema,
    ),
    defaultValues: { comment: "" },
  });

  // Charger le véhicule et déterminer le type
  useEffect(() => {
    if (!vehicleId) {
      setLoadingVehicle(false);
      return;
    }
    fetch(`${API_URL}/vehicles/${vehicleId}/`)
      .then((res) => res.json())
      .then((data: Vehicle) => {
        setVehicle(data);
        // L'API renvoie vehicle_type = "sale" ou "rent"
        // On convertit "sale" en "buy" pour notre logique interne
        const type = data.vehicle_type === "rent" ? "rent" : "buy";
        setRequestType(type);
        setLoadingVehicle(false);
      })
      .catch(() => setLoadingVehicle(false));
  }, [vehicleId]);

  // Mettre à jour la validation React Hook Form avec les fichiers
  useEffect(() => {
    if (requestType === "rent") {
      setValue("driver_license", driverLicenseFile as any);
      setValue("proof_of_income", proofOfIncomeFile as any);
      setValue("rib", ribFile as any);
      if (driverLicenseFile) trigger("driver_license");
      if (proofOfIncomeFile) trigger("proof_of_income");
      if (ribFile) trigger("rib");
    } else if (requestType === "buy") {
      setValue("identity", identityFile as any);
      setValue("proof_of_address", proofOfAddressFile as any);
      setValue("certificate", certificateFile as any);
      if (identityFile) trigger("identity");
      if (proofOfAddressFile) trigger("proof_of_address");
    }
  }, [
    requestType,
    driverLicenseFile,
    proofOfIncomeFile,
    ribFile,
    identityFile,
    proofOfAddressFile,
    certificateFile,
    setValue,
    trigger,
  ]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };

  const onSubmit = async (data: DossierFormValues) => {
    if (!user || !vehicleId || !requestType) {
      toast.error("Informations manquantes");
      return;
    }

    if (requestType === "rent") {
      if (!driverLicenseFile || !proofOfIncomeFile || !ribFile) {
        toast.error("Tous les documents pour la location sont requis");
        return;
      }
    } else {
      if (!identityFile || !proofOfAddressFile) {
        toast.error("Pièce d'identité et justificatif de domicile requis");
        return;
      }
    }

    setSubmitting(true);

    try {
      const folderPayload = {
        vehicle: parseInt(vehicleId),
        user: user.id,
        comment: data.comment || "",
        type: requestType,
      };
      const folderRes = await fetch(`${API_URL}/folders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(folderPayload),
      });

      if (!folderRes.ok) {
        const errData = await folderRes.json();
        throw new Error(errData.detail || "Erreur création dossier");
      }

      const folderData = await folderRes.json();
      const folderId = folderData.id;

      setUploading(true);
      const filesToUpload: File[] = [];
      if (requestType === "rent") {
        if (driverLicenseFile) filesToUpload.push(driverLicenseFile);
        if (proofOfIncomeFile) filesToUpload.push(proofOfIncomeFile);
        if (ribFile) filesToUpload.push(ribFile);
      } else {
        if (identityFile) filesToUpload.push(identityFile);
        if (proofOfAddressFile) filesToUpload.push(proofOfAddressFile);
        if (certificateFile) filesToUpload.push(certificateFile);
      }

      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch(
          `${API_URL}/folders/${folderId}/documents/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: formData,
          },
        );
        if (!uploadRes.ok) {
          throw new Error(`Erreur upload ${file.name}`);
        }
      }

      toast.success("Dossier créé avec succès");
      router.push("/dashboard/dossier");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (loadingVehicle)
    return <div className="container py-8">Chargement du véhicule...</div>;
  if (!vehicleId || !vehicle || !requestType)
    return <div className="container py-8">Véhicule non trouvé.</div>;

  const isRent = requestType === "rent";

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">
        Demande de {isRent ? "location" : "achat"}
      </h1>
      <div className="bg-gray-50 p-4 rounded mb-6">
        <p className="font-semibold">
          {vehicle.brand} {vehicle.model}
        </p>
        <p className="text-sm text-gray-600">
          {vehicle.year} - {vehicle.price} €
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Message (optionnel)</label>
          <textarea
            {...register("comment")}
            rows={3}
            className="w-full border rounded p-2"
            placeholder="Vos questions ou précisions..."
          />
          {errors.comment && (
            <p className="text-red-500 text-sm">{errors.comment.message}</p>
          )}
        </div>

        {isRent ? (
          <div className="space-y-3 border-t pt-4">
            <h2 className="font-semibold">
              Documents obligatoires pour la location
            </h2>
            <FileButton
              label="Permis de conduire"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(e, setDriverLicenseFile)
              }
              fileName={driverLicenseFile?.name ?? ""}
              error={(errors as any).driver_license?.message}
            />
            <FileButton
              label="Justificatif de revenus"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => handleFileChange(e, setProofOfIncomeFile)}
              fileName={proofOfIncomeFile?.name ?? ""}
              error={(errors as any).proof_of_income?.message}
            />
            <FileButton
              label="RIB"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => handleFileChange(e, setRibFile)}
              fileName={ribFile?.name ?? ""}
              error={(errors as any).rib?.message}
            />
          </div>
        ) : (
          <div className="space-y-3 border-t pt-4">
            <h2 className="font-semibold">
              Documents obligatoires pour l&apos;achat
            </h2>
            <FileButton
              label="Pièce d'identité"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => handleFileChange(e, setIdentityFile)}
              fileName={identityFile?.name ?? ""}
              error={(errors as any).identity?.message}
            />
            <FileButton
              label="Justificatif de domicile (moins de 6 mois)"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => handleFileChange(e, setProofOfAddressFile)}
              fileName={proofOfAddressFile?.name ?? ""}
              error={(errors as any).proof_of_address?.message}
            />
            <FileButton
              label="Certificat de situation (non-gage) (optionnel)"
              accept=".pdf,.jpg,.png,.jpeg"
              onChange={(e) => handleFileChange(e, setCertificateFile)}
              fileName={certificateFile?.name ?? ""}
              error={(errors as any).certificate?.message}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? uploading
              ? "Upload des documents en cours..."
              : "Création du dossier..."
            : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}
