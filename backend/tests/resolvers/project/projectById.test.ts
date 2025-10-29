import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { ProjectResponse } from "../../../src/types/response.types";
import type {
  Project as PrismaProject,
  Skill as PrismaSkill,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<PrismaProjectSkill & { skill: PrismaSkill }>;
};

type ProjectResolverOutput = {
  id: number;
  title: string;
  descriptionEN: string;
  descriptionFR: string;
  typeDisplay: string;
  github: string | null;
  contentDisplay: string;
  skills: Array<{
    id: number;
    name: string;
    image: string;
    categoryId: number;
  }>;
};

describe("ProjectResolver - projectById", () => {
  let resolver: ProjectResolver;

  const mockProject: Readonly<PrismaProjectWithSkills> = {
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

  const expectedProject: ProjectResolverOutput = {
    id: mockProject.id,
    title: mockProject.title,
    descriptionEN: mockProject.descriptionEN,
    descriptionFR: mockProject.descriptionFR,
    typeDisplay: mockProject.typeDisplay,
    github: mockProject.github,
    contentDisplay: mockProject.contentDisplay,
    skills: mockProject.skills.map(({ skill }) => ({
      id: skill.id,
      name: skill.name,
      image: skill.image,
      categoryId: skill.categoryId,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.project.findUnique.mockReset();
    resolver = new ProjectResolver(prismaMock);
  });

  it("should return a project by ID with its associated skills successfully", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(mockProject);

    const result: ProjectResponse = await resolver.projectById(mockProject.id);

    expect(result).toEqual({
      code: 200,
      message: "Project found",
      project: expectedProject,
    });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: mockProject.id },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return 404 if the project is not found", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: ProjectResponse = await resolver.projectById(999);

    expect(result).toEqual({
      code: 404,
      message: "Project not found",
      project: undefined,
    });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return 500 for an internal server error", async () => {
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error("Database query failed"));

    const result: ProjectResponse = await resolver.projectById(mockProject.id);

    expect(result).toEqual({
      code: 500,
      message: "Internal server error",
      project: undefined,
    });

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: mockProject.id },
      include: { skills: { include: { skill: true } } },
    });
  });
});