import "reflect-metadata";

import { ThemeResolver } from "../../../src/resolvers/theme.resolver";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { ThemesResponse } from "../../../src/types/response.types";

type MockPrismaTheme = {
  findMany: jest.Mock<Promise<PrismaTheme[]>, [any?]>;
};

describe("ThemeResolver - themeList", () => {
  let resolver: ThemeResolver;
  let mockDb: { theme: MockPrismaTheme };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const userCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeThemes: PrismaTheme[] = [
    {
      id: 1,
      name: "dark",
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
    },
    {
      id: 2,
      name: "light",
      body: "#fff",
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
      visible: false,
    },
  ];

  beforeEach(() => {
    mockDb = {
      theme: {
        findMany: jest.fn<Promise<PrismaTheme[]>, [any?]>(),
      },
    };

    resolver = new ThemeResolver(mockDb as unknown as PrismaClient);
  });

  it("should return all themes for admin", async () => {
    mockDb.theme.findMany.mockResolvedValue(fakeThemes);

    const result: ThemesResponse = await resolver.themeList(adminCtx);
    expect(result.code).toBe(200);
    expect(result.themes).toHaveLength(2);
    expect(mockDb.theme.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { id: "desc" },
    });
  });

  it("should return only visible themes for non-admin users", async () => {
    mockDb.theme.findMany.mockResolvedValue(fakeThemes.filter(t => t.visible));

    const result: ThemesResponse = await resolver.themeList(userCtx);
    expect(result.code).toBe(200);
    expect(result.themes).toHaveLength(1);
    expect(result.themes?.[0].visible).toBe(true);
    expect(mockDb.theme.findMany).toHaveBeenCalledWith({
      where: { visible: true },
      orderBy: { id: "desc" },
    });
  });

  it("should handle database errors gracefully", async () => {
    mockDb.theme.findMany.mockRejectedValue(new Error("DB error"));

    const result: ThemesResponse = await resolver.themeList(adminCtx);
    expect(result.code).toBe(500);
    expect(result.themes).toBeUndefined();
  });
});