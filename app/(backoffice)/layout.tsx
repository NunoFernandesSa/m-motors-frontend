"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Loading } from "@/components/shared/Loading";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isAuthorized } = useRoleAccess([
    "admin",
    "commercial",
  ]);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Re-fetch user when layout mounts to ensure auth state is fresh
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/connexion");
      } else if (!isAuthorized) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAuthorized, router]);

  if (isLoading) {
    return <Loading fullScreen text="Chargement du backoffice..." />;
  }

  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  return <main className="flex-1 p-6 px-2 lg:px-8">{children}</main>;
}
