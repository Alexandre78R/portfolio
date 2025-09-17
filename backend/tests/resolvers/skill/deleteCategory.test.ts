import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CategoryResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";

describe("SkillResolver - deleteCategory", () => {
  let resolver: SkillResolver;

  const mockCookies = mockDeep<Cookies>();

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

  const baseContext: MyContext = {
    // req: {} as Request,
    // res: {} as Response,
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const mockCategory = { id: 1, categoryEN: "Test Category EN", categoryFR: "Catégorie FR" };
  const mockSkills = [
    { id: 10, name: "Skill 1", categoryId: 1, image: "s1.png" },
    { id: 11, name: "Skill 2", categoryId: 1, image: "s2.png" },
  ];
  const skillIds = mockSkills.map(s => s.id);

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategory.delete.mockReset();
    prismaMock.skill.findMany.mockReset();
    prismaMock.skill.deleteMany.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();

    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  // --- SUCCESS CASES ---
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

  // --- AUTHORIZATION CASES ---
  it("returns 401 if no user", async () => {
    const ctx: MyContext = { ...baseContext, user: null };
    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(401);
  });

  it("returns 403 if user is not admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockRegularUser };
    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(403);
  });

  // --- NOT FOUND CASE ---
  it("returns 404 if category not found", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await resolver.deleteCategory(999, ctx);

    expect(result.code).toBe(404);
  });

  // --- SERVER ERRORS ---
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
  ])("returns 500 on %s error", async (_, setup) => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    setup();

    const result: CategoryResponse = await resolver.deleteCategory(mockCategory.id, ctx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");
  });
});