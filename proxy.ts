import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role?: string;
  groups?: string[];
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Pages d’authentification : rediriger vers dashboard/admin si déjà connecté
  const authPages = ["/connexion", "/inscription"];
  if (authPages.includes(pathname) && accessToken) {
    try {
      const decoded: TokenPayload = jwtDecode(accessToken);
      const groups = decoded.groups || [];
      const role = decoded.role;
      const isAdmin =
        groups.includes("admin") ||
        groups.includes("commercial") ||
        role === "admin" ||
        role === "commercial";
      const redirectUrl = isAdmin ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch {
      // Token invalide : on laisse passer (redirection vers connexion plus tard)
    }
  }

  // 2. Routes publiques (catalogue)
  const publicPaths = ["/", "/catalogue"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/catalogue/"),
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // 3. Routes protégées (dashboard, admin, dossier) nécessitent un token
  const isDashboard = pathname.startsWith("/dashboard");
  const isBackoffice = pathname.startsWith("/admin");
  const isDossier = pathname.startsWith("/dossier");

  if ((isDashboard || isBackoffice || isDossier) && !accessToken) {
    const response = NextResponse.redirect(new URL("/connexion", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  // 4. Vérification des rôles pour le backoffice
  if (isBackoffice && accessToken) {
    try {
      const decoded: TokenPayload = jwtDecode(accessToken);
      const groups = decoded.groups || [];
      const role = decoded.role;
      const isAuthorized =
        groups.includes("admin") ||
        groups.includes("commercial") ||
        role === "admin" ||
        role === "commercial";
      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/connexion", request.url),
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
