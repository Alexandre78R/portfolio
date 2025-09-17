import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";

describe("SkillResolver - createSkill", () => {
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

  const createSkillInput: CreateSkillInput = {
    name: "New Skill",
    image: "new_skill.png",
    categoryId: 1,
  };

  const mockCategory = { id: 1, categoryEN: "Programming", categoryFR: "Programmation" };
  const mockCreatedSkill = { id: 100, name: "New Skill", image: "new_skill.png", categoryId: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skill.create.mockReset();
    resolver = new SkillResolver(prismaMock);
  });

  it("should create skill as admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.create.mockResolvedValueOnce(mockCreatedSkill);

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill created successfully");
    expect(result.subItems?.[0]).toEqual(mockCreatedSkill);
  });

  it("returns 401 if no user", async () => {
    const ctx: MyContext = { ...baseContext, user: null };
    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(401);
  });

  it("returns 403 if user not admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockRegularUser };
    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(403);
  });

  it("returns 400 if category not found", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Category not found");
  });

  it("returns 500 if DB error during category lookup", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");
  });

  it("returns 500 if DB error during skill creation", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.create.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");
  });
});