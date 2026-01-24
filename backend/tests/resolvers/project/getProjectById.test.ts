import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import { ProjectResponse } from "../../../src/types/response.types";
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

describe("ProjectResolver - getProjectById", (): void => {
  let resolver: ProjectResolver;

  const mockSkills: Skill[] = [
    {
      id: 1,
      name: "React",
      image: "react.png",
    },
    {
      id: 2,
      name: "Node.js",
      image: "nodejs.png",
    },
    {
      id: 3,
      name: "PostgreSQL",
      image: "postgresql.png",
    },
  ];

  const mockProjectWithSkills: PrismaProjectWithSkills = {
    id: 1,
    title: "Portfolio Website",
    descriptionFR: "Mon portfolio personnel avec Next.js",
    descriptionEN: "My personal portfolio with Next.js",
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
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    prismaMock.project.findUnique.mockReset();
    resolver = new ProjectResolver(prismaMock);
  });

  it("should return a project by id successfully", async (): Promise<void> => {
    prismaMock.project.findUnique.mockResolvedValueOnce(mockProjectWithSkills);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project fetched");
    expect(result.project).toBeDefined();
    expect(result.project?.id).toBe(1);
    expect(result.project?.title).toBe("Portfolio Website");
    expect(result.project?.descriptionFR).toBe("Mon portfolio personnel avec Next.js");
    expect(result.project?.descriptionEN).toBe("My personal portfolio with Next.js");
    expect(result.project?.github).toBe("https://github.com/user/portfolio");
    expect(result.project?.typeDisplay).toBe("website");
    expect(result.project?.contentDisplay).toBe("image");
    expect(result.project?.image).toBe("portfolio.png");
    expect(result.project?.video).toBeNull();

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { skills: { include: { skill: true } } },
    });
    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should return 404 when project not found", async (): Promise<void> => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: ProjectResponse = await resolver.getProjectById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Project not found");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return project with all skills mapped correctly", async (): Promise<void> => {
    prismaMock.project.findUnique.mockResolvedValueOnce(mockProjectWithSkills);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.project?.skills).toBeDefined();
    expect(result.project?.skills).toHaveLength(2);
    expect(result.project?.skills?.[0]).toEqual({
      id: 1,
      name: "React",
      image: "react.png",
    });
    expect(result.project?.skills?.[1]).toEqual({
      id: 2,
      name: "Node.js",
      image: "nodejs.png",
    });
  });

  it("should return project with empty skills array", async (): Promise<void> => {
    const projectWithoutSkills: PrismaProjectWithSkills = {
      ...mockProjectWithSkills,
      skills: [],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(projectWithoutSkills);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.code).toBe(200);
    expect(result.project?.skills).toEqual([]);
  });

  it("should return project with video content", async (): Promise<void> => {
    const projectWithVideo: PrismaProjectWithSkills = {
      ...mockProjectWithSkills,
      contentDisplay: "video",
      image: null,
      video: "project.mp4",
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(projectWithVideo);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.code).toBe(200);
    expect(result.project?.image).toBeNull();
    expect(result.project?.video).toBe("project.mp4");
    expect(result.project?.contentDisplay).toBe("video");
  });

  it("should handle project with multiple skills", async (): Promise<void> => {
    const projectWithManySkills: PrismaProjectWithSkills = {
      ...mockProjectWithSkills,
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
        {
          projectId: 1,
          skillId: 3,
          skill: mockSkills[2],
        },
      ],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(projectWithManySkills);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.project?.skills).toHaveLength(3);
    expect(result.project?.skills?.[2]).toEqual({
      id: 3,
      name: "PostgreSQL",
      image: "postgresql.png",
    });
  });

  it("should handle null github link", async (): Promise<void> => {
    const projectWithoutGithub: PrismaProjectWithSkills = {
      ...mockProjectWithSkills,
      github: null,
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(projectWithoutGithub);

    const result: ProjectResponse = await resolver.getProjectById(1);

    expect(result.project?.github).toBeNull();
  });

  it("should throw error when database query fails", async (): Promise<void> => {
    const error = new Error("Database connection failed");
    prismaMock.project.findUnique.mockRejectedValueOnce(error);

    await expect(resolver.getProjectById(1)).rejects.toThrow("Database connection failed");

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should handle different id values", async (): Promise<void> => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    await resolver.getProjectById(5);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
      include: { skills: { include: { skill: true } } },
    });

    jest.clearAllMocks();
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    await resolver.getProjectById(100);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 100 },
      include: { skills: { include: { skill: true } } },
    });
  });
});
