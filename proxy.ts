import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // Routes publiques
  const publicPaths = ["/", "/catalogue", "/connexion", "/inscription"];
  const isPublic =
    publicPaths.includes(pathname) || pathname.startsWith("/catalogue/");

  const isBackoffice = pathname.startsWith("/backoffice");
  const isProtected = !isPublic && !isBackoffice;

  if (isPublic) {
    return NextResponse.next();
  }

  const isTokenExpired = (token: string) => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
      );

      if (refreshRes.ok) {
        const { access_token: newAccessToken } = await refreshRes.json();
        const response = NextResponse.next();
        response.cookies.set("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 15 * 60, // 15 minutes
          path: "/",
        });
        return response;
      } else {
        const response = NextResponse.redirect(
          new URL("/connexion", request.url),
        );
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    } catch (error) {
      console.error("Refresh error:", error);
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }

  return NextResponse.redirect(new URL("/connexion", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
