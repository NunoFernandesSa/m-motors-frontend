"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/constants/api";
import { FolderFormValues, folderSchema } from "@/zod/dashboard-schemas";

export default function NewFolderPage() {
  const { user } = useAuthStore();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: { type: "buy" },
  });

  const type = watch("type");

  // Charger les véhicules (endpoint public)
  useEffect(() => {
    fetch(`${API_URL}/vehicles/`)
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  const onSubmit = async (data: FolderFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/folders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          user_id: user?.id,
          ...data,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Dossier envoyé avec succès");
      // Redirection vers la liste des dossiers (si tu as une page)
      // router.push("/dashboard/folders");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">
        Nouvelle demande (achat/location)
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Type de demande */}
        <div>
          <label className="block font-medium">Type</label>
          <div className="flex gap-4 mt-1">
            <label>
              <input type="radio" value="buy" {...register("type")} /> Achat
            </label>
            <label>
              <input type="radio" value="rent" {...register("type")} /> Location
            </label>
          </div>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* Véhicule */}
        <div>
          <label className="block font-medium">Véhicule</label>
          <select
            {...register("vehicle_id", { valueAsNumber: true })}
            className="w-full border rounded p-2"
          >
            <option value="">Sélectionnez</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model}
              </option>
            ))}
          </select>
          {errors.vehicle_id && (
            <p className="text-red-500 text-sm">{errors.vehicle_id.message}</p>
          )}
        </div>

        {/* Dates si location */}
        {type === "rent" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Date début</label>
              <input
                type="date"
                {...register("start_date")}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-medium">Date fin</label>
              <input
                type="date"
                {...register("end_date")}
                className="w-full border rounded p-2"
              />
            </div>
            {errors.start_date && (
              <p className="text-red-500 text-sm">
                {errors.start_date.message}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block font-medium">Message (optionnel)</label>
          <textarea
            {...register("message")}
            rows={3}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}
