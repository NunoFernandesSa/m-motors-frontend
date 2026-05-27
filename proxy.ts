import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Define the routes accessible without a connection (vehicle catalog).
  const publicPaths = ["/", "/vehicules", "/connexion", "/inscription"];
  const isPublic =
    publicPaths.includes(pathname) || pathname.startsWith("/vehicules/");

  // Define the protected area (protected).
  const isBackoffice = pathname.startsWith("/backoffice");

  // Routes requiring a connection (user dashboard).
  const isProtected = !isPublic && !isBackoffice;

  // Redirect to the login page if the route is protected and there is no token.
  if ((isProtected || isBackoffice) && !token) {
    return NextResponse.redirect(new URL("/connexion", request.url));
  }

  // Allow the request to continue normally.
  return NextResponse.next();
}

// Filter to execute the proxy only on the required routes.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
