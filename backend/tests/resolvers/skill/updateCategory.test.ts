import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateCategoryInput } from "../../../src/entities/inputs/skill.input";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("SkillResolver - updateCategory", () => {
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

  const mockEditorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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
    categoryEN: "Old English Name",
    categoryFR: "Ancien Nom Français",
  };

  const fullUpdateInput: UpdateCategoryInput = {
    categoryEN: "New English Name",
    categoryFR: "Nouveau Nom Français",
  };


  const partialUpdateInput: UpdateCategoryInput = {
    categoryEN: "Updated English Name",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    prismaMock.skillCategory.update.mockReset();

    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });


  it("should successfully update a category with full data by an admin user", async () => {
   
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };


    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
      ...fullUpdateInput, 
    });


    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);
    expect(result.categories?.[0]).toEqual({
      id: mockExistingCategory.id,
      categoryEN: fullUpdateInput.categoryEN,
      categoryFR: fullUpdateInput.categoryFR,
      skills: [],
    });

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({ where: { id: mockExistingCategory.id } });
    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).toHaveBeenCalledWith({
      where: { id: mockExistingCategory.id },
      data: fullUpdateInput,
    });
  });

  it("should successfully update a category with full data by an editor user", async () => {
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
      ...fullUpdateInput,
    });


    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);
    expect(result.categories?.[0]).toEqual({
      id: mockExistingCategory.id,
      categoryEN: fullUpdateInput.categoryEN,
      categoryFR: fullUpdateInput.categoryFR,
      skills: [],
    });

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
  });

  it("should successfully update a category with partial data by an admin user", async () => {
   
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
        categoryEN: partialUpdateInput.categoryEN!,
        categoryFR: mockExistingCategory.categoryFR,
    });


    const result = await resolver.updateCategory(mockExistingCategory.id, partialUpdateInput, adminContext);


    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated");
    expect(result.categories).toBeDefined();
    expect(result.categories?.[0].categoryEN).toBe(partialUpdateInput.categoryEN);
   
    expect(result.categories?.[0].categoryFR).toBe(mockExistingCategory.categoryFR);


    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).toHaveBeenCalledWith({
      where: { id: mockExistingCategory.id },
      data: {
        categoryEN: partialUpdateInput.categoryEN,
        categoryFR: mockExistingCategory.categoryFR,
      },
    });
  });

  it("should return 401 if no user is authenticated", async () => {
    
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.categories).toBeUndefined();


    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin or editor", async () => {

    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 404 if the category to update is not found", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);


    const result = await resolver.updateCategory(999, fullUpdateInput, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category lookup", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const errorMessage = "Database error during findUnique";
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category update", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
 
    const errorMessage = "Database error during update";
    prismaMock.skillCategory.update.mockRejectedValueOnce(new Error(errorMessage));


    const result = await resolver.updateCategory(mockExistingCategory.id, fullUpdateInput, adminContext);


    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");

    
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.update).toHaveBeenCalledTimes(1);
  });
});