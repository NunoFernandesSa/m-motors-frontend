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

/**
 * Schéma de validation pour les dossiers
 */
export const baseDossierSchema = z.object({
  comment: z.string().optional(),
});

// Schéma pour la location (tous les fichiers sont requis)
export const rentDossierSchema = z.object({
  comment: z.string().optional(),
  driver_license: z.instanceof(File, {
    message: "Le permis de conduire est obligatoire",
  }),
  proof_of_income: z.instanceof(File, {
    message: "Le justificatif de revenus est obligatoire",
  }),
  rib: z.instanceof(File, { message: "Le RIB est obligatoire" }),
});

// Schéma pour l'achat (identité et justificatif requis, certificat optionnel)
export const buyDossierSchema = z.object({
  comment: z.string().optional(),
  identity: z.instanceof(File, {
    message: "La pièce d'identité est obligatoire",
  }),
  proof_of_address: z.instanceof(File, {
    message: "Le justificatif de domicile est obligatoire",
  }),
  certificate: z.instanceof(File).optional(),
});

export const updateFolderSchema = z.object({
  fullName: z.string().min(2, "Nom complet requis (minimum 2 caractères)"),
  phone: z.string().regex(/^[0-9+\s]{10,}$/, "Numéro de téléphone invalide"),
  address: z.string().optional(),
  comment: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type UpdateFolderForm = z.infer<typeof updateFolderSchema>;
// Type union pour les valeurs du formulaire
export type DossierFormValues =
  | z.infer<typeof rentDossierSchema>
  | z.infer<typeof buyDossierSchema>;
