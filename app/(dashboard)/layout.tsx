"use client";

import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Loading } from "@/components/shared/Loading";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isAuthorized } = useRoleAccess([
    "admin",
    "commercial",
    "user",
  ]);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  console.log("📊 DashboardLayout render:", {
    isLoading,
    isAuthenticated,
    isAuthorized,
  });

  // Re-fetch user when layout mounts to ensure auth state is fresh
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    console.log("📊 DashboardLayout useEffect:", {
      isLoading,
      isAuthenticated,
      isAuthorized,
    });
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("📊 DashboardLayout: not authenticated, redirect to login");
        router.push("/connexion");
      } else if (!isAuthorized) {
        console.log("📊 DashboardLayout: not authorized");
      }
    }
  }, [isLoading, isAuthenticated, isAuthorized, router]);

  if (isLoading) {
    return <Loading fullScreen text="Chargement du tableau de bord..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-2 lg:px-8">
        {children}
      </main>
    </>
  );
}
