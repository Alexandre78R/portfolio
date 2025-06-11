import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

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

  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
  };

  const mockExistingCategory = {
    id: 1,
    categoryEN: "Test Category EN",
    categoryFR: "Catégorie de Test FR",
  };

  const mockSkills = [
    { id: 10, name: "Skill 1", categoryId: 1, image: "s1.png" },
    { id: 11, name: "Skill 2", categoryId: 1, image: "s2.png" },
  ];
  const mockSkillIds = mockSkills.map(s => s.id);

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

  it("should successfully delete a category with associated skills and project skills by an admin user", async () => {
 
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };


    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: mockSkillIds.length });
    prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: mockSkills.length }); 
    prismaMock.skillCategory.delete.mockResolvedValueOnce(mockExistingCategory);

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);


    expect(result.code).toBe(200);
    expect(result.message).toBe("Category and related skills deleted");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingCategory.id } });

    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledWith({ where: { categoryId: mockExistingCategory.id }, select: { id: true } });

    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { skillId: { in: mockSkillIds } } });

   
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledWith({ where: { categoryId: mockExistingCategory.id } });

    expect(prismaMock.skillCategory.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.delete).toHaveBeenCalledWith({ where: { id: mockExistingCategory.id } });
  });

  it("should successfully delete a category with no associated skills by an admin user", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };


    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce([]); 
    prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: 0 }); 
    prismaMock.skillCategory.delete.mockResolvedValueOnce(mockExistingCategory);

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category and related skills deleted");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledWith({ where: { categoryId: mockExistingCategory.id } });

    expect(prismaMock.skillCategory.delete).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {

    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };


    const result = await resolver.deleteCategory(mockExistingCategory.id, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {

    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };


    const result = await resolver.deleteCategory(mockExistingCategory.id, regularUserContext);


    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if the category to delete is not found", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.deleteCategory(999, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category lookup", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during category findUnique";
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill lookup", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill findMany";
    
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error(errorMessage)); 

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during project skill deletion", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during projectSkill deleteMany";
    
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error(errorMessage)); 

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");


    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.deleteMany).not.toHaveBeenCalled(); 
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill deletion", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill deleteMany";
    
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: mockSkillIds.length });
    prismaMock.skill.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.delete).not.toHaveBeenCalled(); 
  });

  it("should return 500 for an unexpected server error during category final deletion", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during category delete";
    
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockSkills);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: mockSkillIds.length });
    prismaMock.skill.deleteMany.mockResolvedValueOnce({ count: mockSkills.length });
    prismaMock.skillCategory.delete.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.deleteCategory(mockExistingCategory.id, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting category");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.delete).toHaveBeenCalledTimes(1);
  });
});