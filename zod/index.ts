import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(150, "Trop long"),
    email: z.string().min(1, "L'email est requis").email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    password2: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.password2, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password2"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
