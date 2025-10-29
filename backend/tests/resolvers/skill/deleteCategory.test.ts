import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CategoryResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";
import { PrismaClient, Skill as PrismaSkill, SkillCategory as PrismaSkillCategory } from "@prisma/client";

describe("SkillResolver - deleteCategory", () => {
  let resolver: SkillResolver;
  let cookiesMock: DeepMockProxy<Cookies>;
  let reqMock: DeepMockProxy<Request>;
  let resMock: DeepMockProxy<Response>;

  const mockAdminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const mockRegularUser: User = {
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

  const mockCategory: PrismaSkillCategory = { id: 1, categoryEN: "Test Category EN", categoryFR: "Catégorie FR" };
  const mockSkills: PrismaSkill[] = [
    { id: 10, name: "Skill 1", image: "s1.png", categoryId: 1 },
    { id: 11, name: "Skill 2", image: "s2.png", categoryId: 1 },
  ];
  const skillIds: number[] = mockSkills.map((s) => s.id);

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategory.delete.mockReset();
    prismaMock.skill.findMany.mockReset();
    prismaMock.skill.deleteMany.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();

    resolver = new SkillResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;

    cookiesMock.set.mockClear();
    cookiesMock.get.mockClear();
  });


  it("should delete category with skills and projectSkills as admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: skillIds.length });
    prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: mockSkills.length });
    prismaMock.skillCategory.delete.mockResolvedValueOnce(mockCategory);

    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category and related skills deleted");
    expect(result.categories).toBeUndefined();
  });

  it("should delete category with no skills as admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce([]);
    prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategory.delete.mockResolvedValueOnce(mockCategory);

    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(200);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", async () => {
    const ctx: MyContext = { ...baseContext, user: null };
    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(401);
    expect(result.categories).toBeUndefined();
  });

  it("should return 403 if user is not admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockRegularUser };
    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(403);
    expect(result.categories).toBeUndefined();
  });

  it("should return 404 if category not found", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await resolver.deleteCategory(999, ctx);

    expect(result.code).toBe(404);
    expect(result.categories).toBeUndefined();
  });

  it.each([
    ["category lookup", () => prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("DB error"))],
    ["skill lookup", () => {
      prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.skill.findMany.mockRejectedValueOnce(new Error("DB error"));
    }],
    ["projectSkill deletion", () => {
      prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
      prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error("DB error"));
    }],
    ["skill deletion", () => {
      prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
      prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: skillIds.length });
      prismaMock.skill.deleteMany.mockRejectedValueOnce(new Error("DB error"));
    }],
    ["category final deletion", () => {
      prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
      prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
      prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: skillIds.length });
      prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: mockSkills.length });
      prismaMock.skillCategory.delete.mockRejectedValueOnce(new Error("DB error"));
    }],
  ])("should return 500 on %s error", async (_, setup) => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    setup();

    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");
    expect(result.categories).toBeUndefined();
  });
});