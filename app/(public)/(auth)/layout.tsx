"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@/components/shared/Loading";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const target =
        user.role === "admin" || user.role === "commercial"
          ? "/admin"
          : "/dashboard";
      router.push(target);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated && user) {
    return null;
  }

  return <div>{children}</div>;
}
