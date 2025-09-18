import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateCategoryInput } from "../../../src/entities/inputs/skill.input";
import { CategoryResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";

describe("SkillResolver - updateCategory", () => {
  let skillResolver: SkillResolver;
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

  const baseContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
    token: undefined,
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
    skillResolver = new SkillResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should update a category fully by an admin", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
      ...fullUpdateInput,
    });

    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category updated");
    expect(result.categories?.[0]).toEqual({
      id: mockExistingCategory.id,
      categoryEN: fullUpdateInput.categoryEN,
      categoryFR: fullUpdateInput.categoryFR,
      skills: [],
    });

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: mockExistingCategory.id },
    });
    expect(prismaMock.skillCategory.update).toHaveBeenCalledWith({
      where: { id: mockExistingCategory.id },
      data: fullUpdateInput,
    });
  });

  it("should update a category fully by an editor", async () => {
    const context: MyContext = { ...baseContext, user: mockEditorUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
      ...fullUpdateInput,
    });

    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(200);
    expect(result.categories?.[0].categoryEN).toBe(fullUpdateInput.categoryEN);
  });

  it("should partially update a category by an admin", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockResolvedValueOnce({
      ...mockExistingCategory,
      categoryEN: partialUpdateInput.categoryEN!,
      categoryFR: mockExistingCategory.categoryFR,
    });

    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      partialUpdateInput,
      context
    );

    expect(result.code).toBe(200);
    expect(result.categories?.[0].categoryEN).toBe(partialUpdateInput.categoryEN);
    expect(result.categories?.[0].categoryFR).toBe(mockExistingCategory.categoryFR);

    expect(prismaMock.skillCategory.update).toHaveBeenCalledWith({
      where: { id: mockExistingCategory.id },
      data: {
        categoryEN: partialUpdateInput.categoryEN,
        categoryFR: mockExistingCategory.categoryFR,
      },
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const context: MyContext = { ...baseContext, user: null };
    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(401);
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin/editor", async () => {
    const context: MyContext = { ...baseContext, user: mockRegularUser };
    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(403);
    expect(result.categories).toBeUndefined();
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 404 if category does not exist", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await skillResolver.updateCategory(
      999,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(prismaMock.skillCategory.update).not.toHaveBeenCalled();
  });

  it("should return 500 if findUnique throws", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("DB findUnique error"));

    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");
  });

  it("should return 500 if update throws", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockExistingCategory);
    prismaMock.skillCategory.update.mockRejectedValueOnce(new Error("DB update error"));

    const result: CategoryResponse = await skillResolver.updateCategory(
      mockExistingCategory.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error updating category");
  });
});