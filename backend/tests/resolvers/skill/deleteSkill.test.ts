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

  // Mock User objects
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

  // Base mock context
  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
  };

  // Mock data for an existing skill
  const mockExistingSkill = {
    id: 10,
    name: "Existing Skill",
    image: "existing_skill.png",
    categoryId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clears call counts and mock implementations

    // Reset specific Prisma mocks for the skill and projectSkill models
    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.delete.mockReset(); // Note: Changed from deleteMany
    prismaMock.projectSkill.deleteMany.mockReset();

    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully delete a skill with associated project skills by an admin user", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    // Arrange: Mock Prisma calls
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 5 }); // Assume 5 project skills deleted
    prismaMock.skill.delete.mockResolvedValueOnce(mockExistingSkill); // Mock the deletion of the skill itself

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    // Assert: Verify the response
    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill and related sub-items deleted");
    expect(result.subItems).toBeUndefined(); // Should not return subItems on delete

    // Assert: Verify Prisma calls in correct order and with correct arguments
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingSkill.id } });

    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { skillId: mockExistingSkill.id } });

    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1); // Expecting delete, not deleteMany
    expect(prismaMock.skill.delete).toHaveBeenCalledWith({ where: { id: mockExistingSkill.id } });
  });

  it("should successfully delete a skill with no associated project skills by an admin user", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    // Arrange: Mock Prisma calls - no project skills found
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 0 }); // 0 project skills deleted
    prismaMock.skill.delete.mockResolvedValueOnce(mockExistingSkill);

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    // Assert: Verify the response
    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill and related sub-items deleted");
    expect(result.subItems).toBeUndefined();

    // Assert: Verify Prisma calls
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {
    // Arrange: Context with no user
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, unauthenticatedContext);

    // Assert: Verify the response
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();

    // Assert: No Prisma calls should be made
    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    // Arrange: Set context to a regular user
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, regularUserContext);

    // Assert: Verify the response
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.subItems).toBeUndefined();

    // Assert: No Prisma calls should be made
    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the skill to delete is not found", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(null); // Skill not found

    // Act: Call the mutation with a non-existent ID
    const result = await resolver.deleteSkill(999, adminContext);

    // Assert: Verify the response
    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toBeUndefined();

    // Assert: Only findUnique should be called
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill lookup", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill findUnique";
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    // Assert: Verify the generic 500 error response
    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    // Assert: Only findUnique should be called
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during project skill deletion", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during projectSkill deleteMany";
    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error(errorMessage)); // Error during project skill deletion

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    // Assert: Verify the generic 500 error response
    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    // Assert: Correct sequence of calls until the error point
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).not.toHaveBeenCalled(); // Should not proceed to skill deletion
  });

  it("should return 500 for an unexpected server error during skill deletion", async () => {
    // Arrange: Set context to an admin user
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill delete";
    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 1 });
    prismaMock.skill.delete.mockRejectedValueOnce(new Error(errorMessage)); // Error during final skill deletion

    // Act: Call the mutation
    const result = await resolver.deleteSkill(mockExistingSkill.id, adminContext);

    // Assert: Verify the generic 500 error response
    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting skill");

    // Assert: All previous calls should have occurred, but final delete failed
    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.delete).toHaveBeenCalledTimes(1);
  });
});