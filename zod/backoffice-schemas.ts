import z from "zod";

export const vehicleSchema = z
  .object({
    brand: z.string().min(1, "Marque requise"),
    model: z.string().min(1, "Modèle requis"),
    year: z.coerce
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    mileage: z.coerce.number().int().min(0),
    fuel_type: z.enum(["essence", "diesel", "electrique", "hybride"]),
    transmission: z.enum(["manuel", "automatique"]),
    color: z.string().min(1, "Couleur requise"),
    description: z.string().optional(),
    vehicle_type: z.enum(["sale", "rent"]),
    sale_price: z.string().optional(),
    rent_price: z.string().optional(),
    rent_duration_min: z.coerce.number().int().min(1).optional(),
    is_available: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.vehicle_type === "sale" && !data.sale_price) {
      ctx.addIssue({
        path: ["sale_price"],
        message: "Prix d'achat requis",
        code: "custom",
      });
    }
    if (data.vehicle_type === "rent" && !data.rent_price) {
      ctx.addIssue({
        path: ["rent_price"],
        message: "Prix de location requis",
        code: "custom",
      });
    }
    if (data.vehicle_type === "rent" && !data.rent_duration_min) {
      ctx.addIssue({
        path: ["rent_duration_min"],
        message: "Durée minimum de location requise",
        code: "custom",
      });
    }
  });

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
