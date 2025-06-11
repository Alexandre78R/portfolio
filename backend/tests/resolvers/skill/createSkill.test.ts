import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/entities/response.types";
import { SkillSubItem } from "../../../src/entities/skillSubItem.entity"; // Vérifie ce chemin d'entité DTO
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("SkillResolver - createSkill", () => {
  let resolver: SkillResolver;

  const mockCookies = mockDeep<Cookies>();

  // Les objets User pour le contexte (ctx.user) ne doivent pas contenir de mot de passe
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

  const createSkillInput: CreateSkillInput = {
    name: "New Skill",
    image: "new_skill.png",
    categoryId: 1,
  };


  const mockSkillCategory = {
    id: 1,
    categoryEN: "Programming",
    categoryFR: "Programmation", 
  };

  const mockCreatedSkill = {
    id: 100,
    name: "New Skill",
    image: "new_skill.png",
    categoryId: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skill.create.mockReset();
    
    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear(); 
    mockCookies.get.mockClear();
  });


  it("should successfully create a new skill for an authenticated admin user", async () => {
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockSkillCategory);
    prismaMock.skill.create.mockResolvedValueOnce(mockCreatedSkill);

    const result = await resolver.createSkill(createSkillInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill created successfully");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);
    expect(result.subItems?.[0]).toEqual({
      id: mockCreatedSkill.id,
      name: mockCreatedSkill.name,
      image: mockCreatedSkill.image,
      categoryId: mockCreatedSkill.categoryId,
    });

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: createSkillInput.categoryId },
    });
    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.create).toHaveBeenCalledWith({
      data: {
        name: createSkillInput.name,
        image: createSkillInput.image,
        categoryId: createSkillInput.categoryId,
      },
    });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = {
      ...baseMockContext,
      user: null,
    };

    const result = await resolver.createSkill(createSkillInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = {
      ...baseMockContext,
      user: mockRegularUser,
    };

    const result = await resolver.createSkill(createSkillInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 400 if the category is not found", async () => {
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.createSkill(createSkillInput, adminContext);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Category not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: createSkillInput.categoryId },
    });
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category lookup", async () => {
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };
    const errorMessage = "Database error during category lookup";
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.createSkill(createSkillInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.create).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill creation", async () => {
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockSkillCategory);
    const errorMessage = "Database error during skill creation";
    prismaMock.skill.create.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.createSkill(createSkillInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create skill");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.create).toHaveBeenCalledTimes(1);
  });
});