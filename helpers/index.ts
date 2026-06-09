/**
 *
 * @param user
 * @returns
 */
export const isCommercial = (user?: { roles?: string[] } | null): boolean => {
  if (!user) return false;
  return Array.isArray(user.roles) && user.roles.includes("commercial");
};

/**
 * Set a cookie
 * @param name
 * @param value
 * @param maxAgeSeconds
 */
export const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number,
) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
};

/**
 * Delete a cookie
 * @param name
 */
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};
