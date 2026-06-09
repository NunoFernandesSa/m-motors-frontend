"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, LogOut, Car, LayoutDashboard, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMenuButton from "./MobileMenuButton";
import Logo from "./Logo";
import { useAuthStore } from "@/store/authStore";

function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = !!user;
  const userGroups = (user as { groups?: string[] })?.groups || [];
  const isAdminOrCommercial =
    userGroups.includes("admin") || userGroups.includes("commercial");

  // Définition des liens selon le rôle
  let navLinks = [];

  if (!isAuthenticated) {
    // Public
    navLinks = [
      { href: "/catalogue", label: "Catalogue", icon: Car },
      { href: "/connexion", label: "Connexion", icon: User },
      { href: "/inscription", label: "Inscription", icon: User },
    ];
  } else if (isAdminOrCommercial) {
    // Admin / Commercial
    navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/dossiers", label: "Dossiers clients", icon: FolderOpen },
      { href: "/admin/vehicles", label: "Véhicules", icon: Car },
      { href: "/catalogue", label: "Catalogue", icon: Car },
    ];
  } else {
    // standard user
    navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dossiers", label: "Mes dossiers", icon: FolderOpen },
      { href: "/catalogue", label: "Catalogue", icon: Car },
    ];
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <Button asChild variant="default" size="default">
              <Link href="/connexion" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Connexion
              </Link>
            </Button>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                Bonjour, {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t">
            {!isAuthenticated ? (
              <Button asChild variant="default" className="w-full">
                <Link
                  href="/connexion"
                  className="flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Connexion
                </Link>
              </Button>
            ) : (
              <div className="space-y-3">
                <span className="block text-sm text-muted-foreground">
                  Bonjour, {user?.username}
                </span>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
