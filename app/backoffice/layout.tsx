"use client";
import { Loading } from "@/components/shared/Loading";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useRoleAccess(["admin", "commercial"], "/");
  if (isLoading) return <Loading />;
  return <>{children}</>;
}
