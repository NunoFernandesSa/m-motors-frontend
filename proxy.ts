import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role?: string;
  groups?: string[];
  [key: string]: unknown;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Routes publiques
  const publicPaths = ["/connexion", "/inscription", "/catalogue"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/catalogue/"),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // 2. Routes protégées (dashboard + backoffice)
  const isDashboard = pathname.startsWith("/dashboard");
  const isBackoffice = pathname.startsWith("/admin");
  const isDossier = pathname.startsWith("/dossier");

  // Pas de token → redirection vers connexion
  if ((isDashboard || isBackoffice || isDossier) && !accessToken) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  // 3. Vérification du rôle pour le backoffice (admin/commercial)
  if (isBackoffice && accessToken) {
    try {
      const decoded: TokenPayload = jwtDecode(accessToken);
      // Adapter selon la structure de ton token : role, groups, ou autre
      const groups = decoded.groups || [];
      const role = decoded.role;

      const isAuthorized =
        groups.includes("admin") ||
        groups.includes("commercial") ||
        role === "admin" ||
        role === "commercial";

      if (!isAuthorized) {
        // Redirige l'utilisateur non autorisé vers son dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Token invalide → déconnexion
      const response = NextResponse.redirect(
        new URL("/connexion", request.url),
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // 4. Tout est ok
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
