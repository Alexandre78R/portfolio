import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import type { User } from "../../../src/entities/user.entity";
import { UserRole } from "../../../src/entities/user.entity";
import type { UpdateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/types/response.types";import type { SkillSubItem } from "../../../src/entities/skillSubItem.entity";import { mockDeep } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";
import type { Skill as PrismaSkill, SkillCategory as PrismaSkillCategory, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

describe("SkillResolver - updateSkill", (): void => {
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

  const editorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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

  const existingSkill: PrismaSkill = {
    id: 1,
    name: "JavaScript",
    image: "js.png",
  };

  const updatedSkill: PrismaSkill = {
    id: 1,
    name: "JavaScript Advanced",
    image: "js-advanced.png",
  };

  const updateInput: UpdateSkillInput = {
    name: "JavaScript Advanced",
    image: "js-advanced.png",
    categoryId: 2,
  };

  const mockCategory: PrismaSkillCategory = {
    id: 2,
    categoryEN: "Advanced Programming",
    categoryFR: "Programmation Avancée",
  };

  const mockJunction: PrismaSkillCategorySkill = {
    skillId: 1,
    categoryId: 2,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.update.mockReset();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategorySkill.findFirst.mockReset();

    resolver = new SkillResolver(prismaMock);

    cookiesMock = mockDeep<Cookies>();
    reqMock = mockDeep<Request>();
    resMock = mockDeep<Response>();

    (baseContext as MyContext).cookies = cookiesMock;
    (baseContext as MyContext).req = reqMock;
    (baseContext as MyContext).res = resMock;
  });

  it("should successfully update a skill for admin user", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.update.mockResolvedValueOnce(updatedSkill);
    prismaMock.skillCategorySkill.findFirst.mockResolvedValueOnce(mockJunction);

    const result: SubItemResponse = await resolver.updateSkill(1, updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);

    const updatedSkillDTO: SkillSubItem | undefined = result.subItems?.[0];
    expect(updatedSkillDTO?.id).toBe(1);
    expect(updatedSkillDTO?.name).toBe("JavaScript Advanced");
    expect(updatedSkillDTO?.image).toBe("js-advanced.png");
    expect(updatedSkillDTO?.categoryId).toBe(2);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should successfully update a skill for editor user", async (): Promise<void> => {
    const editorContext: MyContext = { ...baseContext, user: editorUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.update.mockResolvedValueOnce(updatedSkill);
    prismaMock.skillCategorySkill.findFirst.mockResolvedValueOnce(mockJunction);

    const result: SubItemResponse = await resolver.updateSkill(1, updateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if user is not authenticated", async (): Promise<void> => {
    const unauthenticatedContext: MyContext = { ...baseContext, user: null };

    const result: SubItemResponse = await resolver.updateSkill(
      1,
      updateInput,
      unauthenticatedContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 403 if user lacks admin or editor role", async (): Promise<void> => {
    const nonAdminContext: MyContext = { ...baseContext, user: regularUser };

    const result: SubItemResponse = await resolver.updateSkill(
      1,
      updateInput,
      nonAdminContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.subItems).toBeUndefined();
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 404 if skill does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.updateSkill(
      999,
      updateInput,
      adminContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 400 if category does not exist", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.updateSkill(1, updateInput, adminContext);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid category");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 500 if database throws error during update", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const dbError: Error = new Error("Database update failed");

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.update.mockRejectedValueOnce(dbError);

    const result: SubItemResponse = await resolver.updateSkill(1, updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should handle unknown error types during update", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const unknownError: unknown = "Unknown error occurred";

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.update.mockRejectedValueOnce(unknownError);

    const result: SubItemResponse = await resolver.updateSkill(1, updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating skill");
    expect(result.subItems).toBeUndefined();
  });

  it("should preserve existing values when update fields are not provided", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };
    const partialUpdateInput: UpdateSkillInput = { name: "New Name" };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skill.update.mockResolvedValueOnce({
      ...existingSkill,
      name: "New Name",
    });
    prismaMock.skillCategorySkill.findFirst.mockResolvedValueOnce(null);

    await resolver.updateSkill(1, partialUpdateInput, adminContext);

    expect(prismaMock.skill.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: "New Name",
        image: existingSkill.image,
      },
    });
  });

  it("should retrieve category ID after skill update", async (): Promise<void> => {
    const adminContext: MyContext = { ...baseContext, user: adminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(existingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);
    prismaMock.skill.update.mockResolvedValueOnce(updatedSkill);
    prismaMock.skillCategorySkill.findFirst.mockResolvedValueOnce(mockJunction);

    await resolver.updateSkill(1, updateInput, adminContext);

    expect(prismaMock.skillCategorySkill.findFirst).toHaveBeenCalledWith({
      where: { skillId: 1 },
    });
  });
});
