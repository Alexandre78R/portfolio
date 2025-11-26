import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import type { CreateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/types/response.types";
import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";
import type { Skill as PrismaSkill, SkillCategory as PrismaSkillCategory } from "@prisma/client";

describe("SkillResolver - createSkill", (): void => {
  let resolver: SkillResolver;
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

  const newSkillInput: CreateSkillInput = {
    name: "React",
    image: "react.png",
    categoryId: 1,
  };

  const newSkillInputNoCategory: CreateSkillInput = {
    name: "Vue.js",
    image: "vue.png",
  };

  const createdSkillMock: PrismaSkill = {
    id: 100,
    name: newSkillInput.name,
    image: newSkillInput.image,
  };

  const mockCategory: PrismaSkillCategory = {
    id: 1,
    categoryEN: "Frontend",
    categoryFR: "Frontend",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skill.create.mockReset();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategorySkill.create.mockReset();
    prismaMock.skill.delete.mockReset();

    resolver = new SkillResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;
  });

  it("should successfully create a new skill with category for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.create.mockResolvedValueOnce(createdSkillMock);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategorySkill.create.mockResolvedValueOnce({
      skillId: 100,
      categoryId: 1,
    });

    const result: SubItemResponse = await resolver.createSkill(newSkillInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill created successfully");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);

    const createdSkill: PrismaSkill = result.subItems?.[0];
    expect(createdSkill?.id).toBe(100);
    expect(createdSkill?.name).toBe("React");
    expect(createdSkill?.image).toBe("react.png");
    expect(createdSkill?.categoryId).toBe(1);

    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategorySkill.create).toHaveBeenCalledTimes(1);
  });

  it("should successfully create a skill without category for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    const skillWithoutCatMock: PrismaSkill = {
      id: 101,
      name: newSkillInputNoCategory.name,
      image: newSkillInputNoCategory.image,
    };

    prismaMock.skill.create.mockResolvedValueOnce(skillWithoutCatMock);

    const result: SubItemResponse = await resolver.createSkill(
      newSkillInputNoCategory,
      adminContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill created successfully");
    expect(result.subItems?.length).toBe(1);

    const createdSkill: PrismaSkill = result.subItems?.[0];
    expect(createdSkill?.categoryId).toBe(0);

    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skillCategorySkill.create).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: SubItemResponse = await resolver.createSkill(
      newSkillInput,
      unauthenticatedContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async (): Promise<void> => {
    const nonAdminContext: MyContext = { ...baseContext, user: regularUser };

    const result: SubItemResponse = await resolver.createSkill(
      newSkillInput,
      nonAdminContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 400 if category does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.create.mockResolvedValueOnce(createdSkillMock);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);
    prismaMock.skill.delete.mockResolvedValueOnce(createdSkillMock);

    const result: SubItemResponse = await resolver.createSkill(newSkillInput, adminContext);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Category not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if database throws error during skill creation", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Database error");

    prismaMock.skill.create.mockRejectedValueOnce(dbError);

    const result: SubItemResponse = await resolver.createSkill(newSkillInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
  });

  it("should handle unknown error types during creation", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error occurred";

    prismaMock.skill.create.mockRejectedValueOnce(unknownError);

    const result: SubItemResponse = await resolver.createSkill(newSkillInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should correctly call Prisma create with input data", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.create.mockResolvedValueOnce(createdSkillMock);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skillCategorySkill.create.mockResolvedValueOnce({
      skillId: 100,
      categoryId: 1,
    });

    await resolver.createSkill(newSkillInput, adminContext);

    expect(prismaMock.skill.create).toHaveBeenCalledWith({
      data: {
        name: newSkillInput.name,
        image: newSkillInput.image,
      },
    });
  });
});
