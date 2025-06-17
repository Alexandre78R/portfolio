import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface Payload {
  email: string;
  role: string;
  id: number;
  iat?: number;
  exp?: number;
}

// const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "";
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
// console.log("SECRET_KEY -->", SECRET_KEY);

export const config = {
  matcher: ["/admin/:path*"],
};

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  // console.log("token", token);
  const response = NextResponse.next();

  // Autoriser accès libre aux pages non connecté
  if (
    pathname.startsWith("/admin/auth/login") ||
    pathname.startsWith("/admin/auth/forgotpassword")
    // pathname.startsWith("/admin/auth/register") ||
    // pathname.startsWith("/admin/auth/choicepassword")
  ) {
    // console.log("je suis là");
    return response;
  }

  // // Gestion du logout : suppression des cookies
  // if (pathname.startsWith("/admin/auth/logout")) {
  //   deleteAuthCookies(response);
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // Pas de token : redirection vers login
  if (!token) {
    console.log("!token");
    deleteAuthCookies(response);
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  // Vérification du token JWT
  try {
    const payload = await verify(token);
    
    console.log("payload", payload)
    
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

const verify = async (token: string): Promise<Payload> => {
  const { payload } = await jwtVerify(token, SECRET_KEY);

  if (
    typeof payload.id === "number" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  ) {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }

  throw new Error("Invalid JWT payload structure");
};

// Définit les cookies d'auth
const setAuthCookies = (res: NextResponse, payload: Payload): void => {
  res.cookies.set("email", payload.email);
  res.cookies.set("role", payload.role);
  res.cookies.set("id", payload.id);
};

// Supprime les cookies d'auth
const deleteAuthCookies = (res: NextResponse): void => {
  ["email", "role", "id", "token"].forEach((cookie) =>
    res.cookies.delete(cookie)
  );
};

export default middleware;