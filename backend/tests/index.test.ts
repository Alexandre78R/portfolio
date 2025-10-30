/* --- Mock setup BEFORE imports --- */
import { Request, Response } from "express";
import Cookies from "cookies";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

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
  req: mockDeep<Request>(),    // mock profond typé
  res: mockDeep<Response>(),   // mock profond typé
  cookies: cookiesMock,        // utiliser le mock fourni
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
    expect(context.cookies).toBe(cookiesMock); // ✅ maintenant ça passe
  });
});

/* --- Module Exports / Interfaces Tests --- */
describe("Module Exports", (): void => {
  it("should export JwtPayload interface structure", (): void => {
    const payload: JwtPayload = { id: 123 };
    expect(payload.id).toBe(123);
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
});