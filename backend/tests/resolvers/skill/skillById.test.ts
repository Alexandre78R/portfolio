import "reflect-metadata";
import { SkillResolver } from "../../../src/resolvers/skill.resolver";
import { prismaMock } from "../../singleton";
import { SubItemResponse } from "../../../src/types/response.types";
import { Skill as PrismaSkill } from "@prisma/client";

describe("SkillResolver - skillById", () => {
  let skillResolver: SkillResolver;

  const mockSkill: PrismaSkill = {
    id: 1,
    name: "JavaScript",
    image: "js.png",
    categoryId: 1,
  };

  const mockSkillNotFound: PrismaSkill | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skill.findUnique.mockReset();
    skillResolver = new SkillResolver(prismaMock);
  });

  it("should return a skill successfully when skill exists", async () => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill);

    const result: SubItemResponse = await skillResolver.skillById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Skill fetched successfully");
    expect(result.subItems).toBeDefined();
    expect(result.subItems).toHaveLength(1);
    expect(result.subItems?.[0]).toEqual({
      id: 1,
      name: "JavaScript",
      image: "js.png",
      categoryId: 1,
    });

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 when skill does not exist", async () => {
    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkillNotFound);

    const result: SubItemResponse = await skillResolver.skillById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Skill not found");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it("should return 500 if fetching skill fails", async () => {
    prismaMock.skill.findUnique.mockRejectedValueOnce(new Error("Database connection error"));

    const result: SubItemResponse = await skillResolver.skillById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch skill");
    expect(result.subItems).toEqual([]);

    expect(prismaMock.skill.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should handle different skill IDs correctly", async () => {
    const mockSkill2: PrismaSkill = {
      id: 42,
      name: "TypeScript",
      image: "ts.png",
      categoryId: 2,
    };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkill2);

    const result: SubItemResponse = await skillResolver.skillById(42);

    expect(result.code).toBe(200);
    expect(result.subItems?.[0]?.id).toBe(42);
    expect(result.subItems?.[0]?.name).toBe("TypeScript");

    expect(prismaMock.skill.findUnique).toHaveBeenCalledWith({
      where: { id: 42 },
    });
  });

  it("should return correct data structure for skill with different category", async () => {
    const mockSkillOtherCategory: PrismaSkill = {
      id: 5,
      name: "Docker",
      image: "docker.png",
      categoryId: 3,
    };

    prismaMock.skill.findUnique.mockResolvedValueOnce(mockSkillOtherCategory);

    const result: SubItemResponse = await skillResolver.skillById(5);

    expect(result.code).toBe(200);
    expect(result.subItems?.[0]).toEqual({
      id: 5,
      name: "Docker",
      image: "docker.png",
      categoryId: 3,
    });
  });
});
