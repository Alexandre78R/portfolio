import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { CategoryResponse } from "../../../src/types/response.types";
import { SkillCategory as PrismaSkillCategory, Skill as PrismaSkill } from "@prisma/client"; 

describe("SkillResolver - skillList", () => {
  let resolver: SkillResolver;

  const mockCategoriesWithSkills: (PrismaSkillCategory & { skills: PrismaSkill[] })[] = [
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

  const expectedMappedCategories = [
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

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skillCategory.findMany.mockReset();
    resolver = new SkillResolver(prismaMock);
  });

  it("should return all skill categories with their associated skills successfully", async () => {

    prismaMock.skillCategory.findMany.mockResolvedValueOnce(mockCategoriesWithSkills);


    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories).toEqual(expectedMappedCategories);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
  });

  it("should return an empty array if no skill categories are found", async () => {

    prismaMock.skillCategory.findMany.mockResolvedValueOnce([]);


    const result: CategoryResponse = await resolver.skillList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Categories fetched successfully");
    expect(result.categories).toBeDefined();
    expect(result.categories).toEqual([]);

    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skillCategory.findMany).toHaveBeenCalledWith({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
  });

  it("should return a 500 error if fetching categories fails", async () => {

    const errorMessage = "Database connection error";
    prismaMock.skillCategory.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: CategoryResponse = await resolver.skillList();

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