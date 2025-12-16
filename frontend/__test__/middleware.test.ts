/**
 * @jest-environment node
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


const SECRET: string = "mysecret";
process.env.JWT_SECRET = SECRET;

const mockNextResponseNext = jest.fn((arg?: any) => ({ cookies: { delete: jest.fn() } }));
const mockNextResponseRedirect = jest.fn((url: string | URL) => ({ redirected: true, url }));

jest.mock("next/server", () => ({
  NextResponse: {
    next: mockNextResponseNext,
    redirect: mockNextResponseRedirect,
  },
}));

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));


let middleware: (request: NextRequest) => Promise<NextResponse>;
let config: { matcher: string[] };

const originalNodeEnv: string | undefined = process.env.NODE_ENV;

const setNodeEnv = (value: string | undefined): void => {
  Object.defineProperty(process.env, "NODE_ENV", {
    value,
    writable: true,
    configurable: true,
  });
  (process.env as Record<string, string | undefined>).NODE_ENV = value;
};

beforeAll(async () => {
  setNodeEnv("production");
  const middlewareModule = await import("@/middleware");
  middleware = middlewareModule.default;
  config = middlewareModule.config;
});


interface MockNextUrl {
  pathname: string;
  origin: string;
  toString: () => string;
  startsWith: (path: string) => boolean;
}

interface MockCookies {
  get: jest.Mock<{ name: string; value: string } | undefined, [string]>;
  delete: jest.Mock<void, [string]>;
}

interface MockNextRequest {
  nextUrl: MockNextUrl;
  cookies: MockCookies;
  url: string;
}

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

describe("Admin Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setNodeEnv("production");
  });

  afterAll(() => {
    setNodeEnv(originalNodeEnv);
  });

  it("should call NextResponse.next() for login or forgotpassword pages", async () => {
    const request: MockNextRequest = createMockRequest("http://localhost/admin/auth/login");

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(mockNextResponseNext).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should redirect to login if token is missing", async () => {
    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard");

    const response: NextResponse = await middleware(request as unknown as NextRequest);
    expect(mockNextResponseRedirect).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should redirect to /400 if role is not admin", async () => {
    const token: string = "fakeToken";
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: "user" } });

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(mockNextResponseRedirect).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should call NextResponse.next() if role is admin", async () => {
    const token: string = "adminToken";
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { role: "admin" } });

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const response: NextResponse = await middleware(request as unknown as NextRequest);

    expect(mockNextResponseNext).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should redirect to login if jwtVerify throws an error", async () => {
    const token: string = "badToken";
    (jwtVerify as jest.Mock).mockRejectedValue(new Error("invalid token"));

    const request: MockNextRequest = createMockRequest("http://localhost/admin/dashboard", token);

    const response: NextResponse = await middleware(request as unknown as NextRequest);
    expect(mockNextResponseRedirect).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("should expose the matcher correctly in the config", () => {
    expect(config.matcher).toEqual(["/admin/:path*"]);
  });
});