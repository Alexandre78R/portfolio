import "reflect-metadata";
import { SkillCategoryResolver } from "../../../src/resolvers/skillCategory.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import type { UpdateCategoryInput } from "../../../src/entities/inputs/skill.input";
import { CategoryResponse } from "../../../src/types/response.types";
import type { SkillCategoryWithSkillsDTO } from "../../../src/entities/skillCategoryWithSkillsDTO.entity";
import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";
import type { Skill as PrismaSkill, SkillCategory as PrismaSkillCategory, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

describe("SkillCategoryResolver - updateCategory", (): void => {
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

  const editorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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

  const mockSkill1: PrismaSkill = {
    id: 1,
    name: "React",
    image: "react.png",
  };

  const mockSkill2: PrismaSkill = {
    id: 2,
    name: "Vue.js",
    image: "vue.png",
  };

  const existingCategory: PrismaSkillCategory & {
    skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
  } = {
    id: 1,
    categoryEN: "Frontend",
    categoryFR: "Frontend",
    skills: [{ skillId: 1, categoryId: 1, skill: mockSkill1 }],
  };

  const updateInput: UpdateCategoryInput = {
    categoryEN: "Frontend Development",
    categoryFR: "Développement Frontend",
    skillIds: [2],
  };

  const updatedCategory: PrismaSkillCategory & {
    skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
  } = {
    id: 1,
    categoryEN: "Frontend Development",
    categoryFR: "Développement Frontend",
    skills: [{ skillId: 2, categoryId: 1, skill: mockSkill2 }],
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategory.update.mockReset();
    prismaMock.skillCategorySkill.deleteMany.mockReset();
    prismaMock.skillCategorySkill.create.mockReset();
    prismaMock.skill.findUnique.mockReset();

    resolver = new SkillCategoryResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;
  });

  it("should successfully update a category for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(existingCategory);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([{ skillId: 1, categoryId: 1 }]);
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.findMany.mockResolvedValueOnce([mockSkill2]);
    prismaMock.skillCategorySkill.create.mockResolvedValue({ skillId: 2, categoryId: 1 });
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      id: 1,
      categoryEN: "Frontend Development",
      categoryFR: "Développement Frontend",
    });
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(updatedCategory);

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      adminContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);

    const updatedCat: SkillCategoryWithSkillsDTO | undefined = result.categories?.[0];
    expect(updatedCat?.id).toBe(1);
    expect(updatedCat?.categoryEN).toBe("Frontend Development");
    expect(updatedCat?.categoryFR).toBe("Développement Frontend");

    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      unauthenticatedContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 403 if user lacks admin or editor role", async (): Promise<void> => {
    const nonAdminContext: MyContext = {
      ...baseContext,
      user: { ...adminUser, role: UserRole.view },
    };

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      nonAdminContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 404 if category does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await resolver.updateCategory(
      999,
      updateInput,
      adminContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 500 if database throws error during update", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Database update failed");

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(existingCategory);
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill2);
    prismaMock.skillCategory.update.mockRejectedValueOnce(dbError);

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      adminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");
    expect(result.categories).toBeUndefined();
  });

  it("should handle unknown error types during update", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error";

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(existingCategory);
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill2);
    prismaMock.skillCategory.update.mockRejectedValueOnce(unknownError);

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      adminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");
    expect(result.categories).toBeUndefined();
  });

  it("should allow editor user to update category", async (): Promise<void> => {
    const editorContext: MyContext = { ...baseContext, user: editorUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(existingCategory);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([{ skillId: 1, categoryId: 1 }]);
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.findMany.mockResolvedValueOnce([mockSkill2]);
    prismaMock.skillCategorySkill.create.mockResolvedValue({ skillId: 2, categoryId: 1 });
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      id: 1,
      categoryEN: "Frontend Development",
      categoryFR: "Développement Frontend",
    });
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(updatedCategory);

    const result: CategoryResponse = await resolver.updateCategory(
      1,
      updateInput,
      editorContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated successfully");
    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
  });
});
