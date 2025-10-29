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
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

type ProjectWithSkills = PrismaProject & {
  skills: PrismaProjectSkill[];
};

type ProjectWithSkillsAndSkill = PrismaProject & {
  skills: (PrismaProjectSkill & { skill: PrismaSkill })[];
};

describe("ProjectResolver - updateProject", () => {

  let resolver: ProjectResolver;
  let mockCookies: DeepMockProxy<Cookies>;

  const adminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const editorUser: User = {
    id: 3,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
    isPasswordChange: true,
  };

  const regularUser: User = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const baseContext: MyContext = {
    req: {} as any,
    res: {} as any,
    cookies: {} as any,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  const existingProject: ProjectWithSkills = {
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

  const availableSkills: PrismaSkill[] = [
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
    mockCookies = mockDeep<Cookies>();
    resolver = new ProjectResolver(prismaMock);

    prismaMock.project.findUnique.mockReset();
    prismaMock.project.update.mockReset();
    prismaMock.skill.findMany.mockReset();
    prismaMock.projectSkill.deleteMany.mockReset();
  });

  it("should update project including skills (admin)", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
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

    // Mock Prisma
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(
      availableSkills.filter(s => updateInput.skillIds!.includes(s.id))
    );
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockResolvedValueOnce({
      ...existingProject,
      ...updateInput,
      skills: updateInput.skillIds!.map(id => ({
        projectId: existingProject.id,
        skillId: id,
        skill: availableSkills.find(s => s.id === id)!,
      })),
    } as unknown as ProjectWithSkillsAndSkill);

    const result: ProjectResponse = await resolver.updateProject(updateInput, context);

    expect(result.code as number).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project!.skills).toEqual([
      createSkillDto(availableSkills[0]),
      createSkillDto(availableSkills[2]),
    ]);
  });

  it("should update project including skills (editor)", async () => {
    const context: MyContext = { ...baseContext, user: editorUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([availableSkills[0]]);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockResolvedValueOnce({
      ...existingProject,
      skills: [{ projectId: 100, skillId: 1, skill: availableSkills[0] }],
    } as unknown as ProjectWithSkillsAndSkill);

    const result: ProjectResponse = await resolver.updateProject(
      { id: 100, skillIds: [1] },
      context
    );

    expect(result.code as number).toBe(200);
    expect(result.project!.skills).toEqual([createSkillDto(availableSkills[0])]);
  });

  it("should update project without touching skills", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };

    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);

    // Le mock doit renvoyer le projet avec le nouveau title
    prismaMock.project.update.mockResolvedValueOnce({
      ...existingProject,
      title: "Only Title Updated",
      skills: existingProject.skills.map(ps => ({
        ...ps,
        skill: availableSkills.find(s => s.id === ps.skillId)!,
      })),
    } as unknown as ProjectWithSkillsAndSkill);

    const result: ProjectResponse = await resolver.updateProject(
      { id: 100, title: "Only Title Updated" },
      context
    );

    expect(result.code as number).toBe(200);
    expect(result.project!.title).toBe("Only Title Updated");
  });

  it("should return 401 if no user authenticated", async () => {
    const result: ProjectResponse = await resolver.updateProject({ id: 1 }, baseContext);
    expect(result.code as number).toBe(401);
  });

  it("should return 403 if user is not admin or editor", async () => {
    const context: MyContext = { ...baseContext, user: regularUser };
    const result: ProjectResponse = await resolver.updateProject({ id: 1 }, context);
    expect(result.code as number).toBe(403);
  });

  it("should return 404 if project not found", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: ProjectResponse = await resolver.updateProject({ id: 999 }, context);
    expect(result.code as number).toBe(404);
  });

  it("should return 400 if skillIds are invalid", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([availableSkills[0]]);

    const result: ProjectResponse = await resolver.updateProject({ id: 100, skillIds: [1, 999] }, context);
    expect(result.code as number).toBe(400);
  });

  it("should return 500 on DB error (findUnique)", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockRejectedValueOnce(new Error("DB error"));

    const result: ProjectResponse = await resolver.updateProject({ id: 100 }, context);
    expect(result.code as number).toBe(500);
  });

  it("should return 500 on DB error (findMany)", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error("DB error"));

    const result: ProjectResponse = await resolver.updateProject({ id: 100, skillIds: [1] }, context);
    expect(result.code as number).toBe(500);
  });

  it("should return 500 on DB error (deleteMany)", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([availableSkills[0], availableSkills[1]]);
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error("DB error"));

    const result: ProjectResponse = await resolver.updateProject({ id: 100, skillIds: [1, 2] }, context);
    expect(result.code as number).toBe(500);
  });

  it("should return 500 on DB error (update)", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };
    prismaMock.project.findUnique.mockResolvedValueOnce(existingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce([availableSkills[0], availableSkills[1]]);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockRejectedValueOnce(new Error("DB error"));

    const result: ProjectResponse = await resolver.updateProject({ id: 100, skillIds: [1, 2] }, context);
    expect(result.code as number).toBe(500);
  });
});