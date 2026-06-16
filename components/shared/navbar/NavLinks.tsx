"use client";

/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- React/Next -----
import { useRouter } from "next/navigation";
import Link from "next/link";
// ----- Zustand -----
import { useAuthStore } from "@/store/authStore";
// ----- Icons -----
import {
  Car,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

interface NavLinksProps {
  onClose: () => void;
}

/**
 * Renders core navigation links with conditional rendering for authenticated users, admins, and guest users.
 * Handles user authentication state, admin access checks, and logout functionality while providing
 * consistent styling and click handlers for mobile menu management.
 */
const NavLinks = ({ onClose }: NavLinksProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === "admin" || user?.role === "commercial";

  const handleLogout = async () => {
    await logout();
    router.replace("/connexion");
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <Link
        href="/catalogue"
        onClick={handleLinkClick}
        className="flex items-center gap-2 hover:text-blue-600 transition-colors"
      >
        <Car className="h-4 w-4" />
        Catalogue
      </Link>
      {user && !isAdmin && (
        <Link
          href="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          Admin
        </Link>
      )}
      {!user ? (
        <>
          <Link
            href="/connexion"
            onClick={handleLinkClick}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Connexion
          </Link>
          <Link
            href="/inscription"
            onClick={handleLinkClick}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Inscription
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      )}
    </>
  );
};

export default NavLinks;
