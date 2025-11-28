import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { SubItemResponse } from "../../../src/types/response.types";
import type { SkillSubItem } from "../../../src/entities/skillSubItem.entity";
import type { Skill as PrismaSkill, SkillCategorySkill as PrismaSkillCategorySkill, SkillCategory as PrismaSkillCategory } from "@prisma/client";

describe("SkillResolver - skillById", (): void => {
  let resolver: SkillResolver;

  const mockSkill: PrismaSkill = {
    id: 1,
    name: "JavaScript",
    image: "js.png",
  };

  const mockCategory: PrismaSkillCategory = {
    id: 5,
    categoryEN: "Programming",
    categoryFR: "Programmation",
  };

  const mockJunctionWithCategory: PrismaSkillCategorySkill & { category: PrismaSkillCategory } = {
    skillId: 1,
    categoryId: 5,
    category: mockCategory,
  };

  const mockSkillWithoutCategory: PrismaSkill = {
    id: 2,
    name: "Design",
    image: "design.png",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    prismaMock.skillCategorySkill.findMany.mockReset();
    resolver = new SkillResolver(prismaMock);
  });

  it("should return a skill with its associated category", async (): Promise<void> => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([mockJunctionWithCategory]);

    const result: SubItemResponse = await resolver.skillById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill fetched successfully");
    expect(result.subItems).toBeDefined();
    expect(result.subItems?.length).toBe(1);

    const fetchedSkill: SkillSubItem | undefined = result.subItems?.[0];
    expect(fetchedSkill?.id).toBe(1);
    expect(fetchedSkill?.name).toBe("JavaScript");
    expect(fetchedSkill?.image).toBe("js.png");
    expect(fetchedSkill?.categoryId).toBe(5);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.skillCategorySkill.findMany).toHaveBeenCalledWith({
      where: { skillId: 1 },
      include: { category: true },
    });
  });

  it("should return a skill without category when no category is assigned", async (): Promise<void> => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkillWithoutCategory);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([]);

    const result: SubItemResponse = await resolver.skillById(2);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill fetched successfully");
    expect(result.subItems?.length).toBe(1);

    const fetchedSkill: SkillSubItem | undefined = result.subItems?.[0];
    expect(fetchedSkill?.id).toBe(2);
    expect(fetchedSkill?.name).toBe("Design");
    expect(fetchedSkill?.categoryId).toBe(0);

    expect(prismaMock.skillCategorySkill.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 404 if skill does not exist", async (): Promise<void> => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(null);

    const result: SubItemResponse = await resolver.skillById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(prismaMock.skillCategorySkill.findMany).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    const dbError: Error = new Error("Database connection failed");
    prismaMock.skill.findUnique.mockRejectedValueOnce(dbError);

    const result: SubItemResponse = await resolver.skillById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch skill");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should handle unknown error types correctly", async (): Promise<void> => {
    const unknownError: unknown = "Some unknown error occurred";
    prismaMock.skill.findUnique.mockRejectedValueOnce(unknownError);

    const result: SubItemResponse = await resolver.skillById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch skill");
    expect(result.subItems).toEqual([]);
  });

  it("should correctly call Prisma with the skill ID parameter", async (): Promise<void> => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([mockJunctionWithCategory]);

    await resolver.skillById(42);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({ where: { id: 42 } });
  });

  it("should fetch category junction even when skill exists", async (): Promise<void> => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill);
    prismaMock.skillCategorySkill.findMany.mockResolvedValueOnce([mockJunctionWithCategory]);

    await resolver.skillById(1);

    expect(prismaMock.skillCategorySkill.findMany).toHaveBeenCalledWith({
      where: { skillId: 1 },
      include: { category: true },
    });
  });
});
