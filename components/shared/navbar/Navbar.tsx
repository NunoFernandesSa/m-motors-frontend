"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn/ui
import useAuthStore from "@/store/authStore";

function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;
  const userGroups = user?.groups || [];
  const isCommercial =
    userGroups.includes("commercial") || userGroups.includes("admin");
  const isAdmin = userGroups.includes("admin");

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Marque */}
        <Link href="/" className="text-xl font-bold">
          M-Motors
        </Link>

        {/* Liens centraux (publics) */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/vehicles"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/vehicles"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Catalogue
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Mes dossiers
            </Link>
          )}
          {isCommercial && (
            <Link
              href="/backoffice/vehicles"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/backoffice")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Back-office
            </Link>
          )}
        </div>

        {/* actions (publics) */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/inscription">Inscription</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Bonjour, {user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
