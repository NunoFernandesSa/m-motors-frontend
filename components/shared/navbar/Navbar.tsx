"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const isAdmin =
    (user as unknown as { groups?: string[] })?.groups?.includes("admin") ||
    (user as unknown as { groups?: string[] })?.groups?.includes("commercial");

  return (
    <nav className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">
          M-Motors
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/catalogue" className="hover:text-blue-600">
            Catalogue
          </Link>
          {user && (
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="hover:text-blue-600">
              Admin
            </Link>
          )}
          {!user ? (
            <>
              <Link href="/connexion" className="hover:text-blue-600">
                Connexion
              </Link>
              <Link href="/inscription" className="hover:text-blue-600">
                Inscription
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
