import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useRoleAccess(
  allowedRoles: Array<"admin" | "commercial" | "user">,
  redirectTo = "/",
) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && window.location.pathname !== "/connexion") {
        window.location.href = "/connexion";
      } else if (
        user &&
        !allowedRoles.includes(user.role) &&
        window.location.pathname !== redirectTo
      ) {
        setTimeout(() => {
          if (window.location.pathname !== redirectTo) {
            window.location.href = redirectTo;
          }
        }, 50);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo]);

  return { isLoading, isAuthenticated, user };
}
