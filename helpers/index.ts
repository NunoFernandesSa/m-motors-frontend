/**
 *
 * @param user
 * @returns
 */
export const isCommercial = (user?: { roles?: string[] } | null): boolean => {
  if (!user) return false;
  return Array.isArray(user.roles) && user.roles.includes("commercial");
};
