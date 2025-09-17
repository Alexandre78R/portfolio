import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateProjectInput } from "../../../src/entities/inputs/project.input";
import { ProjectResponse } from "../../../src/types/response.types";
import { Project as PrismaProject, Skill as PrismaSkill, ProjectSkill as PrismaProjectSkill } from "@prisma/client";
import { mockDeep } from 'jest-mock-extended';
import Cookies from 'cookies';

describe("ProjectResolver - createProject", () => {
  let resolver: ProjectResolver;
  const mockCookies = mockDeep<Cookies>();

  const mockAdminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const mockRegularUser: User = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseMockContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: mockCookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const mockExistingSkills: PrismaSkill[] = [
    { id: 1, name: "React", image: "react.png", categoryId: 10 },
    { id: 2, name: "Node.js", image: "node.png", categoryId: 11 },
    { id: 3, name: "TypeScript", image: "ts.png", categoryId: 10 },
  ];

  const mockCreateProjectInput: CreateProjectInput = {
    title: "New Portfolio Project",
    descriptionEN: "A fantastic new project in English.",
    descriptionFR: "Un nouveau projet fantastique en français.",
    typeDisplay: "Web Application",
    github: "https://github.com/newproject",
    contentDisplay: "Some content about the project.",
    skillIds: [1, 2],
  };

  const mockCreatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
    id: 1,
    title: mockCreateProjectInput.title,
    descriptionEN: mockCreateProjectInput.descriptionEN,
    descriptionFR: mockCreateProjectInput.descriptionFR,
    typeDisplay: mockCreateProjectInput.typeDisplay,
    github: mockCreateProjectInput.github ?? "",
    contentDisplay: mockCreateProjectInput.contentDisplay,
    skills: [
      { projectId: 1, skillId: 1, skill: mockExistingSkills[0] },
      { projectId: 1, skillId: 2, skill: mockExistingSkills[1] },
    ],
  };

  const expectedProjectResponse = {
    id: mockCreatedProject.id,
    title: mockCreatedProject.title,
    descriptionEN: mockCreatedProject.descriptionEN,
    descriptionFR: mockCreatedProject.descriptionFR,
    typeDisplay: mockCreatedProject.typeDisplay,
    github: mockCreatedProject.github,
    contentDisplay: mockCreatedProject.contentDisplay,
    skills: mockCreatedProject.skills.map(s => ({
      id: s.skill.id,
      name: s.skill.name,
      image: s.skill.image,
      categoryId: s.skill.categoryId,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.skill.findMany.mockReset();
    prismaMock.project.create.mockReset();
    resolver = new ProjectResolver(prismaMock);
    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully create a project with skills by admin", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.skill.findMany.mockResolvedValueOnce(
      mockExistingSkills.filter(s => mockCreateProjectInput.skillIds.includes(s.id))
    );
    prismaMock.project.create.mockResolvedValueOnce(mockCreatedProject);

    const result: ProjectResponse = await resolver.createProject(mockCreateProjectInput, context);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project created successfully");
    expect(result.project).toEqual(expectedProjectResponse);

    expect(prismaMock.skill.findMany).toHaveBeenCalledWith({
      where: { id: { in: mockCreateProjectInput.skillIds } },
    });
    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        title: mockCreateProjectInput.title,
        descriptionEN: mockCreateProjectInput.descriptionEN,
        descriptionFR: mockCreateProjectInput.descriptionFR,
        typeDisplay: mockCreateProjectInput.typeDisplay,
        github: mockCreateProjectInput.github,
        contentDisplay: mockCreateProjectInput.contentDisplay,
        skills: {
          create: mockCreateProjectInput.skillIds.map(skillId => ({ skill: { connect: { id: skillId } } })),
        },
      },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should successfully create a project with no skills by admin", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    const input: CreateProjectInput = { ...mockCreateProjectInput, skillIds: [] };
    const projectWithoutSkills: typeof mockCreatedProject = { ...mockCreatedProject, skills: [] };

    prismaMock.skill.findMany.mockResolvedValueOnce([]);
    prismaMock.project.create.mockResolvedValueOnce(projectWithoutSkills);

    const result: ProjectResponse = await resolver.createProject(input, context);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project created successfully");
    expect(result.project).toEqual({ ...expectedProjectResponse, skills: [] });

    expect(prismaMock.skill.findMany).toHaveBeenCalledWith({ where: { id: { in: [] } } });

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        title: input.title,
        descriptionEN: input.descriptionEN,
        descriptionFR: input.descriptionFR,
        typeDisplay: input.typeDisplay,
        github: input.github,
        contentDisplay: input.contentDisplay,
        skills: { create: [] },
      },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should return 401 if unauthenticated", async () => {
    const context: MyContext = { ...baseMockContext, user: null };
    const result: ProjectResponse = await resolver.createProject(mockCreateProjectInput, context);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.project).toBeUndefined();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.project.create).not.toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", async () => {
    const context: MyContext = { ...baseMockContext, user: mockRegularUser };
    const result: ProjectResponse = await resolver.createProject(mockCreateProjectInput, context);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.project).toBeUndefined();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.project.create).not.toHaveBeenCalled();
  });

  it("should return 400 if skill IDs are invalid", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    const input: CreateProjectInput = { ...mockCreateProjectInput, skillIds: [1, 999] };

    prismaMock.skill.findMany.mockResolvedValueOnce(mockExistingSkills.filter(s => s.id === 1));

    const result: ProjectResponse = await resolver.createProject(input, context);

    expect(result.code).toBe(400);
    expect(result.message).toBe("One or more skill IDs are invalid.");
    expect(result.project).toBeUndefined();
    expect(prismaMock.project.create).not.toHaveBeenCalled();
  });

  it("should return 500 if skill validation fails", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error("DB skill error"));

    const result: ProjectResponse = await resolver.createProject(mockCreateProjectInput, context);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();
    expect(prismaMock.project.create).not.toHaveBeenCalled();
  });

  it("should return 500 if project creation fails", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };
    prismaMock.skill.findMany.mockResolvedValueOnce(
      mockExistingSkills.filter(s => mockCreateProjectInput.skillIds.includes(s.id))
    );
    prismaMock.project.create.mockRejectedValueOnce(new Error("DB create error"));

    const result: ProjectResponse = await resolver.createProject(mockCreateProjectInput, context);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();
  });
});