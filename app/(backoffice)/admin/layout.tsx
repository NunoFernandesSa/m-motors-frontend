"use client";
import { Loading } from "@/components/shared/Loading";
import { ADMIN_NAV_LINKS } from "@/constants/navlinks";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuthStore } from "@/store/authStore"; // à importer
import { BackofficeLayoutProps } from "@/types/backoffice-types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react";

/**
 * Backoffice layout component that provides the admin interface structure
 * Includes sidebar navigation, authentication checks, and main content area
 * @param {BackofficeLayoutProps} { children } - React children to render in the main content area
 * @returns {JSX.Element} The rendered backoffice layout
 */
export default function BackofficeLayout({
  children,
}: BackofficeLayoutProps): JSX.Element {
  const { isLoading, isAuthorized } = useRoleAccess(["admin", "commercial"]);
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/catalogue");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 p-4">
        <h2 className="text-lg font-bold mb-4">Backoffice M-motors</h2>
        <nav className="space-y-1">
          {ADMIN_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* logout button */}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted text-red-600"
          >
            Déconnexion
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
