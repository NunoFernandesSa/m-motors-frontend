"use client";

import { JSX, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/constants/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, XCircle, FileText } from "lucide-react";
import { Folder } from "@/types/backoffice-types";

/**
 * Admin folder detail page component that displays comprehensive information about a specific user submission folder,
 * including client details, vehicle information, uploaded documents, and provides validation functionality for pending folders.
 * Handles fetching folder data, processing approval/rejection actions, and rendering all folder-related content in a responsive layout.
 * @returns {JSX.Element} The rendered admin folder detail page UI
 */
export default function AdminFolderDetailPage(): JSX.Element {
  const { id } = useParams();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [validationComment, setValidationComment] = useState("");
  const [refuseError, setRefuseError] = useState("");

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/folders/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Dossier non trouvé");
        const data = await res.json();
        setFolder(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchFolder();
  }, [id]);

  const handleValidate = async (newStatus: "approved" | "rejected") => {
    if (newStatus === "rejected" && !validationComment.trim()) {
      setRefuseError("Un commentaire est obligatoire pour refuser le dossier.");
      return;
    }

    setRefuseError("");
    setActionLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const payload: { status: string; comment?: string } = {
        status: newStatus,
      };

      if (validationComment.trim()) {
        payload.comment = validationComment.trim();
      }

      const res = await fetch(`${API_URL}/folders/${id}/validate/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      let data = null;

      try {
        data = JSON.parse(responseText);
      } catch {}
      if (!res.ok) {
        throw new Error(
          data?.detail || data?.error || responseText || "Erreur",
        );
      }

      toast.success(
        `Dossier ${newStatus === "approved" ? "validé" : "refusé"} avec succès`,
      );

      // reload folder data after validation
      const refreshed = await fetch(`${API_URL}/folders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedData = await refreshed.json();

      setFolder(refreshedData);
      setValidationComment("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="container py-8">Chargement...</div>;
  if (!folder) return <div className="container py-8">Dossier introuvable</div>;

  const isRent = folder.vehicle_details.vehicle_type === "rent";
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  const statusLabels = {
    pending: "En attente",
    approved: "Validé",
    rejected: "Refusé",
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/dossiers"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la liste
        </Link>
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Dossier #{folder.id} - {folder.vehicle_details.brand}{" "}
              {folder.vehicle_details.model}
            </h1>
            <Badge className={`mt-2 ${statusColors[folder.status]}`}>
              {statusLabels[folder.status]}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Nom d&apos;utilisateur :</span>{" "}
              {folder.user_details.username}
            </p>
            <p>
              <span className="font-medium">Email :</span>{" "}
              {folder.user_details.email}
            </p>
            {/* Informations supplémentaires saisies par le client */}
            {folder.full_name && (
              <p>
                <span className="font-medium">Nom complet :</span>{" "}
                {folder.full_name}
              </p>
            )}
            {folder.phone && (
              <p>
                <span className="font-medium">Téléphone :</span> {folder.phone}
              </p>
            )}
            {folder.address && (
              <p>
                <span className="font-medium">Adresse :</span> {folder.address}
              </p>
            )}
            <p>
              <span className="font-medium">Date de création :</span>{" "}
              {new Date(folder.created_at).toLocaleString()}
            </p>
            {folder.comment && (
              <p>
                <span className="font-medium">Commentaire client :</span>{" "}
                {folder.comment}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicule demandé</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <span className="font-medium">Marque :</span>{" "}
              {folder.vehicle_details.brand}
            </p>
            <p>
              <span className="font-medium">Modèle :</span>{" "}
              {folder.vehicle_details.model}
            </p>
            <p>
              <span className="font-medium">Année :</span>{" "}
              {folder.vehicle_details.year}
            </p>
            <p>
              <span className="font-medium">Kilométrage :</span>{" "}
              {folder.vehicle_details.mileage.toLocaleString()} km
            </p>
            <p>
              <span className="font-medium">Carburant :</span>{" "}
              {folder.vehicle_details.fuel_type}
            </p>
            <p>
              <span className="font-medium">Transmission :</span>{" "}
              {folder.vehicle_details.transmission}
            </p>
            <p>
              <span className="font-medium">Couleur :</span>{" "}
              {folder.vehicle_details.color}
            </p>
            <p>
              <span className="font-medium">Prix :</span>{" "}
              {folder.vehicle_details.price} € {isRent ? "/ mois" : ""}
            </p>
          </CardContent>
        </Card>

        {folder.document_files?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Documents fournis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {folder.document_files.map((doc) => {
                  let url = doc.file;
                  if (url.startsWith("/")) url = `${API_URL}${url}`;
                  else if (!url.startsWith("http")) url = `${API_URL}/${url}`;
                  return (
                    <a
                      key={doc.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />{" "}
                      {url.split("/").pop() || `doc_${doc.id}`}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {folder.status === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Commentaire de validation{" "}
                <span className="text-red-500 text-sm">
                  (obligatoire en cas de refus)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Motif de validation / refus..."
                value={validationComment}
                onChange={(e) => {
                  setValidationComment(e.target.value);
                  setRefuseError("");
                }}
                rows={3}
              />
              {refuseError && (
                <p className="text-red-500 text-sm mt-1">{refuseError}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Ce commentaire sera visible par le client.
              </p>
            </CardContent>
          </Card>
        )}

        {folder.status === "pending" && (
          <div className="flex gap-3">
            <Button
              onClick={() => handleValidate("approved")}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Valider
            </Button>
            <Button
              onClick={() => handleValidate("rejected")}
              disabled={actionLoading || !validationComment.trim()}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-1" /> Refuser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
