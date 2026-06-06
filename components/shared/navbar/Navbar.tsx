"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/constants/navlinks";
import MobileMenuButton from "./MobileMenuButton";
import Logo from "./Logo";
import { useAuthStore } from "@/store/authStore";

function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Effect of scroll for slightly transparent/shadowed background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = !!user;
  const userGroups = user?.groups || [];
  const isCommercial =
    userGroups.includes("commercial") || userGroups.includes("admin");
  const isAdmin = userGroups.includes("admin");

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (link.public) return true;
    if (!isAuthenticated) return false;

    return typeof link.condition === "function" ? link.condition(user) : true;
  });

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo & Brand */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
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
          {visibleLinks.map((link) => (
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
