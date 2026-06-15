"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@/components/shared/Loading";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  console.log("🔒 AuthLayout render:", { isLoading, isAuthenticated, user });

  useEffect(() => {
    console.log("🔒 AuthLayout useEffect triggered:", {
      isLoading,
      isAuthenticated,
      user,
    });
    if (!isLoading && isAuthenticated && user) {
      const target =
        user.role === "admin" || user.role === "commercial"
          ? "/admin"
          : "/dashboard";
      console.log("🔒 AuthLayout redirecting to:", target);
      // Utiliser replace au lieu de push pour éviter l'histoire de back button
      router.replace(target);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <Loading fullScreen text="Vérification de l'authentification..." />;
  }

  if (isAuthenticated && user) {
    return <Loading fullScreen text="Redirection..." />;
  }

  return <div>{children}</div>;
}
