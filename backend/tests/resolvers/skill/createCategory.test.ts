import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateCategoryInput } from "../../../src/entities/inputs/skill.input";
import { CategoryResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";

describe("SkillResolver - createCategory", () => {
  let skillResolver: SkillResolver;

  const cookiesMock = mockDeep<Cookies>();

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
    // req: {} as Request,
    // res: {} as Response,
    req: {} as any,
    res: {} as any,
    cookies: cookiesMock,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const newCategoryInput: CreateCategoryInput = {
    categoryEN: "New English Category",
    categoryFR: "Nouvelle Catégorie Française",
  };

  const createdCategoryMock = {
    id: 100,
    categoryEN: newCategoryInput.categoryEN,
    categoryFR: newCategoryInput.categoryFR,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.create.mockReset();
    skillResolver = new SkillResolver(prismaMock);

    cookiesMock.set.mockClear();
    cookiesMock.get.mockClear();
  });

  it("should create a new category successfully for admin user", async () => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.create.mockResolvedValueOnce(createdCategoryMock);

    const response: CategoryResponse = await skillResolver.createCategory(newCategoryInput, adminContext);

    expect(response.code).toBe(200);
    expect(response.message).toBe("Category created successfully");
    expect(response.categories).toBeDefined();
    expect(response.categories?.length).toBe(1);
    expect(response.categories?.[0]).toEqual({
      id: createdCategoryMock.id,
      categoryEN: createdCategoryMock.categoryEN,
      categoryFR: createdCategoryMock.categoryFR,
      skills: [],
    });

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: newCategoryInput.categoryEN,
        categoryFR: newCategoryInput.categoryFR,
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const context: MyContext = { ...baseContext, user: null };

    const response: CategoryResponse = await skillResolver.createCategory(newCategoryInput, context);

    expect(response.code).toBe(401);
    expect(response.message).toBe("Authentication required.");
    expect(response.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async () => {
    const context: MyContext = { ...baseContext, user: regularUser };

    const response: CategoryResponse = await skillResolver.createCategory(newCategoryInput, context);

    expect(response.code).toBe(403);
    expect(response.message).toBe("Access denied. Admin role required.");
    expect(response.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 500 if database throws an error during category creation", async () => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    prismaMock.skillCategory.create.mockRejectedValueOnce(new Error("Database error"));

    const response: CategoryResponse = await skillResolver.createCategory(newCategoryInput, adminContext);

    expect(response.code).toBe(500);
    expect(response.message).toBe("Failed to create category");

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: newCategoryInput.categoryEN,
        categoryFR: newCategoryInput.categoryFR,
      },
    });
  });
});