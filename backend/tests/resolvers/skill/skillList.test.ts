import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { CategoryResponse } from "../../../src/types/response.types";
import { SkillCategory as PrismaSkillCategory, Skill as PrismaSkill } from "@prisma/client";

describe("SkillResolver - skillList", () => {
  let skillResolver: SkillResolver;

  const mockCategories: (PrismaSkillCategory & { skills: PrismaSkill[] })[] = [
    {
      id: 1,
      categoryEN: "Programming",
      categoryFR: "Programmation",
      skills: [
        { id: 101, name: "JavaScript", image: "js.png", categoryId: 1 },
        { id: 102, name: "TypeScript", image: "ts.png", categoryId: 1 },
      ],
    },
    {
      id: 2,
      categoryEN: "Design",
      categoryFR: "Conception",
      skills: [],
    },
    {
      id: 3,
      categoryEN: "DevOps",
      categoryFR: "DevOps",
      skills: [{ id: 103, name: "Docker", image: "docker.png", categoryId: 3 }],
    },
  ];

  const expectedCategories: (PrismaSkillCategory & { skills: PrismaSkill[] })[] = [...mockCategories];

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findMany.mockReset();
    skillResolver = new SkillResolver(prismaMock);
  });

  it("should return all skill categories with their associated skills", async () => {
    prismaMock.skillCategory.findMany.mockResolvedValueOnce(mockCategories);

    const result: CategoryResponse = await skillResolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories).toEqual(expectedCategories);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
  });

  it("should return an empty array if no categories are found", async () => {
    prismaMock.skillCategory.findMany.mockResolvedValueOnce([]);

    const result: CategoryResponse = await skillResolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
  });

  it("should return 500 if fetching categories fails", async () => {
    prismaMock.skillCategory.findMany.mockRejectedValueOnce(new Error("Database connection error"));

    const result: CategoryResponse = await skillResolver.skillList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch categories");
    expect(result.categories).toBeUndefined();

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
  });
});