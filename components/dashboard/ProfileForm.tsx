"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";
import { toast } from "sonner";
import {
  PasswordFormValues,
  passwordSchema,
  ProfileFormValues,
  profileSchema,
} from "@/zod/dashboard-schemas";

/**
 * Profile form component for updating user profile.
 * @param param0
 * @param param0.user - User object
 * @returns JSX.Element - Profile form component
 */
export function ProfileForm({ user }: { user: User }): JSX.Element {
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: user.username, email: user.email },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: pErrors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/auth/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: data.username, email: data.email }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      toast.success("Profil mis à jour");
      // Reload user profile
      useAuthStore.getState().fetchUser();
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/auth/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: data.current_password,
          new_password: data.new_password,
        }),
      });
      if (!res.ok) throw new Error("Mot de passe incorrect ou erreur");
      toast.success("Mot de passe changé, veuillez vous reconnecter");
      reset();
      setTimeout(() => logout(), 2000);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Erreur";
      toast.error(errMsg);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile form for updating user profile */}
      <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
          <Input id="username" {...register("username")} />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>

      {/* Password form */}
      <form
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Changer de mot de passe</h3>
        <div>
          <Label htmlFor="current_password">Mot de passe actuel</Label>
          <Input
            id="current_password"
            type="password"
            {...registerPassword("current_password")}
          />
          {pErrors.current_password && (
            <p className="text-red-500 text-sm">
              {pErrors.current_password.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="new_password">Nouveau mot de passe</Label>
          <Input
            id="new_password"
            type="password"
            {...registerPassword("new_password")}
          />
          {pErrors.new_password && (
            <p className="text-red-500 text-sm">
              {pErrors.new_password.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm_password">
            Confirmer le nouveau mot de passe
          </Label>
          <Input
            id="confirm_password"
            type="password"
            {...registerPassword("confirm_password")}
          />
          {pErrors.confirm_password && (
            <p className="text-red-500 text-sm">
              {pErrors.confirm_password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPasswordLoading}>
          {isPasswordLoading ? "Changement..." : "Changer le mot de passe"}
        </Button>
      </form>
    </div>
  );
}
