import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { CategoryResponse } from "../../../src/types/response.types";
import { SkillCategory as PrismaSkillCategory, Skill as PrismaSkill } from "@prisma/client";

describe("SkillResolver - skillCategoryById", () => {
  let skillResolver: SkillResolver;

  const mockCategory: PrismaSkillCategory & { skills: PrismaSkill[] } = {
    id: 1,
    categoryEN: "Programming",
    categoryFR: "Programmation",
    skills: [
      { id: 101, name: "JavaScript", image: "js.png", categoryId: 1 },
      { id: 102, name: "TypeScript", image: "ts.png", categoryId: 1 },
      { id: 103, name: "Node.js", image: "nodejs.png", categoryId: 1 },
    ],
  };

  const mockCategoryNoSkills: PrismaSkillCategory & { skills: PrismaSkill[] } = {
    id: 2,
    categoryEN: "Design",
    categoryFR: "Conception",
    skills: [],
  };

  const mockCategoryNotFound: (PrismaSkillCategory & { skills: PrismaSkill[] }) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findUnique.mockReset();
    skillResolver = new SkillResolver(prismaMock);
  });

  it("should return a category with all skills when category exists", async () => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategory);

    const result: CategoryResponse = await skillResolver.skillCategoryById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories).toHaveLength(1);

    const category = result.categories?.[0];
    expect(category).toEqual({
      id: 1,
      categoryEN: "Programming",
      categoryFR: "Programmation",
      skills: [
        { id: 101, name: "JavaScript", image: "js.png", categoryId: 1 },
        { id: 102, name: "TypeScript", image: "ts.png", categoryId: 1 },
        { id: 103, name: "Node.js", image: "nodejs.png", categoryId: 1 },
      ],
    });

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { skills: true },
    });
  });

  it("should return a category with empty skills array when category has no skills", async () => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryNoSkills);

    const result: CategoryResponse = await skillResolver.skillCategoryById(2);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Category fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories).toHaveLength(1);

    const category = result.categories?.[0];
    expect(category?.id).toBe(2);
    expect(category?.categoryEN).toBe("Design");
    expect(category?.skills).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
      include: { skills: true },
    });
  });

  it("should return 404 when category does not exist", async () => {
    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryNotFound);

    const result: CategoryResponse = await skillResolver.skillCategoryById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Category not found");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { skills: true },
    });
  });

  it("should return 500 if fetching category fails", async () => {
    prismaMock.skillCategory.findUnique.mockRejectedValueOnce(new Error("Database connection error"));

    const result: CategoryResponse = await skillResolver.skillCategoryById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch category");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should handle different category IDs correctly", async () => {
    const mockCategoryOther: PrismaSkillCategory & { skills: PrismaSkill[] } = {
      id: 5,
      categoryEN: "DevOps",
      categoryFR: "DevOps",
      skills: [{ id: 201, name: "Docker", image: "docker.png", categoryId: 5 }],
    };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryOther);

    const result: CategoryResponse = await skillResolver.skillCategoryById(5);

    expect(result.code).toBe(200);
    expect(result.categories?.[0]?.id).toBe(5);
    expect(result.categories?.[0]?.categoryEN).toBe("DevOps");
    expect(result.categories?.[0]?.skills).toHaveLength(1);

    expect(prismaMock.skillCategory.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      include: { skills: true },
    });
  });

  it("should correctly map category and skills data structure", async () => {
    const mockCategoryComplex: PrismaSkillCategory & { skills: PrismaSkill[] } = {
      id: 3,
      categoryEN: "Frontend",
      categoryFR: "Frontend",
      skills: [
        { id: 301, name: "React", image: "react.png", categoryId: 3 },
        { id: 302, name: "Vue", image: "vue.png", categoryId: 3 },
      ],
    };

    prismaMock.skillCategory.findUnique.mockResolvedValueOnce(mockCategoryComplex);

    const result: CategoryResponse = await skillResolver.skillCategoryById(3);

    expect(result.code).toBe(200);
    const category = result.categories?.[0];
    expect(category?.categoryFR).toBe("Frontend");
    expect(category?.skills).toHaveLength(2);
    expect(category?.skills[0].name).toBe("React");
    expect(category?.skills[1].name).toBe("Vue");
  });
});
