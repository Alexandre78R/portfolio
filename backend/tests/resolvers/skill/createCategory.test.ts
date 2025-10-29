import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateCategoryInput } from "../../../src/entities/inputs/skill.input";
import { CategoryResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";
import { PrismaClient, SkillCategory as PrismaSkillCategory } from "@prisma/client";

describe("SkillResolver - createCategory", () => {
  let skillResolver: SkillResolver;
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

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const newCategoryInput: CreateCategoryInput = {
    categoryEN: "New English Category",
    categoryFR: "Nouvelle Catégorie Française",
  };

  const createdCategoryMock: PrismaSkillCategory = {
    id: 100,
    categoryEN: newCategoryInput.categoryEN,
    categoryFR: newCategoryInput.categoryFR,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.create.mockReset();

    skillResolver = new SkillResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;

    cookiesMock.set.mockClear();
    cookiesMock.get.mockClear();
  });

  it("should successfully create a new category for admin user", async () => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.create.mockResolvedValueOnce(createdCategoryMock);

    const result: CategoryResponse = await skillResolver.createCategory(
      newCategoryInput,
      adminContext
    );

    expect(result.code).toBe<number>(200);
    expect(result.message).toBe<string>("Category created successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe<number>(1);

    const category = result.categories?.[0];
    expect(category).toEqual({
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

    const result: CategoryResponse = await skillResolver.createCategory(
      newCategoryInput,
      context
    );

    expect(result.code).toBe<number>(401);
    expect(result.message).toBe<string>("Authentication required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async () => {
    const context: MyContext = { ...baseContext, user: regularUser };

    const result: CategoryResponse = await skillResolver.createCategory(
      newCategoryInput,
      context
    );

    expect(result.code).toBe<number>(403);
    expect(result.message).toBe<string>("Access denied. Admin role required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 500 if database throws an error during category creation", async () => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.create.mockRejectedValueOnce(new Error("Database error"));

    const result: CategoryResponse = await skillResolver.createCategory(
      newCategoryInput,
      adminContext
    );

    expect(result.code).toBe<number>(500);
    expect(result.message).toBe<string>("Failed to create category");

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: newCategoryInput.categoryEN,
        categoryFR: newCategoryInput.categoryFR,
      },
    });
  });
});