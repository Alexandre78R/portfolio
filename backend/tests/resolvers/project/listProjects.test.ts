import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import { ProjectsResponse } from "../../../src/types/response.types";
import { prismaMock } from "../../singleton";

type PrismaProjectWithSkills = PrismaProject & {
  image?: string | null;
  video?: string | null;
  skills: Array<
    ProjectSkill & {
      skill: Skill;
    }
  >;
};

describe("ProjectResolver - listProjects", (): void => {
  let resolver: ProjectResolver;

  const mockSkills: Skill[] = [
    {
      id: 1,
      name: "React",
      image: "react.png",
    },
    {
      id: 2,
      name: "TypeScript",
      image: "typescript.png",
    },
  ];

  const mockProjects: PrismaProjectWithSkills[] = [
    {
      id: 1,
      title: "Portfolio",
      descriptionFR: "Mon portfolio personnel",
      descriptionEN: "My personal portfolio",
      github: "https://github.com/user/portfolio",
      typeDisplay: "website",
      contentDisplay: "image",
      image: "portfolio.png",
      video: null,
      skills: [
        {
          projectId: 1,
          skillId: 1,
          skill: mockSkills[0],
        },
        {
          projectId: 1,
          skillId: 2,
          skill: mockSkills[1],
        },
      ],
    },
    {
      id: 2,
      title: "E-commerce",
      descriptionFR: "Plateforme e-commerce",
      descriptionEN: "E-commerce platform",
      github: "https://github.com/user/ecommerce",
      typeDisplay: "website",
      contentDisplay: "video",
      image: null,
      video: "ecommerce.mp4",
      skills: [
        {
          projectId: 2,
          skillId: 1,
          skill: mockSkills[0],
        },
      ],
    },
  ];

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.project.findMany.mockReset();
    resolver = new ProjectResolver(prismaMock);
  });

  it("should return a list of projects successfully", async (): Promise<void> => {
    prismaMock.project.findMany.mockResolvedValueOnce(mockProjects);

    const result: ProjectsResponse = await resolver.listProjects();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Projects fetched");
    expect(result.projects).toBeDefined();
    expect(result.projects).toHaveLength(2);
    expect(result.projects?.[0].id).toBe(1);
    expect(result.projects?.[0].title).toBe("Portfolio");
    expect(result.projects?.[0].skills).toHaveLength(2);
    expect(result.projects?.[1].id).toBe(2);
    expect(result.projects?.[1].title).toBe("E-commerce");

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: { skills: { include: { skill: true } } },
      orderBy: { id: "desc" },
    });
    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list when no projects exist", async (): Promise<void> => {
    prismaMock.project.findMany.mockResolvedValueOnce([]);

    const result: ProjectsResponse = await resolver.listProjects();

    expect(result.code).toBe(200);
    expect(result.message).toBe("Projects fetched");
    expect(result.projects).toBeDefined();
    expect(result.projects).toHaveLength(0);

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: { skills: { include: { skill: true } } },
      orderBy: { id: "desc" },
    });
  });

  it("should map project skills correctly", async (): Promise<void> => {
    prismaMock.project.findMany.mockResolvedValueOnce([mockProjects[0]]);

    const result: ProjectsResponse = await resolver.listProjects();

    expect(result.projects?.[0].skills).toBeDefined();
    expect(result.projects?.[0].skills).toHaveLength(2);
    expect(result.projects?.[0].skills?.[0]).toEqual({
      id: 1,
      name: "React",
      image: "react.png",
    });
    expect(result.projects?.[0].skills?.[1]).toEqual({
      id: 2,
      name: "TypeScript",
      image: "typescript.png",
    });
  });

  it("should handle projects with null image and video", async (): Promise<void> => {
    const projectWithoutMedia: PrismaProjectWithSkills = {
      id: 3,
      title: "CLI Tool",
      descriptionFR: "Outil CLI",
      descriptionEN: "CLI Tool",
      github: "https://github.com/user/cli-tool",
      typeDisplay: "tool",
      contentDisplay: "none",
      image: null,
      video: null,
      skills: [],
    };

    prismaMock.project.findMany.mockResolvedValueOnce([projectWithoutMedia]);

    const result: ProjectsResponse = await resolver.listProjects();

    expect(result.projects?.[0].image).toBeNull();
    expect(result.projects?.[0].video).toBeNull();
  });

  it("should throw error when database query fails", async (): Promise<void> => {
    const error = new Error("Database connection failed");
    prismaMock.project.findMany.mockRejectedValueOnce(error);

    await expect(resolver.listProjects()).rejects.toThrow("Database connection failed");

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      include: { skills: { include: { skill: true } } },
      orderBy: { id: "desc" },
    });
  });
});
