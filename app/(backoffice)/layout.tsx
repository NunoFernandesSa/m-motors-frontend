"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Car,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

// Utilitaire simple pour fusionner les classes CSS
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface BackofficeLayoutProps {
  children: ReactNode;
}

export default function BackofficeLayout({ children }: BackofficeLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems = [
    { title: "Tableau de bord", href: "/backoffice", icon: LayoutDashboard },
    {
      title: "Dossiers clients",
      href: "/backoffice/dossiers",
      icon: FolderOpen,
    },
    { title: "Véhicules", href: "/backoffice/vehicles", icon: Car },
    { title: "Utilisateurs", href: "/backoffice/users", icon: Users },
    { title: "Paramètres", href: "/backoffice/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixe */}
      <aside className="w-64 border-r bg-muted/40 p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Backoffice</h2>
          <p className="text-sm text-muted-foreground">
            {user?.username} (
            {(user as unknown as { groups?: string[] })?.groups?.join(", ") ||
              "admin"}
            )
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        <Button
          variant="outline"
          className="mt-4 w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
