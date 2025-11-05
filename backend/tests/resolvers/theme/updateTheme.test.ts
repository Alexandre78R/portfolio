import "reflect-metadata";

import { ThemeResolver } from "../../../src/resolvers/theme.resolver";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { ThemeResponse } from "../../../src/types/response.types";
import type { UpdateThemeInput } from "../../../src/entities/inputs/theme.input";

// Mock types pour Prisma
type MockPrismaTheme = {
  findUnique: jest.Mock<Promise<PrismaTheme | null>, [any?]>;
  update: jest.Mock<Promise<PrismaTheme>, [any?]>;
};

describe("ThemeResolver - updateTheme", () => {
  let resolver: ThemeResolver;
  let mockDb: { theme: MockPrismaTheme };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const userCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeExisting: PrismaTheme = {
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
  };

  const updateInput: UpdateThemeInput = { id: 1, name: "dark-updated" };
  const updatedTheme: PrismaTheme = { ...fakeExisting, ...updateInput };

  beforeEach(() => {
    mockDb = {
      theme: {
        findUnique: jest.fn<Promise<PrismaTheme | null>, [any?]>(),
        update: jest.fn<Promise<PrismaTheme>, [any?]>(),
      },
    };

    resolver = new ThemeResolver(mockDb as unknown as PrismaClient);
  });

  it("should update theme for admin", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => fakeExisting);
    mockDb.theme.update.mockImplementation(async () => updatedTheme);

    const result: ThemeResponse = await resolver.updateTheme(updateInput, adminCtx);
    expect(result.code).toBe(200);
    expect(result.theme?.name).toBe("dark-updated");
    expect(mockDb.theme.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateInput });
  });

  it("should return 403 for non-admin user", async () => {
    const result: ThemeResponse = await resolver.updateTheme(updateInput, userCtx);
    expect(result.code).toBe(403);
    expect(result.theme).toBeUndefined();
  });

  it("should return 401 if no user", async () => {
    const result: ThemeResponse = await resolver.updateTheme(updateInput, {} as MyContext);
    expect(result.code).toBe(401);
    expect(result.theme).toBeUndefined();
  });

  it("should return 404 if theme does not exist", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => null);

    const result: ThemeResponse = await resolver.updateTheme(updateInput, adminCtx);
    expect(result.code).toBe(404);
    expect(result.theme).toBeUndefined();
  });

  it("should handle database errors gracefully", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => {
      throw new Error("DB error");
    });

    const result: ThemeResponse = await resolver.updateTheme(updateInput, adminCtx);
    expect(result.code).toBe(500);
    expect(result.theme).toBeUndefined();
  });
});