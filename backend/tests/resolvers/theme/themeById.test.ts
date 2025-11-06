import "reflect-metadata";

import { ThemeResolver } from "../../../src/resolvers/theme.resolver";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { ThemeResponse } from "../../../src/types/response.types";

type MockPrismaTheme = {
  findFirst: jest.Mock<Promise<PrismaTheme | null>, [any?]>;
};

describe("ThemeResolver - themeById", () => {
  let resolver: ThemeResolver;
  let mockDb: { theme: MockPrismaTheme };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const userCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeTheme: PrismaTheme = {
    id: 1,
    name: "dark",
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

  beforeEach(() => {
    mockDb = {
      theme: {
        findFirst: jest.fn<Promise<PrismaTheme | null>, [any?]>(),
      },
    };

    resolver = new ThemeResolver(mockDb as unknown as PrismaClient);
  });

  it("should return theme for admin ignoring visibility", async () => {
    mockDb.theme.findFirst.mockResolvedValue(fakeTheme);

    const result: ThemeResponse = await resolver.themeById(1, adminCtx);
    expect(result.code).toBe(200);
    expect(result.theme?.id).toBe(1);
    expect(mockDb.theme.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return theme only if visible for non-admin", async () => {
    mockDb.theme.findFirst.mockResolvedValue(fakeTheme);

    const result: ThemeResponse = await resolver.themeById(1, userCtx);
    expect(result.code).toBe(200);
    expect(result.theme?.visible).toBe(true);
    expect(mockDb.theme.findFirst).toHaveBeenCalledWith({
      where: { id: 1, visible: true },
    });
  });

  it("should return 404 if theme not found", async () => {
    mockDb.theme.findFirst.mockResolvedValue(null);

    const result: ThemeResponse = await resolver.themeById(999, adminCtx);
    expect(result.code).toBe(404);
    expect(result.theme).toBeUndefined();
  });

  it("should handle DB errors gracefully", async () => {
    mockDb.theme.findFirst.mockRejectedValue(new Error("DB error"));

    const result: ThemeResponse = await resolver.themeById(1, adminCtx);
    expect(result.code).toBe(500);
    expect(result.theme).toBeUndefined();
  });
});