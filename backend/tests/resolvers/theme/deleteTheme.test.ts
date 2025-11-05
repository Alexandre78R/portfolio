import "reflect-metadata";

import { ThemeResolver } from "../../../src/resolvers/theme.resolver";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { ThemeResponse } from "../../../src/types/response.types";

// Mock types pour Prisma
type MockPrismaTheme = {
  findUnique: jest.Mock<Promise<PrismaTheme | null>, [any?]>;
  delete: jest.Mock<Promise<PrismaTheme>, [any?]>;
};

describe("ThemeResolver - deleteTheme", () => {
  let resolver: ThemeResolver;
  let mockDb: { theme: MockPrismaTheme };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const userCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeTheme: PrismaTheme = {
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

  beforeEach(() => {
    mockDb = {
      theme: {
        findUnique: jest.fn<Promise<PrismaTheme | null>, [any?]>(),
        delete: jest.fn<Promise<PrismaTheme>, [any?]>(),
      },
    };

    resolver = new ThemeResolver(mockDb as unknown as PrismaClient);
  });

  it("should delete theme for admin", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => fakeTheme);
    mockDb.theme.delete.mockImplementation(async () => fakeTheme);

    const result: ThemeResponse = await resolver.deleteTheme(1, adminCtx);
    expect(result.code).toBe(200);
    expect(result.message).toBe("Theme deleted successfully");
    expect(mockDb.theme.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return 403 for non-admin user", async () => {
    const result: ThemeResponse = await resolver.deleteTheme(1, userCtx);
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
  });

  it("should return 401 if no user", async () => {
    const result: ThemeResponse = await resolver.deleteTheme(1, {} as MyContext);
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
  });

  it("should return 404 if theme does not exist", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => null);

    const result: ThemeResponse = await resolver.deleteTheme(999, adminCtx);
    expect(result.code).toBe(404);
    expect(result.message).toBe("Theme not found");
  });

  it("should handle database errors gracefully", async () => {
    mockDb.theme.findUnique.mockImplementation(async () => {
      throw new Error("DB error");
    });

    const result: ThemeResponse = await resolver.deleteTheme(1, adminCtx);
    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
  });
});