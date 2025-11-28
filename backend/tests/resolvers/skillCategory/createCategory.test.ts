import "reflect-metadata";
import { SkillCategoryResolver } from "../../../src/resolvers/skillCategory.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import type { CreateCategoryInput } from "../../../src/entities/inputs/skill.input";
import { CategoryResponse } from "../../../src/types/response.types";
import type { SkillCategoryWithSkillsDTO } from "../../../src/entities/skillCategoryWithSkillsDTO.entity";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import type { SkillCategory as PrismaSkillCategory, Skill as PrismaSkill, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

type MockSkillCategoryWithSkills = PrismaSkillCategory & {
  skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
};

describe("SkillCategoryResolver - createCategory", (): void => {
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

  const newCategoryInput: CreateCategoryInput = {
    categoryEN: "Frontend Development",
    categoryFR: "Développement Frontend",
  };

  const createdCategoryMock: PrismaSkillCategory = {
    id: 100,
    categoryEN: newCategoryInput.categoryEN,
    categoryFR: newCategoryInput.categoryFR,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skillCategory.create.mockReset();

    resolver = new SkillCategoryResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;

    cookiesMock.set.mockClear();
    cookiesMock.get.mockClear();
  });

  it("should successfully create a new category for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    const createdCategoryWithSkills: MockSkillCategoryWithSkills = {
      ...createdCategoryMock,
      skills: [] as (PrismaSkillCategorySkill & { skill: PrismaSkill })[],
    };

    prismaMock.skillCategory.create.mockResolvedValueOnce(createdCategoryMock);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(createdCategoryWithSkills);

    const result: CategoryResponse = await resolver.createCategory(
      newCategoryInput,
      adminContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category created successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);

    const createdCategory: SkillCategoryWithSkillsDTO | undefined = result.categories?.[0];
    expect(createdCategory?.id).toBe(100);
    expect(createdCategory?.categoryEN).toBe("Frontend Development");
    expect(createdCategory?.categoryFR).toBe("Développement Frontend");
    expect(createdCategory?.skills).toEqual([]);

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: newCategoryInput.categoryEN,
        categoryFR: newCategoryInput.categoryFR,
      },
    });
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: CategoryResponse = await resolver.createCategory(
      newCategoryInput,
      unauthenticatedContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async (): Promise<void> => {
    const nonAdminContext: MyContext = { ...baseContext, user: regularUser };

    const result: CategoryResponse = await resolver.createCategory(
      newCategoryInput,
      nonAdminContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 500 if database throws an error during category creation", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Database error");

    prismaMock.skillCategory.create.mockRejectedValueOnce(dbError);

    const result: CategoryResponse = await resolver.createCategory(
      newCategoryInput,
      adminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create category");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: newCategoryInput.categoryEN,
        categoryFR: newCategoryInput.categoryFR,
      },
    });
  });

  it("should handle unknown error types during creation", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error occurred";

    prismaMock.skillCategory.create.mockRejectedValueOnce(unknownError);

    const result: CategoryResponse = await resolver.createCategory(
      newCategoryInput,
      adminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create category");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
  });

  it("should correctly validate input data before creation", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.create.mockResolvedValueOnce(createdCategoryMock);

    await resolver.createCategory(newCategoryInput, adminContext);

    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: "Frontend Development",
        categoryFR: "Développement Frontend",
      },
    });
  });
});
