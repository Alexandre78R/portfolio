/**
 * @jest-environment node
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ---------------------------
// Set JWT_SECRET before imports
// ---------------------------
const SECRET: string = "mysecret";
process.env.JWT_SECRET = SECRET;

// ---------------------------
// Jest Mocks
// ---------------------------
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn((): { cookies: { delete: jest.Mock<void, [string]> } } => ({
      cookies: {
        delete: jest.fn(),
      },
    })),
    redirect: jest.fn((url: string | URL): { redirected: boolean; url: string | URL } => ({ redirected: true, url })),
  },
}));

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

// ---------------------------
// Import middleware AFTER mocks
// ---------------------------
let middleware: (request: NextRequest) => Promise<NextResponse>;
let config: { matcher: string[] };

beforeAll(async () => {
  const middlewareModule = await import("@/middleware");
  middleware = middlewareModule.default;
  config = middlewareModule.config;
});

// ---------------------------
// Helper Types
// ---------------------------
interface MockNextUrl {
  pathname: string;
  origin: string;
  toString: () => string;
  startsWith: (path: string) => boolean;
}

interface MockCookies {
  get: jest.Mock<{ name: string; value: string } | undefined, [string]>;
  delete: jest.Mock<void, [string]>;
  // on peut ajouter les méthodes utilisées si besoin (size, getAll, etc.) plus tard
}

interface MockNextRequest {
  nextUrl: MockNextUrl;
  cookies: MockCookies;
  url: string;
}

// ---------------------------
// Helper Function
// ---------------------------
const createMockRequest = (url: string, cookieValue?: string): MockNextRequest => {
  const mockUrl = new URL(url);

  const mockNextUrl: MockNextUrl = {
    pathname: mockUrl.pathname,
    origin: mockUrl.origin,
    toString: () => mockUrl.toString(),
    startsWith: (path: string) => mockUrl.pathname.startsWith(path),
  };

  const mockCookies: MockCookies = {
    get: jest.fn((name: string) => (cookieValue ? { name, value: cookieValue } : undefined)),
    delete: jest.fn(),
  };

  return {
    nextUrl: mockNextUrl,
    cookies: mockCookies,
    url,
  };
};

// ---------------------------
// Tests
// ---------------------------
describe("Admin Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call NextResponse.next() for login or forgotpassword pages", async () => {
    const request: MockNextRequest = createMockRequest("http://localhost/admin/auth/login");

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should redirect to login if token is missing", async () => {
    const mockResponse = { cookies: { delete: jest.fn() } };
    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard");

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(mockResponse.cookies.delete).toHaveBeenCalledWith("token");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/admin/auth/login", request.url));
    expect(response).toBeDefined();
  });

  it("should redirect to /400 if role is not admin", async () => {
    const token: string = "fakeToken";
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: "user" } });

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(jwtVerify).toHaveBeenCalledWith(token, expect.any(Uint8Array));
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/400", request.url));
    expect(response).toBeDefined();
  });

  it("should call NextResponse.next() if role is admin", async () => {
    const token: string = "adminToken";
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: "admin" } });

    const responseObj = { cookies: { delete: jest.fn() } };
    (NextResponse.next as jest.Mock).mockReturnValue(responseObj);

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(jwtVerify).toHaveBeenCalledWith(token, expect.any(Uint8Array));
    expect(response).toBe(responseObj);
  });

  it("should redirect to login if jwtVerify throws an error", async () => {
    const token: string = "badToken";
    (jwtVerify as jest.Mock).mockRejectedValue(new Error("invalid token"));

    const mockResponse = { cookies: { delete: jest.fn() } };
    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(consoleSpy).toHaveBeenCalledWith("JWT error:", expect.any(Error));
    expect(mockResponse.cookies.delete).toHaveBeenCalledWith("token");
    expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/admin/auth/login", request.url));

    consoleSpy.mockRestore();
    expect(response).toBeDefined();
  });

  it("should expose the matcher correctly in the config", () => {
    expect(config.matcher).toEqual(["/admin/:path*"]);
  });
});