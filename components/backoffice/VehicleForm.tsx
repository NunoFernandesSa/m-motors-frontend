"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
// ----- Zod -----
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleFormValues, vehicleSchema } from "@/zod/backoffice-schemas";
// ----- Components -----
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
// ----- Types -----
import { Vehicle } from "@/types";
// ----- Store Zustand -----
import { useVehicleStore } from "@/store/vehicleStore";
// ----- Constants -----
import { API_URL } from "@/constants/api";

export interface VehicleFormProps {
  vehicle?: Vehicle;
}

/**
 * Vehicle form component for creating or updating vehicle records.
 * @param props - VehicleFormProps object containing the component's properties.
 * @returns JSX.Element - The rendered vehicle form component.
 * */
export function VehicleForm({ vehicle }: VehicleFormProps): JSX.Element {
  const router = useRouter();
  const { addVehicle, updateVehicle } = useVehicleStore();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const existingImages = vehicle?.images || [];

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
          fuel_type: vehicle.fuel_type as
            | "essence"
            | "diesel"
            | "electrique"
            | "hybride",
          transmission: vehicle.transmission as "manuel" | "automatique",
          color: vehicle.color,
          description: vehicle.description || "",
          vehicle_type: vehicle.vehicle_type,
          sale_price: vehicle.sale_price || "",
          rent_price: vehicle.rent_price || "",
          rent_duration_min: vehicle.rent_duration_min || 12,
          is_available: vehicle.is_available ?? true,
        }
      : {
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          mileage: 0,
          fuel_type: "essence",
          transmission: "manuel",
          color: "",
          description: "",
          vehicle_type: "sale",
          sale_price: "",
          rent_price: "",
          rent_duration_min: 12,
          is_available: true,
        },
  });

  const vehicleType = watch("vehicle_type");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImageFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data: VehicleFormValues) => {
    //!!! Log pour déboguer
    console.log("=== FORM DATA DEBUG ===");
    console.log("Nombre d'images:", imageFiles.length);
    for (let i = 0; i < imageFiles.length; i++) {
      console.log(`Image ${i}:`, imageFiles[i].name, imageFiles[i].size);
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("year", data.year.toString());
    formData.append("mileage", data.mileage.toString());
    formData.append("fuel_type", data.fuel_type);
    formData.append("transmission", data.transmission);
    formData.append("color", data.color);
    if (data.description) formData.append("description", data.description);
    formData.append("vehicle_type", data.vehicle_type);
    formData.append("is_available", String(data.is_available));

    if (data.vehicle_type === "sale") {
      if (data.sale_price) formData.append("sale_price", data.sale_price);
    } else {
      if (data.rent_price) formData.append("rent_price", data.rent_price);
      if (data.rent_duration_min)
        formData.append("rent_duration_min", data.rent_duration_min.toString());
    }

    // Add images to FormData
    for (const file of imageFiles) {
      formData.append("uploaded_images", file);
    }

    //!!! Log pour déboguer
    console.log("FormData entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    let success = false;
    if (vehicle) {
      success = await updateVehicle(vehicle.id, formData);
    } else {
      success = await addVehicle(formData);
    }
    setLoading(false);
    if (success) {
      toast.success(vehicle ? "Véhicule modifié" : "Véhicule ajouté");
      router.push("/admin/vehicules");
    } else {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Construct complete URL for each existing image
  const getImageUrl = (imageObj: { image?: string }) => {
    if (!imageObj?.image) return null;
    const url = imageObj.image;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {vehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marque *</Label>
              <Input id="brand" {...register("brand")} />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="model">Modèle *</Label>
              <Input id="model" {...register("model")} />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Année *</Label>
              <Input id="year" type="number" {...register("year")} />
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="mileage">Kilométrage *</Label>
              <Input id="mileage" type="number" {...register("mileage")} />
              {errors.mileage && (
                <p className="text-red-500 text-sm">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fuel_type">Carburant *</Label>
              <Select
                value={watch("fuel_type")}
                onValueChange={(value) =>
                  setValue(
                    "fuel_type",
                    value as "essence" | "diesel" | "electrique" | "hybride",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essence">Essence</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electrique">Électrique</SelectItem>
                  <SelectItem value="hybride">Hybride</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuel_type && (
                <p className="text-red-500 text-sm">
                  {errors.fuel_type.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <Select
                value={watch("transmission")}
                onValueChange={(value) =>
                  setValue("transmission", value as "manuel" | "automatique")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manuel">Manuelle</SelectItem>
                  <SelectItem value="automatique">Automatique</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmission && (
                <p className="text-red-500 text-sm">
                  {errors.transmission.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="color">Couleur *</Label>
            <Input id="color" {...register("color")} />
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={4} {...register("description")} />
          </div>

          <div>
            <Label htmlFor="vehicle_type">Type d&apos;offre *</Label>
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
              <Label htmlFor="sale_price">Prix d&apos;achat (€) *</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
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
            <>
              <div>
                <Label htmlFor="rent_price">Prix de location (€/mois) *</Label>
                <Input
                  id="rent_price"
                  type="number"
                  step="0.01"
                  {...register("rent_price")}
                />
                {errors.rent_price && (
                  <p className="text-red-500 text-sm">
                    {errors.rent_price.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="rent_duration_min">
                  Durée minimum (mois) *
                </Label>
                <Input
                  id="rent_duration_min"
                  type="number"
                  {...register("rent_duration_min")}
                />
                {errors.rent_duration_min && (
                  <p className="text-red-500 text-sm">
                    {errors.rent_duration_min.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="is_available">Disponible</Label>
            <Switch
              id="is_available"
              checked={watch("is_available")}
              onCheckedChange={(checked) => setValue("is_available", checked)}
            />
          </div>

          {/* Upload multiple images field */}
          <div>
            <Label htmlFor="image">Images (plusieurs fichiers possibles)</Label>
            <Input
              id="image"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
            {vehicle?.images &&
              vehicle.images.length > 0 &&
              imageFiles.length === 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Images actuelles :
                  </p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {vehicle.images.map((img, idx) => {
                      const url = getImageUrl(
                        typeof img === "string" ? { image: img } : img,
                      );
                      return url ? (
                        <div key={idx} className="relative w-20 h-20">
                          <Image
                            src={url}
                            alt={`existing-${idx}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
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
