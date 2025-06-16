import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface Payload {
  email: string;
  role: string;
  pseudo: string;
  id: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "dev-secret-key";

export const config = {
  matcher: ["/admin/:path*"],
};

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const response = NextResponse.next();

  // Autoriser accès libre à la page de login
  if (pathname.startsWith("/admin/auth/login")) {
    console.log("je suis là")
    return response;
  }

  // Gestion du logout : suppression des cookies
  if (pathname.startsWith("/admin/auth/logout")) {
    deleteAuthCookies(response);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Pas de token : redirection vers login
  if (!token) {
    deleteAuthCookies(response);
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  // Vérification du token JWT
  try {
    const payload = verify(token);

    // Vérifier si le rôle autorise l’accès
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/400", request.url));
    }

    // Token valide : poser les cookies
    setAuthCookies(response, payload);
    return response;
  } catch (err) {
    console.error("JWT verification error:", err);
    deleteAuthCookies(response);
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }
};

// Vérifie et décode le token
const verify = (token: string): Payload => {
  return jwt.verify(token, SECRET_KEY) as Payload;
};

// Définit les cookies d'auth
const setAuthCookies = (res: NextResponse, payload: Payload): void => {
  res.cookies.set("email", payload.email);
  res.cookies.set("role", payload.role);
  res.cookies.set("pseudo", payload.pseudo);
  res.cookies.set("id", payload.id);
};

// Supprime les cookies d'auth
const deleteAuthCookies = (res: NextResponse): void => {
  ["email", "role", "pseudo", "id", "token"].forEach((cookie) =>
    res.cookies.delete(cookie)
  );
};

export default middleware;