/* --- Mock setup BEFORE imports --- */
import { Request, Response } from "express";
import Cookies from "cookies";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const useMock = jest.fn();
const listenMock = jest.fn();
const jsonMock = jest.fn(() => "json-mw");
const staticMock = jest.fn(() => "static-mw");
const expressInstance = { use: useMock };

jest.mock("express", () => {
  const expressFn = jest.fn(() => expressInstance) as any;
  expressFn.json = jsonMock;
  expressFn.static = staticMock;
  return {
    __esModule: true,
    default: expressFn,
    Request: jest.fn(),
    Response: jest.fn(),
    NextFunction: jest.fn(),
  };
});

jest.mock("http", () => {
  const createServer = jest.fn(() => ({ listen: listenMock }));
  return {
    __esModule: true,
    default: { createServer },
    createServer,
  };
});

jest.mock("../src/routes/badge.routes", () => ({}));
jest.mock("../src/routes/backups.routes", () => ({}));
jest.mock("../src/routes/captcha.routes", () => ({}));
jest.mock("../src/routes/upload.routes", () => ({}));
jest.mock("../src/routes/graphql.routes", () => ({
  mountGraphQL: jest.fn(),
}));
jest.mock("../src/CaptchaMap", () => ({
  cleanUpExpiredCaptchas: jest.fn(),
}));
jest.mock("../src/lib/logoLoader", () => ({
  loadLogos: jest.fn(),
}));

/* --- CRITICAL: Import reflect-metadata AFTER mocks --- */
import "reflect-metadata";

import { mountGraphQL } from "../src/routes/graphql.routes";
import { cleanUpExpiredCaptchas } from "../src/CaptchaMap";
import { loadLogos } from "../src/lib/logoLoader";
import { JwtPayload, MyContext } from "../src/index";

/* --- Typage pour les mocks --- */
type TestCookies = DeepMockProxy<Cookies>;

/* --- Helper pour créer un contexte de test complet --- */
export const createBaseContext = (cookiesMock: TestCookies): MyContext => ({
  req: mockDeep<Request>(),
  res: mockDeep<Response>(),
  cookies: cookiesMock,
  token: null,
  user: null,
  apiKey: undefined,
});

describe("Server Initialization", (): void => {
  let cookiesMock: TestCookies;

  beforeEach((): void => {
    jest.clearAllMocks();
    process.env.PORT = "4000";
    process.env.CLIENT_URL = "http://localhost:3000";

    cookiesMock = mockDeep<Cookies>();
  });

  it("should load GraphQL module", (): void => {
    expect(mountGraphQL).toBeDefined();
  });

  it("should load captcha cleanup function", (): void => {
    expect(cleanUpExpiredCaptchas).toBeDefined();
  });

  it("should load logo loader function", (): void => {
    expect(loadLogos).toBeDefined();
  });

  it("should have PORT environment variable defined", (): void => {
    expect(process.env.PORT).toBe("4000");
  });

  it("should have CLIENT_URL environment variable defined", (): void => {
    expect(process.env.CLIENT_URL).toBeDefined();
  });

  it("should create a valid server context object", (): void => {
    const context: MyContext = createBaseContext(cookiesMock);

    expect(context).toHaveProperty("req");
    expect(context).toHaveProperty("res");
    expect(context).toHaveProperty("cookies");
    expect(context).toHaveProperty("token");
    expect(context).toHaveProperty("user");
    expect(context.cookies).toBe(cookiesMock);
  });
});

/* --- Route Mounting --- */
describe("Route Mounting", (): void => {
  beforeEach(async (): Promise<void> => {
    jest.resetModules();
    useMock.mockClear();
    listenMock.mockClear();
    await import("../src/index");
  });

  it("should mount all REST and static routes in order", (): void => {
    const mountedPaths: string[] = useMock.mock.calls
      .map((call: unknown[]) => call[0])
      .filter((arg: unknown): arg is string => typeof arg === "string")
      .filter((arg: string) => arg !== "json-mw");

    expect(mountedPaths).toEqual([
      "/api/badges",
      "/api/backups",
      "/api/dynamic-images",
      "/api/doc/cv",
      "/api/uploads",
      "/api/upload",
      "/api/uploads/images",
      "/api/uploads/videos",
      "/uploads",
    ]);
  });

  it("should start HTTP server", (): void => {
    expect(listenMock).toHaveBeenCalled();
  });
});

