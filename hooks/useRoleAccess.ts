import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useRoleAccess(
  allowedRoles: Array<"admin" | "commercial" | "user">,
  redirectTo = "/",
) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "[useRoleAccess] isLoading:",
      isLoading,
      "isAuthenticated:",
      isAuthenticated,
      "user:",
      user,
    );
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log(
          "[useRoleAccess] Pas authentifié → redirection vers /connexion",
        );

        if (window.location.pathname !== "/connexion") {
          window.location.href = "/connexion";
        }
      } else if (user && !allowedRoles.includes(user.role)) {
        if (window.location.pathname !== redirectTo) {
          window.location.href = redirectTo;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo]);

  return { isLoading, isAuthenticated, user };
}
