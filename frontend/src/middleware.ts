import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const token = request.cookies.get("token")?.value;

  if (
    request.nextUrl.pathname.startsWith("/admin/auth/login") ||
    request.nextUrl.pathname.startsWith("/admin/auth/forgotpassword")
  ) {
    return response;
  }

  if (!token) {
    response.cookies.delete("token");
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (typeof payload.role !== "string" || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/400", request.url));
    }

    return response;
  } catch (err) {
    console.error("JWT error:", err);
    response.cookies.delete("token");
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }
}