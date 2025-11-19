import "reflect-metadata";

import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateProjectInput } from "../../../src/entities/inputs/project.input";
import { ProjectResponse } from "../../../src/types/response.types";

import type {
  Project as PrismaProject,
  Skill as PrismaSkill,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";

import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import Cookies from "cookies";

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

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<
    PrismaProjectSkill & {
      skill: PrismaSkill;
    }
  >;
};

describe("ProjectResolver - createProject", () => {

  let resolver: ProjectResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const adminUser: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const regularUser: Readonly<User> = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const existingSkills: ReadonlyArray<PrismaSkill> = [
    { id: 1, name: "React", image: "react.png", categoryId: 10 },
    { id: 2, name: "Node.js", image: "node.png", categoryId: 11 },
    { id: 3, name: "TypeScript", image: "ts.png", categoryId: 10 },
  ];

  const createProjectInput: Readonly<CreateProjectInput> = {
    title: "New Portfolio Project",
    descriptionEN: "A fantastic new project in English.",
    descriptionFR: "Un nouveau projet fantastique en français.",
    typeDisplay: "Web Application",
    github: "https://github.com/newproject",
    contentDisplay: "Some content about the project.",
    skillIds: [1, 2],
  };

  const createdProject: PrismaProjectWithSkills = {
    id: 1,
    title: createProjectInput.title,
    descriptionEN: createProjectInput.descriptionEN,
    descriptionFR: createProjectInput.descriptionFR,
    typeDisplay: createProjectInput.typeDisplay,
    github: createProjectInput.github ?? "",
    contentDisplay: createProjectInput.contentDisplay,
    skills: [
      { projectId: 1, skillId: 1, skill: existingSkills[0] },
      { projectId: 1, skillId: 2, skill: existingSkills[1] },
    ],
  };

  const expectedProject: ProjectResolverOutput = {
    id: createdProject.id,
    title: createdProject.title,
    descriptionEN: createdProject.descriptionEN,
    descriptionFR: createdProject.descriptionFR,
    typeDisplay: createdProject.typeDisplay,
    github: createdProject.github,
    contentDisplay: createdProject.contentDisplay,
    skills: createdProject.skills.map(({ skill }) => ({
      id: skill.id,
      name: skill.name,
      image: skill.image,
      categoryId: skill.categoryId,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();

    resolver = new ProjectResolver(prismaMock);

    prismaMock.skill.findMany.mockReset();
    prismaMock.project.create.mockReset();
  });

  it("should create a project with skills when user is admin", async () => {
    const context: MyContext = {
      ...baseContext,
      user: adminUser,
      cookies: cookiesMock,
    };

    prismaMock.skill.findMany.mockResolvedValueOnce(
      existingSkills.filter(skill =>
        createProjectInput.skillIds.includes(skill.id),
      ),
    );

    prismaMock.project.create.mockResolvedValueOnce(createdProject);

    const result: ProjectResponse = await resolver.createProject(
      createProjectInput,
      context,
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project created successfully");
    expect(result.project).toEqual(expectedProject);
  });

  it("should create a project without skills when user is admin", async () => {
    const context: MyContext = {
      ...baseContext,
      user: adminUser,
      cookies: cookiesMock,
    };

    prismaMock.skill.findMany.mockResolvedValueOnce([]);
    prismaMock.project.create.mockResolvedValueOnce(
      {
        ...createdProject,
        skills: [],
      } as PrismaProjectWithSkills,
    );

    const result: ProjectResponse = await resolver.createProject(
      { ...createProjectInput, skillIds: [] },
      context,
    );

    expect(result.code).toBe(200);
    expect(result.project?.skills).toHaveLength(0);
  });

  it("should return 401 when user is not authenticated", async () => {
    const result: ProjectResponse = await resolver.createProject(
      createProjectInput,
      baseContext,
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.project).toBeUndefined();
  });

  it("should return 403 when user is not admin", async () => {
    const context: MyContext = {
      ...baseContext,
      user: regularUser,
      cookies: cookiesMock,
    };

    const result: ProjectResponse = await resolver.createProject(
      createProjectInput,
      context,
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
  });

  it("should return 400 when at least one skill ID is invalid", async () => {
    const context: MyContext = {
      ...baseContext,
      user: adminUser,
      cookies: cookiesMock,
    };

    prismaMock.skill.findMany.mockResolvedValueOnce(
      existingSkills.filter(skill => skill.id === 1),
    );

    const result: ProjectResponse = await resolver.createProject(
      { ...createProjectInput, skillIds: [1, 999] },
      context,
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("One or more skill IDs are invalid.");
  });

  it("should return 500 when skill validation throws an error", async () => {
    const context: MyContext = {
      ...baseContext,
      user: adminUser,
      cookies: cookiesMock,
    };

    prismaMock.skill.findMany.mockRejectedValueOnce(
      new Error("Database error"),
    );

    const result: ProjectResponse = await resolver.createProject(
      createProjectInput,
      context,
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
  });

  it("should return 500 when project creation fails", async () => {
    const context: MyContext = {
      ...baseContext,
      user: adminUser,
      cookies: cookiesMock,
    };

    prismaMock.skill.findMany.mockResolvedValueOnce(
      existingSkills.filter(skill =>
        createProjectInput.skillIds.includes(skill.id),
      ),
    );

    prismaMock.project.create.mockRejectedValueOnce(
      new Error("Database error"),
    );

    const result: ProjectResponse = await resolver.createProject(
      createProjectInput,
      context,
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
  });
});