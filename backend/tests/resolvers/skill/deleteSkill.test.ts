import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { SubItemResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";
import { Skill as PrismaSkill } from "@prisma/client";

describe("SkillResolver - deleteSkill", () => {
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

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const existingSkillMock: PrismaSkill = {
    id: 10,
    name: "Existing Skill",
    image: "existing_skill.png",
    categoryId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;

    resolver = new SkillResolver(prismaMock);

    cookiesMock.set.mockClear();
    cookiesMock.get.mockClear();

    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.delete.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();
  });

  it("should delete a skill with associated project skills for admin user", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkillMock);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 3 });
    prismaMock.skill.delete.mockResolvedValueOnce(existingSkillMock);

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(200);
    expect(response.message).toBe("Skill and related sub-items deleted");
    expect(response.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: existingSkillMock.id } });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { skillId: existingSkillMock.id } });
    expect(prismaMock.skill.delete).toHaveBeenCalledWith({ where: { id: existingSkillMock.id } });
  });

  it("should delete a skill with no associated project skills for admin user", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkillMock);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skill.delete.mockResolvedValueOnce(existingSkillMock);

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(200);
    expect(response.message).toBe("Skill and related sub-items deleted");
  });

  it("should return 401 if user is not authenticated", async () => {
    const ctx: MyContext = { ...baseContext, user: null };

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(401);
    expect(response.message).toBe("Authentication required.");
  });

  it("should return 403 if user is not admin", async () => {
    const ctx: MyContext = { ...baseContext, user: regularUser };

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(403);
    expect(response.message).toBe("Access denied. Admin role required.");
  });

  it("should return 404 if skill does not exist", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const response: SubItemResponse = await resolver.deleteSkill(999, ctx);

    expect(response.code).toBe(404);
    expect(response.message).toBe("Skill not found");
  });

  it("should return 500 for error during skill lookup", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error("DB lookup error"));

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(500);
    expect(response.message).toBe("Error deleting skill");
  });

  it("should return 500 for error during project skill deletion", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkillMock);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error("DB projectSkill delete error"));

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(500);
    expect(response.message).toBe("Error deleting skill");
  });

  it("should return 500 for error during skill deletion", async () => {
    const ctx: MyContext = { ...baseContext, user: adminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkillMock);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.delete.mockRejectedValueOnce(new Error("DB skill delete error"));

    const response: SubItemResponse = await resolver.deleteSkill(existingSkillMock.id, ctx);

    expect(response.code).toBe(500);
    expect(response.message).toBe("Error deleting skill");
  });
});