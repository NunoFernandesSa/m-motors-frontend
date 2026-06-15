"use client";

import Link from "next/link";
import { Car, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-9xl font-bold text-muted-foreground/20">404</div>
        <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 text-primary" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-3">Page introuvable</h1>

      <p className="text-muted-foreground max-w-md mb-8">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition"
        >
          <Home className="h-4 w-4" />
          Accueil
        </Link>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 border border-input bg-background px-5 py-2.5 rounded-lg hover:bg-accent transition"
        >
          <Car className="h-4 w-4" />
          Voir le catalogue
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </div>
    </div>
  );
}
