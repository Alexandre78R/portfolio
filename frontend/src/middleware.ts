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
  process.env.JWT_SECRET ?? ""
);

export const config = {
  matcher: ["/admin/:path*"],
};

export default async function middleware(
  request: NextRequest
): Promise<ReturnType<typeof NextResponse.next>> {

  const response: ReturnType<typeof NextResponse.next> = NextResponse.next();

  const token: string | undefined = request.cookies.get("token")?.value;

  const pathname: string = request.nextUrl.pathname;
  if (
    pathname.startsWith("/admin/auth/login") ||
    pathname.startsWith("/admin/auth/forgotpassword")
  ) {
    return response;
  }

  if (!token) {
    response.cookies.delete("token");
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  try {
    const { payload }: { payload: JWTPayloadAdmin } = await jwtVerify(
      token,
      SECRET_KEY
    );

    if (typeof payload.role !== "string" || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/400", request.url));
    }

    return response;
  } catch (err: unknown) {
    console.error("JWT error:", err);
    response.cookies.delete("token");
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }
}