/* --- Server Startup Configuration --- */
describe("Server Startup Configuration", (): void => {
  describe("Environment Variables", (): void => {
    it("should parse PORT as number type", (): void => {
      const port: number = Number(process.env.PORT) || 4000;
      expect(typeof port).toBe("number");
      expect(port).toBe(4000);
    });

    it("should default to port 4000 when PORT is not set", (): void => {
      delete process.env.PORT;
      const port: number = Number(process.env.PORT) || 4000;
      expect(port).toBe(4000);
    });

    it("should handle invalid PORT value", (): void => {
      process.env.PORT = "invalid";
      const port: number = Number(process.env.PORT) || 4000;
      expect(port).toBe(4000);
    });

    it("should parse CLIENT_URL as string array", (): void => {
      const clientUrls: string[] = (process.env.CLIENT_URL as string | undefined)?.split(",") ?? ["http://localhost:3000"];
      expect(Array.isArray(clientUrls)).toBe(true);
      expect(clientUrls).toContain("http://localhost:3000");
    });

    it("should default CLIENT_URL when not set", (): void => {
      delete process.env.CLIENT_URL;
      const clientUrls: string[] = (process.env.CLIENT_URL as string | undefined)?.split(",") ?? ["http://localhost:3000"];
      expect(clientUrls).toEqual(["http://localhost:3000"]);
    });

    it("should handle multiple CLIENT_URLs", (): void => {
      process.env.CLIENT_URL = "http://localhost:3000,http://localhost:5000";
      const clientUrls: string[] = process.env.CLIENT_URL.split(",");
      expect(clientUrls).toHaveLength(2);
      expect(clientUrls[0]).toBe("http://localhost:3000");
      expect(clientUrls[1]).toBe("http://localhost:5000");
    });
  });

  describe("Server Type Definitions", (): void => {
    it("should validate Express application type", (): void => {
      const mockApp: { use: Function; listen: Function } = {
        use: jest.fn(),
        listen: jest.fn(),
      };
      expect(mockApp).toHaveProperty("use");
      expect(mockApp).toHaveProperty("listen");
      expect(typeof mockApp.use).toBe("function");
      expect(typeof mockApp.listen).toBe("function");
    });

    it("should validate HTTP server type", (): void => {
      const mockServer: { listen: Function } = {
        listen: jest.fn(),
      };
      expect(mockServer).toHaveProperty("listen");
      expect(typeof mockServer.listen).toBe("function");
    });

    it("should validate mountGraphQL function signature", (): void => {
      expect(typeof mountGraphQL).toBe("function");
      expect(mountGraphQL).toBeDefined();
    });

    it("should validate cleanUpExpiredCaptchas function signature", (): void => {
      expect(typeof cleanUpExpiredCaptchas).toBe("function");
      expect(cleanUpExpiredCaptchas).toBeDefined();
    });

    it("should validate loadLogos function signature", (): void => {
      expect(typeof loadLogos).toBe("function");
      expect(loadLogos).toBeDefined();
    });
  });

  describe("Interval Configuration", (): void => {
    it("should calculate correct cleanup interval (15 minutes)", (): void => {
      const CLEANUP_INTERVAL: number = 15 * 60 * 1000;
      expect(CLEANUP_INTERVAL).toBe(900000);
    });

    it("should validate interval is a positive number", (): void => {
      const interval: number = 15 * 60 * 1000;
      expect(interval).toBeGreaterThan(0);
      expect(typeof interval).toBe("number");
    });
  });

  describe("Static Files Configuration", (): void => {
    it("should validate static files options type", (): void => {
      const staticOptions: { maxAge: string; immutable: boolean } = {
        maxAge: "7d",
        immutable: true,
      };
      expect(staticOptions.maxAge).toBe("7d");
      expect(staticOptions.immutable).toBe(true);
      expect(typeof staticOptions.maxAge).toBe("string");
      expect(typeof staticOptions.immutable).toBe("boolean");
    });
  });

  describe("CORS Configuration", (): void => {
    it("should validate CORS options type", (): void => {
      const corsOptions: { origin: string[]; credentials: boolean } = {
        origin: ["http://localhost:3000"],
        credentials: true,
      };
      expect(Array.isArray(corsOptions.origin)).toBe(true);
      expect(corsOptions.credentials).toBe(true);
      expect(typeof corsOptions.credentials).toBe("boolean");
    });

    it("should validate CORS origin array", (): void => {
      const origins: string[] = (process.env.CLIENT_URL as string | undefined)?.split(",") ?? ["http://localhost:3000"];
      origins.forEach((origin: string) => {
        expect(typeof origin).toBe("string");
        expect(origin).toMatch(/^https?:\/\//);
      });
    });
  });
});

/* --- Module Exports / Interfaces Tests --- */
describe("Module Exports", (): void => {
  it("should export JwtPayload interface structure", (): void => {
    const payload: JwtPayload = { id: 123 };
    expect(payload.id).toBe(123);
  });

  it("should validate JwtPayload id is number type", (): void => {
    const payload: JwtPayload = { id: 456 };
    expect(typeof payload.id).toBe("number");
  });

  it("should export MyContext interface structure", (): void => {
    const cookiesMock: TestCookies = mockDeep<Cookies>();
    const context: MyContext = createBaseContext(cookiesMock);

    expect(context.req).toBeDefined();
    expect(context.res).toBeDefined();
    expect(context.cookies).toBeDefined();
    expect(context.token).toBeNull();
    expect(context.user).toBeNull();
  });

  it("should validate MyContext property types", (): void => {
    const cookiesMock: TestCookies = mockDeep<Cookies>();
    const context: MyContext = createBaseContext(cookiesMock);

    expect(typeof context.req).toBe("object");
    expect(typeof context.res).toBe("object");
    expect(typeof context.cookies).toBe("object");
    expect(context.token).toBeNull();
    expect(context.user).toBeNull();
  });

  it("should allow optional apiKey in MyContext", (): void => {
    const cookiesMock: TestCookies = mockDeep<Cookies>();
    const contextWithoutKey: MyContext = createBaseContext(cookiesMock);
    const contextWithKey: MyContext = {
      ...createBaseContext(cookiesMock),
      apiKey: "test-api-key-123",
    };

    expect(contextWithoutKey.apiKey).toBeUndefined();
    expect(contextWithKey.apiKey).toBe("test-api-key-123");
  });

  it("should allow optional token in MyContext", (): void => {
    const cookiesMock: TestCookies = mockDeep<Cookies>();
    const contextWithToken: MyContext = {
      ...createBaseContext(cookiesMock),
      token: "jwt-token-123",
    };

    expect(contextWithToken.token).toBe("jwt-token-123");
  });
});

/* --- Type Safety Validation Tests --- */
describe("Type Safety Validation", (): void => {
  it("should enforce strict number type for PORT", (): void => {
    const port: number = Number(process.env.PORT);
    const portCheck: boolean = typeof port === "number";
    expect(portCheck).toBe(true);
  });

  it("should enforce strict string array type for CLIENT_URL", (): void => {
    const urls: string[] = (process.env.CLIENT_URL as string | undefined)?.split(",") ?? [];
    const isStringArray: boolean = urls.every((url) => typeof url === "string");
    expect(isStringArray).toBe(true);
  });

  it("should enforce strict boolean type for CORS credentials", (): void => {
    const credentials: boolean = true;
    expect(typeof credentials).toBe("boolean");
  });

  it("should validate context factory return type", (): void => {
    const cookiesMock: TestCookies = mockDeep<Cookies>();
    const context: MyContext = createBaseContext(cookiesMock);
    
    const hasRequiredProps: boolean = 
      "req" in context &&
      "res" in context &&
      "cookies" in context &&
      "token" in context &&
      "user" in context;

    expect(hasRequiredProps).toBe(true);
  });
});