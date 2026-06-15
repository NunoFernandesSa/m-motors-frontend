import { useAuthStore } from "@/store/authStore";

export function useRoleAccess(
  allowedRoles: Array<"admin" | "commercial" | "user">,
) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isAuthorized =
    !isLoading && isAuthenticated && user && allowedRoles.includes(user.role);

  console.log("🔑 useRoleAccess:", {
    allowedRoles,
    userRole: user?.role,
    isLoading,
    isAuthenticated,
    isAuthorized,
  });

  return { isLoading, isAuthenticated, user, isAuthorized };
}
