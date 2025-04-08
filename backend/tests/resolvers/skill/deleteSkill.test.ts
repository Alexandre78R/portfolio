import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { SubItemResponse } from "../../../src/entities/response.types";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("SkillResolver - deleteSkill", () => {
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

  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
  };

  const mockExistingSkill = {
    id: 10,
    name: "Existing Skill",
    image: "existing_skill.png",
    categoryId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.delete.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();

    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully delete a skill with associated project skills by an admin user", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 5 });
    prismaMock.skill.delete.mockResolvedValueOnce(mockExistingSkill); 

    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill and related sub-items deleted");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingSkill.id } });

    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { skillId: mockExistingSkill.id } });

    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledWith({ where: { id: mockExistingSkill.id } });
  });

  it("should successfully delete a skill with no associated project skills by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 });
    prismaMock.skill.delete.mockResolvedValueOnce(mockExistingSkill);

    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill and related sub-items deleted");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result = await resolver.deleteSkill(mockExistingSkill.id, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result = await resolver.deleteSkill(mockExistingSkill.id, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the skill to delete is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.deleteSkill(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill lookup", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill findUnique";
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during project skill deletion", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during projectSkill deleteMany";
    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill deletion", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill delete";
    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.delete.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });
});