import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

/**
 * Hook pour protéger les routes selon le rôle de l'utilisateur.
 * @param allowedRoles - Liste des rôles autorisés (ex: ['admin', 'commercial'])
 * @param redirectTo - Chemin de redirection si rôle non autorisé (défaut: '/')
 * @returns { isLoading, isAuthenticated, user }
 */
export function useRoleAccess(
  allowedRoles: Array<"admin" | "commercial" | "user">,
  redirectTo = "/",
) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/connexion");
      } else if (user && !allowedRoles.includes(user.role)) {
        router.push(redirectTo);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router]);

  return { isLoading, isAuthenticated, user };
}
