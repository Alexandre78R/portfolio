import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateSkillInput } from "../../../src/entities/inputs/skill.input";
import { SubItemResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import { mockDeep } from "jest-mock-extended";
import { CreateSkillInput } from "../../../src/entities/inputs/skill.input";

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

  const baseContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const mockExistingSkill = {
    id: 10,
    name: "Old Skill Name",
    image: "old_skill_image.png",
    categoryId: 1,
  };

  const mockNewCategory = {
    id: 2,
    categoryEN: "Design",
    categoryFR: "Conception",
  };

  const fullUpdateInput: UpdateSkillInput = {
    name: "New Skill Name",
    image: "new_skill_image.png",
    categoryId: 2,
  };

  const partialNameInput: UpdateSkillInput = { name: "Updated Skill Name" };
  const partialImageInput: UpdateSkillInput = { image: "updated_image.png" };
  const partialCategoryInput: UpdateSkillInput = { categoryId: 2 };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    prismaMock.skill.update.mockReset();
    prismaMock.skillCategory.findUnique.mockReset();
    resolver = new SkillResolver(prismaMock);
  });

  // ✅ Full update by admin
  it("should update a skill fully by admin", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewCategory);
    prismaMock.skill.update.mockResolvedValueOnce({ ...mockExistingSkill, ...fullUpdateInput });

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill updated");
    expect(result.subItems?.[0]).toEqual({ ...mockExistingSkill, ...fullUpdateInput });

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.update).toHaveBeenCalledTimes(1);
  });

  // ✅ Full update by editor
  it("should update a skill fully by editor", async () => {
    const context: MyContext = { ...baseContext, user: mockEditorUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewCategory);
    prismaMock.skill.update.mockResolvedValueOnce({ ...mockExistingSkill, ...fullUpdateInput });

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(200);
    expect(result.subItems?.[0].name).toBe(fullUpdateInput.name);
  });

  // ✅ Partial updates
  it("should update skill name only", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skill.update.mockResolvedValueOnce({ ...mockExistingSkill, ...partialNameInput });

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      partialNameInput,
      context
    );

    expect(result.subItems?.[0].name).toBe(partialNameInput.name);
    expect(result.subItems?.[0].image).toBe(mockExistingSkill.image);
    expect(result.subItems?.[0].categoryId).toBe(mockExistingSkill.categoryId);
  });

  it("should update skill image only", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skill.update.mockResolvedValueOnce({ ...mockExistingSkill, ...partialImageInput });

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      partialImageInput,
      context
    );

    expect(result.subItems?.[0].image).toBe(partialImageInput.image);
    expect(result.subItems?.[0].name).toBe(mockExistingSkill.name);
  });

  it("should update skill category only", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewCategory);
    prismaMock.skill.update.mockResolvedValueOnce({ ...mockExistingSkill, categoryId: 2 });

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      partialCategoryInput,
      context
    );

    expect(result.subItems?.[0].categoryId).toBe(partialCategoryInput.categoryId);
  });

  // ✅ Unauthorized access
  it("should return 401 if no user", async () => {
    const context: MyContext = { ...baseContext, user: null };
    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );
    expect(result.code).toBe(401);
    expect(result.subItems).toBeUndefined();
  });

  it("should return 403 if user is not admin/editor", async () => {
    const context: MyContext = { ...baseContext, user: mockRegularUser };
    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );
    expect(result.code).toBe(403);
    expect(result.subItems).toBeUndefined();
  });

  // ✅ Not found
  it("should return 404 if skill not found", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.updateSkill(
      999,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(404);
    expect(result.subItems).toBeUndefined();
  });

  // ✅ Invalid category
  it("should return 400 if invalid categoryId", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    const invalidInput: UpdateSkillInput = { ...fullUpdateInput, categoryId: 999 };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      invalidInput,
      context
    );

    expect(result.code).toBe(400);
    expect(result.subItems).toBeUndefined();
  });

  // ✅ Unexpected errors
  it("should return 500 if skill findUnique throws", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(500);
  });

  it("should return 500 if category findUnique throws", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(500);
  });

  it("should return 500 if skill update throws", async () => {
    const context: MyContext = { ...baseContext, user: mockAdminUser };
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockExistingSkill);
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockNewCategory);
    prismaMock.skill.update.mockRejectedValueOnce(new Error("DB error"));

    const result: SubItemResponse = await resolver.updateSkill(
      mockExistingSkill.id,
      fullUpdateInput,
      context
    );

    expect(result.code).toBe(500);
  });
});