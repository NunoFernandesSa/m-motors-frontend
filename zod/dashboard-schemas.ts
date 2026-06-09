import z from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Au moins 3 caractères"),
  email: z.string().email("Email invalide"),
});

export const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Mot de passe actuel requis"),
    new_password: z.string().min(6, "6 caractères minimum"),
    confirm_password: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm_password"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

/**
 * Schéma de validation pour les dossiers
 */
export const folderSchema = z
  .object({
    vehicle_id: z.number().min(1, "Veuillez sélectionner un véhicule"),
    type: z.enum(["buy", "rent"]),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    message: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "rent" && (!data.start_date || !data.end_date)) {
        return false;
      }
      return true;
    },
    { message: "Dates requises pour la location", path: ["start_date"] },
  );

export type FolderFormValues = z.infer<typeof folderSchema>;
