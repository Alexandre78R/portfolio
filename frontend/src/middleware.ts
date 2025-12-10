import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWTPayload } from "jose";
import { jwtVerify } from "jose";

export interface JWTPayloadAdmin extends JWTPayload {
  role?: string;
}
//A typed array of 8-bit unsigned integer values. 
// The contents are initialized to 0. If the requested number of bytes could not be allocated an exception is raised.
const SECRET_KEY: Uint8Array = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET ?? process.env.JWT_SECRET ?? ""
);

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(
  request: NextRequest
): Promise<ReturnType<typeof NextResponse.next>> {

  const pathname: string = request.nextUrl.pathname;
  
  // Toujours laisser passer les pages d'authentification
  if (
    pathname.startsWith("/admin/auth/login") ||
    pathname.startsWith("/admin/auth/forgotpassword") ||
    pathname.startsWith("/admin/auth/change-password")
  ) {
    return NextResponse.next();
  }

  // En développement, on ne peut pas vérifier le token dans le middleware
  // car il est stocké dans localStorage (pas accessible côté serveur)
  // La vérification sera faite par le UserContext côté client
  
  // Pour la production, on garde la vérification du cookie
  if (process.env.NODE_ENV === "production") {
    const response: ReturnType<typeof NextResponse.next> = NextResponse.next();
    const token: string | undefined = request.cookies.get("token")?.value;

    if (!token) {
      console.log("[Middleware] No token found, redirecting to login");
      response.cookies.delete("token");
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }

    try {
      const { payload }: { payload: JWTPayloadAdmin } = await jwtVerify(
        token,
        SECRET_KEY
      );

      console.log("[Middleware] Token verified, role:", payload.role);

      if (typeof payload.role !== "string" || payload.role !== "admin") {
        console.log("[Middleware] Invalid role, redirecting to 400");
        return NextResponse.redirect(new URL("/400", request.url));
      }

      return response;
    } catch (err: unknown) {
      console.error("[Middleware] JWT error:", err);
      response.cookies.delete("token");
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }
  
  // En développement, laisser passer et laisser le client gérer l'auth
  return NextResponse.next();
}