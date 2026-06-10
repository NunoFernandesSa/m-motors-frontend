"use client";
import { Loading } from "@/components/shared/Loading";
import { ADMIN_NAV_LINKS } from "@/constants/navlinks";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuthStore } from "@/store/authStore"; // à importer
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export default function BackofficeLayout({ children }: BackofficeLayoutProps) {
  const { isLoading } = useRoleAccess(["admin", "commercial"], "/");
  const pathname = usePathname();
  const { logout } = useAuthStore(); // récupère la fonction logout
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/connexion");
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
          {/* Bouton de déconnexion (et non un lien) */}
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
