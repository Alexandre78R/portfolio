import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { ProjectResponse } from "../../../src/types/response.types";
import { Project as PrismaProject, Skill as PrismaSkill, ProjectSkill as PrismaProjectSkill } from "@prisma/client";

describe("ProjectResolver - projectById", () => {
  let resolver: ProjectResolver;

  const mockExistingProjectWithSkills: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
    id: 1,
    title: "My Awesome Project",
    descriptionEN: "A project to showcase skills.",
    descriptionFR: "Un projet pour montrer les compétences.",
    typeDisplay: "Web App",
    github: "https://github.com/myawesomeproject",
    contentDisplay: "Detailed content about the project.",
    skills: [
      {
        projectId: 1,
        skillId: 101,
        skill: { id: 101, name: "React", image: "react.png", categoryId: 1 },
      },
      {
        projectId: 1,
        skillId: 102,
        skill: { id: 102, name: "TypeScript", image: "typescript.png", categoryId: 1 },
      },
    ],
  };

  const expectedMappedProject = {
    id: mockExistingProjectWithSkills.id,
    title: mockExistingProjectWithSkills.title,
    descriptionEN: mockExistingProjectWithSkills.descriptionEN,
    descriptionFR: mockExistingProjectWithSkills.descriptionFR,
    typeDisplay: mockExistingProjectWithSkills.typeDisplay,
    github: mockExistingProjectWithSkills.github,
    contentDisplay: mockExistingProjectWithSkills.contentDisplay,
    skills: [
      { id: 101, name: "React", image: "react.png", categoryId: 1 },
      { id: 102, name: "TypeScript", image: "typescript.png", categoryId: 1 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.project.findUnique.mockReset();
    resolver = new ProjectResolver(prismaMock);
  });

  it("should return a project by ID with its associated skills successfully", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProjectWithSkills);

    const result: ProjectResponse = await resolver.projectById(mockExistingProjectWithSkills.id);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project found");
    expect(result.project).toBeDefined();
    expect(result.project).toEqual(expectedMappedProject);

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: mockExistingProjectWithSkills.id },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return 404 if the project is not found", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: ProjectResponse = await resolver.projectById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Project not found");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return 500 for an internal server error", async () => {
    const errorMessage = "Database query failed";
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectResponse = await resolver.projectById(mockExistingProjectWithSkills.id);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: mockExistingProjectWithSkills.id },
      include: { skills: { include: { skill: true } } },
    });
  });
});