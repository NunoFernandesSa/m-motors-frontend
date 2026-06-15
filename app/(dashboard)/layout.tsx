"use client";

import Footer from "@/components/shared/footer/Footer";
import Navbar from "@/components/shared/navbar/Navbar";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { Loading } from "@/components/shared/Loading";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useRoleAccess([
    "admin",
    "commercial",
    "user",
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/connexion");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 container mx-auto py-8">{children}</main>
      <Footer />
    </>
  );
}
