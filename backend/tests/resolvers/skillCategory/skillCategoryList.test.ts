import "reflect-metadata";
import { SkillCategoryResolver } from "../../../src/resolvers/skillCategory.resolver";
import { prismaMock } from "../../singleton";
import { CategoryResponse } from "../../../src/types/response.types";
import type { SkillCategoryWithSkillsDTO } from "../../../src/entities/skillCategoryWithSkillsDTO.entity";
import type { Skill as PrismaSkill, SkillCategory as PrismaSkillCategory, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

describe("SkillCategoryResolver - skillList", (): void => {
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
    name: "Docker",
    image: "docker.png",
  };

  const mockCategories: SkillCategoryWithSkills[] = [
    {
      id: 1,
      categoryEN: "Programming",
      categoryFR: "Programmation",
      skills: [
        { skillId: 1, categoryId: 1, skill: mockSkill1 },
        { skillId: 2, categoryId: 1, skill: mockSkill2 },
      ],
    },
    {
      id: 2,
      categoryEN: "DevOps",
      categoryFR: "DevOps",
      skills: [{ skillId: 3, categoryId: 2, skill: mockSkill3 }],
    },
    {
      id: 3,
      categoryEN: "Design",
      categoryFR: "Conception",
      skills: [],
    },
  ];

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findMany.mockReset();
    resolver = new SkillCategoryResolver(prismaMock);
  });

  it("should return all skill categories with their associated skills", async (): Promise<void> => {
    prismaMock.skillCategory.findMany.mockResolvedValueOnce(mockCategories);

    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories?.length).toBe(3);

    const firstCategory: SkillCategoryWithSkillsDTO | undefined = result.categories?.[0];
    expect(firstCategory?.id).toBe(1);
    expect(firstCategory?.categoryEN).toBe("Programming");
    expect(firstCategory?.categoryFR).toBe("Programmation");
    expect(firstCategory?.skills?.length).toBe(2);
    expect(firstCategory?.skills?.[0]?.name).toBe("JavaScript");
    expect(firstCategory?.skills?.[1]?.name).toBe("TypeScript");

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { id: "asc" },
    });
  });

  it("should return skill categories with empty skills arrays", async (): Promise<void> => {
    const categoriesWithEmptySkills: SkillCategoryWithSkills[] = [
      {
        id: 1,
        categoryEN: "Empty Category",
        categoryFR: "Catégorie Vide",
        skills: [],
      },
    ];

    prismaMock.skillCategory.findMany.mockResolvedValueOnce(categoriesWithEmptySkills);

    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories?.length).toBe(1);
    expect(result.categories?.[0].skills).toEqual([]);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return empty array if no categories exist", async (): Promise<void> => {
    prismaMock.skillCategory.findMany.mockResolvedValueOnce([]);

    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    const dbError: Error = new Error("Database connection failed");
    prismaMock.skillCategory.findMany.mockRejectedValueOnce(dbError);

    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch categories");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
  });

  it("should handle unknown error types", async (): Promise<void> => {
    const unknownError: unknown = "Some unknown error";
    prismaMock.skillCategory.findMany.mockRejectedValueOnce(unknownError);

    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch categories");
    expect(result.categories).toBeUndefined();
  });
});
