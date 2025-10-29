import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";
import { PrismaClient, Skill as PrismaSkill, SkillCategory as PrismaSkillCategory } from "@prisma/client";

describe("SkillResolver - createSkill", () => {
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

  const createSkillInput: CreateSkillInput = {
    name: "New Skill",
    image: "new_skill.png",
    categoryId: 1,
  };

  const mockCategory: PrismaSkillCategory = { id: 1, categoryEN: "Programming", categoryFR: "Programmation" };
  const mockCreatedSkill: PrismaSkill = { id: 100, name: "New Skill", image: "new_skill.png", categoryId: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skill.create.mockReset();

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

  it("should create a skill successfully for admin user", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.create.mockResolvedValueOnce(mockCreatedSkill);

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(200);
    expect(result.message).toBe<string>("Skill created successfully");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe<number>(1);
    expect(result.subItems?.[0]).toEqual(mockCreatedSkill);
  });

  it("should return 401 if user is not authenticated", async () => {
    const ctx: MyContext = { ...baseContext, user: null };
    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(401);
    expect(result.subItems).toBeUndefined();
  });

  it("should return 403 if user is not admin", async () => {
    const ctx: MyContext = { ...baseContext, user: mockRegularUser };
    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(403);
    expect(result.subItems).toBeUndefined();
  });

  it("should return 400 if category is not found", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(400);
    expect(result.message).toBe<string>("Category not found");
    expect(result.subItems).toBeUndefined();
  });

  it("should return 500 if DB error occurs during category lookup", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(500);
    expect(result.message).toBe<string>("Failed to create skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should return 500 if DB error occurs during skill creation", async () => {
    const ctx: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.create.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.createSkill(createSkillInput, ctx);

    expect(result.code).toBe<number>(500);
    expect(result.message).toBe<string>("Failed to create skill");
    expect(result.subItems).toBeUndefined();
  });
});