import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateSkillInput } from "../../../src/entities/inputs/skill.input";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("SkillResolver - updateSkill", () => {
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

  const mockExistingSkill = {
    id: 10,
    name: "Old Skill Name",
    image: "old_skill_image.png",
    categoryId: 1,
  };

  const mockNewValidCategory = {
    id: 2,
    categoryEN: "Design",
    categoryFR: "Conception",
  };

  const fullUpdateInput: UpdateSkillInput = {
    name: "New Skill Name",
    image: "new_skill_image.png",
    categoryId: 2,
  };

  const partialUpdateNameInput: UpdateSkillInput = {
    name: "Updated Skill Name Only",
  };

  const partialUpdateImageInput: UpdateSkillInput = {
    image: "updated_image_only.png",
  };

  const partialUpdateCategoryInput: UpdateSkillInput = {
    categoryId: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.update.mockReset();
    prismaMock.skillCategory.findUnique.mockReset();

    resolver = new SkillResolver(prismaMock);

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully update a skill with full data by an admin user", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewValidCategory); // For data.categoryId validation
    prismaMock.skill.update.mockResolvedValueOnce({
      ...mockExistingSkill,
      ...fullUpdateInput,
    });


    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);
    expect(result.subItems?.[0]).toEqual({
      id: mockExistingSkill.id,
      name: fullUpdateInput.name,
      image: fullUpdateInput.image,
      categoryId: fullUpdateInput.categoryId,
    });

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({ where: { id: fullUpdateInput.categoryId } });
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledWith({
      where: { id: mockExistingSkill.id },
      data: {
        name: fullUpdateInput.name,
        image: fullUpdateInput.image,
        categoryId: fullUpdateInput.categoryId,
      },
    });
  });

  it("should successfully update a skill with full data by an editor user", async () => {
   
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };

    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewValidCategory);
    prismaMock.skill.update.mockResolvedValueOnce({
      ...mockExistingSkill,
      ...fullUpdateInput,
    });

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);
    expect(result.subItems?.[0]).toEqual({
      id: mockExistingSkill.id,
      name: fullUpdateInput.name,
      image: fullUpdateInput.image,
      categoryId: fullUpdateInput.categoryId,
    });

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });

  it("should successfully update skill name partially by an admin user", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };


    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skill.update.mockResolvedValueOnce({
      ...mockExistingSkill,
      name: partialUpdateNameInput.name ?? "",
    });

    const result = await resolver.updateSkill(mockExistingSkill.id, partialUpdateNameInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.[0].name).toBe(partialUpdateNameInput.name);
    expect(result.subItems?.[0].image).toBe(mockExistingSkill.image); 
    expect(result.subItems?.[0].categoryId).toBe(mockExistingSkill.categoryId); 

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled(); 
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledWith({
      where: { id: mockExistingSkill.id },
      data: {
        name: partialUpdateNameInput.name,
        image: mockExistingSkill.image, 
        categoryId: mockExistingSkill.categoryId, 
      },
    });
  });

  it("should successfully update skill image partially by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skill.update.mockResolvedValueOnce({
      ...mockExistingSkill,
      image: partialUpdateImageInput.image ?? "",
    });

    const result = await resolver.updateSkill(mockExistingSkill.id, partialUpdateImageInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems?.[0].image).toBe(partialUpdateImageInput.image);
    expect(result.subItems?.[0].name).toBe(mockExistingSkill.name);
    expect(result.subItems?.[0].categoryId).toBe(mockExistingSkill.categoryId);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });

  it("should successfully update skill category partially by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewValidCategory);
    prismaMock.skill.update.mockResolvedValueOnce({
      ...mockExistingSkill,
      categoryId: partialUpdateCategoryInput.categoryId ?? 1,
    });

    const result = await resolver.updateSkill(mockExistingSkill.id, partialUpdateCategoryInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems?.[0].categoryId).toBe(partialUpdateCategoryInput.categoryId);
    expect(result.subItems?.[0].name).toBe(mockExistingSkill.name);
    expect(result.subItems?.[0].image).toBe(mockExistingSkill.image);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });


  it("should return 401 if no user is authenticated", async () => {
    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin or editor", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
  });

  it("should return 404 if the skill to update is not found", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(null); 

    const result = await resolver.updateSkill(999, fullUpdateInput, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled(); 
  });

  it("should return 400 if categoryId is provided but invalid", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const invalidCategoryInput: UpdateSkillInput = {
      name: "Test Skill",
      categoryId: 999, // Invalid category ID
    };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill); 
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.updateSkill(mockExistingSkill.id, invalidCategoryInput, adminContext);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid category");
    expect(result.subItems).toBeUndefined();

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({ where: { id: invalidCategoryInput.categoryId } });
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during initial skill lookup", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill findUnique";
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
    expect(prismaMock.skillCategory.findUnique).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during category validation lookup", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during category findUnique";
    
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during skill update", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "Database error during skill update";

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewValidCategory);
    prismaMock.skill.update.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.updateSkill(mockExistingSkill.id, fullUpdateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating skill");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });
});