import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import { SubItemResponse } from "../../../src/types/response.types";
import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";
import type { Skill as PrismaSkill } from "@prisma/client";

describe("SkillResolver - deleteSkill", (): void => {
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

  const skillToDelete: PrismaSkill = {
    id: 1,
    name: "JavaScript",
    image: "js.png",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();
    prismaMock.skillCategorySkill.deleteMany.mockReset();
    prismaMock.skill.delete.mockReset();

    resolver = new SkillResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;
  });

  it("should successfully delete a skill with project and category associations for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 3 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.skill.delete.mockResolvedValueOnce(skillToDelete);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toContain("Skill deleted along with 3 project associations and 2 category associations");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategorySkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });

  it("should successfully delete a skill without any associations for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skill.delete.mockResolvedValueOnce(skillToDelete);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toContain("Skill deleted along with 0 project associations and 0 category associations");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategorySkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: SubItemResponse = await resolver.deleteSkill(1, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async (): Promise<void> => {
    const nonAdminContext: MyContext = { ...baseContext, user: regularUser };

    const result: SubItemResponse = await resolver.deleteSkill(1, nonAdminContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if skill does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.deleteSkill(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors during project skill deletion", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Failed to delete project skills");

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(dbError);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should handle database errors during skill deletion", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Failed to delete skill");

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skill.delete.mockRejectedValueOnce(dbError);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should handle unknown error types during deletion", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error occurred";

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(unknownError);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should delete project skills before category skills before skill", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.delete.mockResolvedValueOnce(skillToDelete);

    await resolver.deleteSkill(1, adminContext);

    const projectSkillsCall: number = prismaMock.projectSkill.deleteMany.mock.invocationCallOrder[0];
    const categorySkillsCall: number = prismaMock.skillCategorySkill.deleteMany.mock.invocationCallOrder[0];
    const skillCall: number = prismaMock.skill.delete.mock.invocationCallOrder[0];

    expect(projectSkillsCall).toBeLessThan(categorySkillsCall);
    expect(categorySkillsCall).toBeLessThan(skillCall);
  });

  it("should correctly call Prisma delete with skill ID parameter", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skill.delete.mockResolvedValueOnce(skillToDelete);

    await resolver.deleteSkill(42, adminContext);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({
      where: { skillId: 42 },
    });
    expect(prismaMock.skillCategorySkill.deleteMany).toHaveBeenCalledWith({
      where: { skillId: 42 },
    });
    expect(prismaMock.skill.delete).toHaveBeenCalledWith({
      where: { id: 42 },
    });
  });

  it("should include accurate deletion counts in success message", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(skillToDelete);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 5 });
    prismaMock.skillCategorySkill.deleteMany.mockResolvedValueOnce({ count: 3 });
    prismaMock.skill.delete.mockResolvedValueOnce(skillToDelete);

    const result: SubItemResponse = await resolver.deleteSkill(1, adminContext);

    expect(result.message).toBe(
      "Skill deleted along with 5 project associations and 3 category associations"
    );
  });
});
