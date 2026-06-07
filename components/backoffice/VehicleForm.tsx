"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/types";
import { useVehicleStore } from "@/store/vehicleStore";
import { VehicleFormValues, vehicleSchema } from "@/zod/backoffice-schemas";
import Image from "next/image";
import { Textarea } from "../ui/textarea";

interface VehicleFormProps {
  vehicle?: Vehicle;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const { addVehicle, updateVehicle } = useVehicleStore();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    (Array.isArray(vehicle?.images) ? vehicle.images[0] : vehicle?.images) ||
      null,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as never,
    defaultValues: vehicle
      ? {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          vehicle_type: vehicle.vehicle_type,
          sale_price: vehicle.sale_price || "",
          rent_price: vehicle.rent_price || "",
          description: vehicle.description || "",
        }
      : {
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          mileage: 0,
          vehicle_type: "sale",
          sale_price: "",
          rent_price: "",
          description: "",
        },
  });

  const vehicleType = watch("vehicle_type");

  const onSubmit = async (data: VehicleFormValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("year", data.year.toString());
    formData.append("mileage", data.mileage.toString());
    formData.append("vehicle_type", data.vehicle_type);
    if (data.sale_price) formData.append("sale_price", data.sale_price);
    if (data.rent_price) formData.append("rent_price", data.rent_price);
    if (data.description) formData.append("description", data.description);
    if (imageFile) formData.append("images", imageFile);

    let success = false;
    if (vehicle) {
      success = await updateVehicle(vehicle.id, formData);
    } else {
      success = await addVehicle(formData);
    }
    setLoading(false);
    if (success) {
      toast.success(vehicle ? "Véhicule modifié" : "Véhicule ajouté");
      router.push("/backoffice/vehicules");
    } else {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {vehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marque</Label>
              <Input id="brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model">Modèle</Label>
              <Input id="model" {...register("model")} />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" {...register("year")} />
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input id="mileage" type="number" {...register("mileage")} />
              {errors.mileage && (
                <p className="text-red-500 text-sm">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="vehicle_type">Type d&apos;offre</Label>
            <Select
              value={vehicleType}
              onValueChange={(value) =>
                setValue("vehicle_type", value as "sale" | "rent")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Achat</SelectItem>
                <SelectItem value="rent">Location LLD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {vehicleType === "sale" && (
            <div>
              <Label htmlFor="sale_price">Prix d&apos;achat (€)</Label>
              <Input
                id="sale_price"
                type="number"
                {...register("sale_price")}
              />
              {errors.sale_price && (
                <p className="text-red-500 text-sm">
                  {errors.sale_price.message}
                </p>
              )}
            </div>
          )}

          {vehicleType === "rent" && (
            <div>
              <Label htmlFor="rent_price">Prix de location (€/mois)</Label>
              <Input
                id="rent_price"
                type="number"
                {...register("rent_price")}
              />
              {errors.rent_price && (
                <p className="text-red-500 text-sm">
                  {errors.rent_price.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>

          <div>
            <Label htmlFor="image">Image principale</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {currentImageUrl && !imageFile && (
              <div className="mt-2">
                <Image
                  src={currentImageUrl}
                  alt="Current"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded"
                />
                <p className="text-xs text-muted-foreground">Image actuelle</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Enregistrement..."
                : vehicle
                  ? "Mettre à jour"
                  : "Ajouter"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
