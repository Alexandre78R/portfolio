import "reflect-metadata";

import { ThemeResolver } from "../../../src/resolvers/theme.resolver";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { ThemeResponse } from "../../../src/types/response.types";
import type { CreateThemeInput } from "../../../src/entities/inputs/theme.input";

type MockPrismaTheme = {
  findUnique: jest.Mock<Promise<PrismaTheme | null>, [any?]>;
  create: jest.Mock<Promise<PrismaTheme>, [any?]>;
};

describe("ThemeResolver - createTheme", () => {
  let resolver: ThemeResolver;
  let mockDb: { theme: MockPrismaTheme };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const userCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeInput: CreateThemeInput = {
    name: "newtheme",
    nameFR: "newtheme",
    nameEN: "newtheme",
    body: "#000",
    scrollHandle: "",
    scrollHandleHover: "",
    primary: "",
    secondary: "",
    success: "",
    error: "",
    warn: "",
    info: "",
    grey: "",
    placeholder: "",
    footer: "",
    admin: "",
    textDefault: "",
    text100: "",
    text200: "",
    text300: "",
    textButton: "",
    visible: true,
  };

  const fakeTheme: PrismaTheme = { ...fakeInput, id: 1 };

  beforeEach(() => {
    mockDb = {
      theme: {
        findUnique: jest.fn<Promise<PrismaTheme | null>, [any?]>(),
        create: jest.fn<Promise<PrismaTheme>, [any?]>(),
      },
    };

    resolver = new ThemeResolver(mockDb as unknown as PrismaClient);
  });

  it("should create theme for admin", async () => {
    mockDb.theme.findUnique.mockResolvedValue(null);
    mockDb.theme.create.mockResolvedValue(fakeTheme);

    const result: ThemeResponse = await resolver.createTheme(fakeInput, adminCtx);
    expect(result.code).toBe(200);
    expect(result.theme?.id).toBe(1);
    expect(mockDb.theme.findUnique).toHaveBeenCalledWith({ where: { name: fakeInput.name } });
    expect(mockDb.theme.create).toHaveBeenCalledWith({ data: fakeInput });
  });

  it("should return 403 for non-admin user", async () => {
    const result: ThemeResponse = await resolver.createTheme(fakeInput, userCtx);
    expect(result.code).toBe(403);
    expect(result.theme).toBeUndefined();
  });

  it("should return 401 if no user", async () => {
    const result: ThemeResponse = await resolver.createTheme(fakeInput, {} as MyContext);
    expect(result.code).toBe(401);
    expect(result.theme).toBeUndefined();
  });

  it("should return 400 if theme already exists", async () => {
    mockDb.theme.findUnique.mockResolvedValue(fakeTheme);

    const result: ThemeResponse = await resolver.createTheme(fakeInput, adminCtx);
    expect(result.code).toBe(400);
    expect(result.theme).toBeUndefined();
  });

  it("should handle DB errors gracefully", async () => {
    mockDb.theme.findUnique.mockRejectedValue(new Error("DB error"));

    const result: ThemeResponse = await resolver.createTheme(fakeInput, adminCtx);
    expect(result.code).toBe(500);
    expect(result.theme).toBeUndefined();
  });
});