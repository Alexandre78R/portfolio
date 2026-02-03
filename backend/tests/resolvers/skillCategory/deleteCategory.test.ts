import "reflect-metadata";
import { SkillCategoryResolver } from "../../../src/resolvers/skillCategory.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import { CategoryResponse } from "../../../src/types/response.types";
import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import type { SkillCategory as PrismaSkillCategory } from "@prisma/client";
import Cookies from "cookies";

type MockSkillCategory = PrismaSkillCategory;

describe("SkillCategoryResolver - deleteCategory", (): void => {
  let resolver: SkillCategoryResolver;
  let cookiesMock: DeepMockProxy<Cookies>;
  let reqMock: DeepMockProxy<Request>;
  let resMock: DeepMockProxy<Response>;

  const adminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const regularUser: User = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseContext: MyContext = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategorySkill.deleteMany.mockReset();
    prismaMock.skillCategory.delete.mockReset();

    resolver = new SkillCategoryResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;
  });

  it("should successfully delete a category for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    const mockCategory: MockSkillCategory = {
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategory.delete.mockResolvedValueOnce({
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    });

    const result: CategoryResponse = await resolver.deleteCategory(1, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category deleted successfully");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategorySkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: CategoryResponse = await resolver.deleteCategory(
      1,
      unauthenticatedContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async (): Promise<void> => {
    const nonAdminContext: MyContext = { ...baseContext, user: regularUser };

    const result: CategoryResponse = await resolver.deleteCategory(
      1,
      nonAdminContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if category does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await resolver.deleteCategory(
      999,
      adminContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors during deletion", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Database deletion failed");

    const mockCategory: MockSkillCategory = {
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategory.delete.mockRejectedValueOnce(dbError);

    const result: CategoryResponse = await resolver.deleteCategory(1, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.delete).toHaveBeenCalledTimes(1);
  });

  it("should handle unknown error types during deletion", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error format";

    const mockCategory: MockSkillCategory = {
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategory.delete.mockRejectedValueOnce(unknownError);

    const result: CategoryResponse = await resolver.deleteCategory(1, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");
    expect(result.categories).toBeUndefined();
  });

  it("should delete associated skill category skill junctions before deleting category", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    const mockCategory: MockSkillCategory = {
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.skillCategory.delete.mockResolvedValueOnce({
      id: 1,
      categoryEN: "Test Category",
      categoryFR: "Catégorie Test",
    });

    await resolver.deleteCategory(1, adminContext);

    // Verify that junctions were deleted before category
    const deleteJunctionsCall = prismaMock.skillCategorySkill.deleteMany.mock.invocationCallOrder[0];
    const deleteCategoryCall = prismaMock.skillCategory.delete.mock.invocationCallOrder[0];

    expect(deleteJunctionsCall).toBeLessThan(deleteCategoryCall);
    expect(prismaMock.skillCategorySkill.deleteMany).toHaveBeenCalledWith({
      where: { categoryId: 1 },
    });
  });

  it("should correctly call Prisma delete with category ID parameter", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    const mockCategory: MockSkillCategory = {
      id: 42,
      categoryEN: "Test",
      categoryFR: "Test",
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategory.delete.mockResolvedValueOnce({
      id: 42,
      categoryEN: "Test",
      categoryFR: "Test",
    });

    await resolver.deleteCategory(42, adminContext);

    expect(prismaMock.skillCategory.delete).toHaveBeenCalledWith({
      where: { id: 42 },
    });
  });
});
