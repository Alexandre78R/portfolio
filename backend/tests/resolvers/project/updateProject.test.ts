import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateProjectInput } from "../../../src/entities/inputs/project.input";
import { ProjectResponse } from "../../../src/types/response.types";
import Cookies from "cookies";
import {
  Project as PrismaProject,
  Skill as PrismaSkill,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

type ProjectWithSkills = PrismaProject & {
  skills: PrismaProjectSkill[];
};

type ProjectWithSkillsAndSkill = PrismaProject & {
  skills: (PrismaProjectSkill & { skill: PrismaSkill })[];
};

describe("ProjectResolver - updateProject", () => {
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

  const mockEditorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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

  /* -------------------------------------------------------------------------- */
  /*                                   MOCKS                                    */
  /* -------------------------------------------------------------------------- */

  const mockExistingProject: ProjectWithSkills = {
    id: 100,
    title: "Old Project Title",
    descriptionEN: "Old English description.",
    descriptionFR: "Ancienne description française.",
    typeDisplay: "Old Type",
    github: "https://github.com/oldproject",
    contentDisplay: "Old project content.",
    skills: [
      { projectId: 100, skillId: 1 },
      { projectId: 100, skillId: 2 },
    ],
  };

  const mockAvailableSkills: PrismaSkill[] = [
    { id: 1, name: "React", image: "react.png", categoryId: 10 },
    { id: 2, name: "Node.js", image: "node.png", categoryId: 11 },
    { id: 3, name: "TypeScript", image: "ts.png", categoryId: 10 },
  ];

  const createSkillDto = (skill: PrismaSkill) => ({
    id: skill.id,
    name: skill.name,
    image: skill.image,
    categoryId: skill.categoryId,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.project.findUnique.mockReset();
    prismaMock.project.update.mockReset();
    prismaMock.skill.findMany.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();

    resolver = new ProjectResolver(prismaMock);
  });

  it("should successfully update a project with all fields (including skillIds) by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const updateInput: UpdateProjectInput = {
      id: 100,
      title: "Updated Project Title",
      descriptionEN: "New English description.",
      descriptionFR: "Nouvelle description française.",
      typeDisplay: "Updated Type",
      github: "https://github.com/updatedproject",
      contentDisplay: "Updated content.",
      skillIds: [1, 3],
    };

    const mockUpdatedProject: ProjectWithSkillsAndSkill = {
      id: 100,
      title: updateInput.title!,
      descriptionEN: updateInput.descriptionEN!,
      descriptionFR: updateInput.descriptionFR!,
      typeDisplay: updateInput.typeDisplay!,
      github: updateInput.github!,
      contentDisplay: updateInput.contentDisplay!,
      skills: [
        { projectId: 100, skillId: 1, skill: mockAvailableSkills[0] },
        { projectId: 100, skillId: 3, skill: mockAvailableSkills[2] },
      ],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(
      mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id))
    );
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockResolvedValueOnce(mockUpdatedProject);

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project!.skills).toEqual([
      createSkillDto(mockAvailableSkills[0]),
      createSkillDto(mockAvailableSkills[2]),
    ]);
  });

  it("should successfully update a project with all fields (including skillIds) by an editor user", async () => {
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([mockAvailableSkills[0]]);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });

    prismaMock.project.update.mockResolvedValueOnce({
      ...mockExistingProject,
      skills: [{ projectId: 100, skillId: 1, skill: mockAvailableSkills[0] }],
    } as ProjectWithSkillsAndSkill);

    const result = await resolver.updateProject(
      { id: 100, skillIds: [1] },
      editorContext
    );

    expect(result.code).toBe(200);
  });

  it("should update project without touching skills", async () => {
    const context: MyContext = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.project.update.mockResolvedValueOnce({
      ...mockExistingProject,
      skills: mockExistingProject.skills.map(ps => ({
        ...ps,
        skill: mockAvailableSkills.find(s => s.id === ps.skillId)!,
      })),
    } as ProjectWithSkillsAndSkill);

    const result = await resolver.updateProject(
      { id: 100, title: "Only Title Updated" },
      context
    );

    expect(result.code).toBe(200);
  });

  it("should return 401 if no user is authenticated", async () => {
    const result = await resolver.updateProject(
      { id: 1 },
      baseMockContext
    );

    expect(result.code).toBe(401);
  });

  it("should return 403 if user is not admin or editor", async () => {
    const context = { ...baseMockContext, user: mockRegularUser };

    const result = await resolver.updateProject({ id: 1 }, context);

    expect(result.code).toBe(403);
  });

  it("should return 404 if project not found", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.updateProject({ id: 999 }, context);

    expect(result.code).toBe(404);
  });

  it("should return 400 if skillIds are invalid", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([mockAvailableSkills[0]]);

    const result = await resolver.updateProject(
      { id: 100, skillIds: [1, 999] },
      context
    );

    expect(result.code).toBe(400);
  });

  it("should return 500 on DB error (findUnique)", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result = await resolver.updateProject({ id: 100 }, context);

    expect(result.code).toBe(500);
  });

  it("should return 500 on DB error (findMany)", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error("DB error"));

    const result = await resolver.updateProject(
      { id: 100, skillIds: [1] },
      context
    );

    expect(result.code).toBe(500);
  });

  it("should return 500 on DB error (deleteMany)", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);

    prismaMock.skill.findMany.mockResolvedValueOnce([
      mockAvailableSkills[0],
      mockAvailableSkills[1],
    ]);

    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(
      new Error("DB error")
    );

    const result = await resolver.updateProject(
      { id: 100, skillIds: [1, 2] },
      context
    );

    expect(result.code).toBe(500);
  });

  it("should return 500 on DB error (update)", async () => {
    const context = { ...baseMockContext, user: mockAdminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);

    prismaMock.skill.findMany.mockResolvedValueOnce([
      mockAvailableSkills[0],
      mockAvailableSkills[1],
    ]);

    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });

    prismaMock.project.update.mockRejectedValueOnce(
      new Error("DB error")
    );

    const result = await resolver.updateProject(
      { id: 100, skillIds: [1, 2] },
      context
    );

    expect(result.code).toBe(500);
  });
});