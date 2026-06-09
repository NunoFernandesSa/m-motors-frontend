import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role: string;
  [key: string]: unknown;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques
  const publicPaths = ["/connexion", "/inscription", "/catalogue"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/catalogue/"),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Routes dashboard (user connecté)
  const isDashboard = pathname.startsWith("/dashboard");
  const isBackoffice = pathname.startsWith("/admin");

  if ((isDashboard || isBackoffice) && !accessToken) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  // Option : vérifier le rôle pour /admin (décodage simple)
  if (isBackoffice && accessToken) {
    try {
      const decoded: TokenPayload = jwtDecode(accessToken);
      const role = decoded.role; // à adapter selon ton token
      if (role !== "admin" && role !== "commercial") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
