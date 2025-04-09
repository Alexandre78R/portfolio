import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { ProjectsResponse } from "../../../src/entities/response.types";
import { Project as PrismaProject, Skill as PrismaSkill, ProjectSkill as PrismaProjectSkill } from "@prisma/client";

describe("ProjectResolver - projectList", () => {
  let resolver: ProjectResolver;

  const mockProjectsWithSkills: (PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] })[] = [
    {
      id: 2,
      title: "Project Alpha",
      descriptionEN: "Description Alpha EN",
      descriptionFR: "Description Alpha FR",
      typeDisplay: "Web",
      github: "https://github.com/alpha",
      contentDisplay: "Content Alpha",
      skills: [
        { projectId: 2, skillId: 101, skill: { id: 101, name: "React", image: "react.png", categoryId: 1 } },
        { projectId: 2, skillId: 102, skill: { id: 102, name: "Node.js", image: "node.png", categoryId: 2 } },
      ],
    },
    {
      id: 1,
      title: "Project Beta",
      descriptionEN: "Description Beta EN",
      descriptionFR: "Description Beta FR",
      typeDisplay: "Mobile",
      github: null,
      contentDisplay: "Content Beta",
      skills: [
        { projectId: 1, skillId: 103, skill: { id: 103, name: "Swift", image: "swift.png", categoryId: 3 } },
      ],
    },
  ];

  const expectedMappedProjects = [
    {
      id: 2,
      title: "Project Alpha",
      descriptionEN: "Description Alpha EN",
      descriptionFR: "Description Alpha FR",
      typeDisplay: "Web",
      github: "https://github.com/alpha",
      contentDisplay: "Content Alpha",
      skills: [
        { id: 101, name: "React", image: "react.png", categoryId: 1 },
        { id: 102, name: "Node.js", image: "node.png", categoryId: 2 },
      ],
    },
    {
      id: 1,
      title: "Project Beta",
      descriptionEN: "Description Beta EN",
      descriptionFR: "Description Beta FR",
      typeDisplay: "Mobile",
      github: null,
      contentDisplay: "Content Beta",
      skills: [
        { id: 103, name: "Swift", image: "swift.png", categoryId: 3 },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.project.findMany.mockReset();
    resolver = new ProjectResolver(prismaMock);
  });

  it("should return all projects with their associated skills successfully", async () => {
    prismaMock.project.findMany.mockResolvedValueOnce(mockProjectsWithSkills);

    const result: ProjectsResponse = await resolver.projectList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Projects fetched successfully");
    expect(result.projects).toBeDefined();
    expect(result.projects).toEqual(expectedMappedProjects);

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { id: "desc" },
    });
  });

  it("should return an empty array if no projects are found", async () => {
    prismaMock.project.findMany.mockResolvedValueOnce([]);

    const result: ProjectsResponse = await resolver.projectList();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Projects fetched successfully");
    expect(result.projects).toBeDefined();
    expect(result.projects).toEqual([]);

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { id: "desc" },
    });
  });

  it("should return a 500 error if fetching projects fails", async () => {
    const errorMessage = "Database connection error";
    prismaMock.project.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectsResponse = await resolver.projectList();

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.projects).toBeUndefined();

    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { id: "desc" },
    });
  });
});