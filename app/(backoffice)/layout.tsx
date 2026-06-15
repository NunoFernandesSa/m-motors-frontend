"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Loading } from "@/components/shared/Loading";

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
    return <Loading />;
  }

  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  return <main className="flex-1 p-6">{children}</main>;
}
