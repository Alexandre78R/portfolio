import "reflect-metadata";
import { SkillCategoryResolver } from "../../../src/resolvers/skillCategory.resolver";
import { prismaMock } from "../../singleton";
import { CategoryResponse } from "../../../src/types/response.types";
import type { Skill as PrismaSkill, SkillCategory as PrismaSkillCategory, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

describe("SkillCategoryResolver - getSkillCategoryById", (): void => {
  let resolver: SkillCategoryResolver;

  type SkillCategoryWithSkills = PrismaSkillCategory & {
    skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
  };

  const mockSkill1: PrismaSkill = {
    id: 1,
    name: "JavaScript",
    image: "js.png",
  };

  const mockSkill2: PrismaSkill = {
    id: 2,
    name: "TypeScript",
    image: "ts.png",
  };

  const mockSkill3: PrismaSkill = {
    id: 3,
    name: "Node.js",
    image: "nodejs.png",
  };

  const mockCategoryWithSkills: SkillCategoryWithSkills = {
    id: 1,
    categoryEN: "Programming Languages",
    categoryFR: "Langages de Programmation",
    skills: [
      { skillId: 1, categoryId: 1, skill: mockSkill1 },
      { skillId: 2, categoryId: 1, skill: mockSkill2 },
      { skillId: 3, categoryId: 1, skill: mockSkill3 },
    ],
  };

  const mockCategoryWithoutSkills: SkillCategoryWithSkills = {
    id: 2,
    categoryEN: "Design",
    categoryFR: "Conception",
    skills: [],
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    resolver = new SkillCategoryResolver(prismaMock);
  });

  it("should return a skill category by ID with associated skills", async (): Promise<void> => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryWithSkills);

    const result: CategoryResponse = await resolver.getSkillCategoryById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(1);

    const category = result.categories?.[0];
    expect(category?.id).toBe(1);
    expect(category?.categoryEN).toBe("Programming Languages");
    expect(category?.categoryFR).toBe("Langages de Programmation");
    expect(category?.skills.length).toBe(3);
    expect(category?.skills[0].name).toBe("JavaScript");
    expect(category?.skills[1].name).toBe("TypeScript");
    expect(category?.skills[2].name).toBe("Node.js");

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("should return a skill category without skills", async (): Promise<void> => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryWithoutSkills);

    const result: CategoryResponse = await resolver.getSkillCategoryById(2);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category fetched successfully");
    expect(result.categories?.length).toBe(1);
    expect(result.categories?.[0].skills).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("should return 404 if category does not exist", async (): Promise<void> => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(null);

    const result: CategoryResponse = await resolver.getSkillCategoryById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    const dbError: Error = new Error("Database query failed");
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(dbError);

    const result: CategoryResponse = await resolver.getSkillCategoryById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch category");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should handle unknown error types correctly", async (): Promise<void> => {
    const unknownError: unknown = { error: "Unknown error format" };
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(unknownError);

    const result: CategoryResponse = await resolver.getSkillCategoryById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch category");
    expect(result.categories).toEqual([]);
  });

  it("should correctly call Prisma with the category ID parameter", async (): Promise<void> => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryWithSkills);

    await resolver.getSkillCategoryById(1);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });
  });
});
