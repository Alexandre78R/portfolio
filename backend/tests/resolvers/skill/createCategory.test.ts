import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver"; // Ajuste le chemin si nécessaire
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateCategoryInput } from "../../../src/entities/inputs/skill.input"; // Ajuste le chemin vers ton input type
import { CategoryResponse } from "../../../src/entities/response.types"; // Ajuste le chemin vers ton response type
import { Skill } from "../../../src/entities/skill.entity"; // Assumant que c'est ton DTO Skill pour les catégories
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("SkillResolver - createCategory", () => {
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


  const createCategoryInput: CreateCategoryInput = {
    categoryEN: "New English Category",
    categoryFR: "Nouvelle Catégorie Française",
  };


  const mockCreatedCategory = {
    id: 100,
    categoryEN: "New English Category",
    categoryFR: "Nouvelle Catégorie Française",
  };

  beforeEach(() => {
   
    jest.clearAllMocks();
    prismaMock.skillCategory.create.mockReset();
    
    
    resolver = new SkillResolver(prismaMock);


    mockCookies.set.mockClear(); 
    mockCookies.get.mockClear();
  });



  it("should successfully create a new category for an authenticated admin user", async () => {

    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };

    prismaMock.skillCategory.create.mockResolvedValueOnce(mockCreatedCategory);


    const result = await resolver.createCategory(createCategoryInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category created successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);
    expect(result.categories?.[0]).toEqual({
      id: mockCreatedCategory.id,
      categoryEN: mockCreatedCategory.categoryEN,
      categoryFR: mockCreatedCategory.categoryFR,
      skills: [],
    });

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: createCategoryInput.categoryEN,
        categoryFR: createCategoryInput.categoryFR,
      },
    });
  });

  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = {
      ...baseMockContext,
      user: null,
    };

    const result = await resolver.createCategory(createCategoryInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const regularUserContext: MyContext = {
      ...baseMockContext,
      user: mockRegularUser,
    };

    const result = await resolver.createCategory(createCategoryInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.create).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category creation", async () => {
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUser,
    };

    const errorMessage = "Database error during category creation";
    prismaMock.skillCategory.create.mockRejectedValueOnce(new Error(errorMessage));


    const result = await resolver.createCategory(createCategoryInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create category");

    expect(prismaMock.skillCategory.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.create).toHaveBeenCalledWith({
      data: {
        categoryEN: createCategoryInput.categoryEN,
        categoryFR: createCategoryInput.categoryFR,
      },
    });
  });
});