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
