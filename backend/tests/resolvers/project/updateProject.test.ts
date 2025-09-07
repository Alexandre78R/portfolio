import "reflect-metadata";
import { ProjectResolver } from "../../../src/resolvers/project.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { UpdateProjectInput } from "../../../src/entities/inputs/project.input"; // Adjust path if needed
import { ProjectResponse } from "../../../src/types/response.types";
import Cookies from 'cookies';
import { Project as PrismaProject, Skill as PrismaSkill, ProjectSkill as PrismaProjectSkill } from "@prisma/client";
import { mockDeep } from 'jest-mock-extended';

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
  };

  const mockExistingProject: PrismaProject & { skills: PrismaProjectSkill[] } = {
    id: 100,
    title: "Old Project Title",
    descriptionEN: "Old English description.",
    descriptionFR: "Ancienne description française.",
    typeDisplay: "Old Type",
    github: "https://github.com/oldproject",
    contentDisplay: "Old project content.",
    skills: [{ projectId: 100, skillId: 1 }, { projectId: 100, skillId: 2}],
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

    mockCookies.set.mockClear();
    mockCookies.get.mockClear();
  });

  it("should successfully update a project with all fields (including skillIds) by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      title: "Updated Project Title",
      descriptionEN: "New English description.",
      descriptionFR: "Nouvelle description française.",
      typeDisplay: "Updated Type",
      github: "https://github.com/updatedproject",
      contentDisplay: "Updated content.",
      skillIds: [1, 3],
    };

    const validSkillsForInput = mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id));

    const mockUpdatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
      ...mockExistingProject,
      ...updateInput,
      skills: [
        { projectId: mockExistingProject.id, skillId: 1, skill: mockAvailableSkills[0] },
        { projectId: mockExistingProject.id, skillId: 3, skill: mockAvailableSkills[2] },
      ],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(validSkillsForInput); 
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 }); 
    prismaMock.project.update.mockResolvedValueOnce(mockUpdatedProject); 

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project).toBeDefined();
    expect(result.project!.id).toBe(mockExistingProject.id);
    expect(result.project!.title).toBe(updateInput.title);
    expect(result.project!.descriptionEN).toBe(updateInput.descriptionEN);
    expect(result.project!.skills.length).toBe(2);
    expect(result.project!.skills[0]).toEqual(createSkillDto(mockAvailableSkills[0]));
    expect(result.project!.skills[1]).toEqual(createSkillDto(mockAvailableSkills[2]));

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: updateInput.id },
      include: { skills: true },
    });
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledWith({ where: { id: { in: updateInput.skillIds } } });
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledWith({ where: { projectId: updateInput.id } });
    expect(prismaMock.project.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id: updateInput.id },
      data: {
        ...updateInput,
        id: undefined,
        skillIds: undefined,
        skills: {
          create: updateInput.skillIds!.map(skillId => ({ skill: { connect: { id: skillId } } }))
        },
      },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should successfully update a project with all fields (including skillIds) by an editor user", async () => {
    const editorContext: MyContext = { ...baseMockContext, user: mockEditorUser };

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      title: "Editor Updated Project Title",
      descriptionEN: "Editor updated English description.",
      skillIds: [1],
    };

    const validSkillsForInput = mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id));
    const mockUpdatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
      ...mockExistingProject,
      ...updateInput,
      skills: [{ projectId: mockExistingProject.id, skillId: 1, skill: mockAvailableSkills[0] }],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(validSkillsForInput);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockResolvedValueOnce(mockUpdatedProject);

    const result: ProjectResponse = await resolver.updateProject(updateInput, editorContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project).toBeDefined();
    expect(result.project!.title).toBe(updateInput.title);
    expect(result.project!.skills.length).toBe(1);

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).toHaveBeenCalledTimes(1);
  });

  it("should successfully update project fields without changing skills by an admin user", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      title: "Title Only Updated",
      descriptionFR: "Description FR updated.",
    };

    const mockUpdatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
      ...mockExistingProject,
      ...updateInput,
      skills: mockExistingProject.skills.map(ps => ({
        ...ps, skill: mockAvailableSkills.find(s => s.id === ps.skillId)!
      })),
    };

    prismaMock.project.findUnique.mockResolvedValueOnce({
      ...mockExistingProject,
    });
    prismaMock.project.update.mockResolvedValueOnce(mockUpdatedProject);

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project!.title).toBe(updateInput.title);
    expect(result.project!.descriptionFR).toBe(updateInput.descriptionFR);

    expect(result.project!.skills.length).toBe(2);
    expect(result.project!.skills[0].id).toBe(mockExistingProject.skills[0].skillId);
    expect(result.project!.skills[1].id).toBe(mockExistingProject.skills[1].skillId);


    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).toHaveBeenCalledWith({
      where: { id: updateInput.id },
      data: {
        ...updateInput,
        id: undefined, 
        skills: undefined, 
      },
      include: { skills: { include: { skill: true } } },
    });
  });

  it("should successfully update only project skills by an admin user", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      skillIds: [3],
    };

    const validSkillsForInput = mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id));
    const mockUpdatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } = {
      ...mockExistingProject,
      skills: [
        { projectId: mockExistingProject.id, skillId: 3, skill: mockAvailableSkills[2] },
      ],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(validSkillsForInput);
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockResolvedValueOnce(mockUpdatedProject);

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Project updated successfully");
    expect(result.project!.skills.length).toBe(1);
    expect(result.project!.skills[0]).toEqual(createSkillDto(mockAvailableSkills[2]));

    expect(result.project!.title).toBe(mockExistingProject.title);


    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {

    const unauthenticatedContext: MyContext = { ...baseMockContext, user: null };

    const result: ProjectResponse = await resolver.updateProject({ id: 1, title: "Test" }, unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin or editor", async () => {
    const regularUserContext: MyContext = { ...baseMockContext, user: mockRegularUser };

    const result: ProjectResponse = await resolver.updateProject({ id: 1, title: "Test" }, regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 404 if the project to update is not found", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    
    prismaMock.project.findUnique.mockResolvedValueOnce(null);

    const result: ProjectResponse = await resolver.updateProject({ id: 999, title: "Non Existent" }, adminContext);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Project not found");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
      include: { skills: true },
    });
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 400 if one or more skill IDs are invalid when updating skills", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      skillIds: [1, 999],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockAvailableSkills.filter(s => s.id === 1));

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(400);
    expect(result.message).toBe("One or more skill IDs are invalid.");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledWith({ where: { id: { in: updateInput.skillIds } } });
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during initial project lookup (findUnique)", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during project findUnique";

    prismaMock.project.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectResponse = await resolver.updateProject({ id: mockExistingProject.id, title: "Test" }, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).not.toHaveBeenCalled();
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during skill validation (findMany)", async () => {
 
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during skill findMany";

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      skillIds: [1, 2],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).not.toHaveBeenCalled();
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during projectSkill deletion (deleteMany)", async () => {
    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during projectSkill deleteMany";

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      skillIds: [1, 2],
    };

    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject);
    prismaMock.skill.findMany.mockResolvedValueOnce(mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id)));
    prismaMock.projectSkill.deleteMany.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);
    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).not.toHaveBeenCalled();
  });

  it("should return 500 for a database error during project update (update)", async () => {

    const adminContext: MyContext = { ...baseMockContext, user: mockAdminUser };
    const errorMessage = "DB error during project update";

    const updateInput: UpdateProjectInput = {
      id: mockExistingProject.id,
      skillIds: [1, 2],
    };


    prismaMock.project.findUnique.mockResolvedValueOnce(mockExistingProject); 
    prismaMock.skill.findMany.mockResolvedValueOnce(mockAvailableSkills.filter(s => updateInput.skillIds!.includes(s.id))); 
    prismaMock.projectSkill.deleteMany.mockResolvedValueOnce({ count: 2 });
    prismaMock.project.update.mockRejectedValueOnce(new Error(errorMessage));

    const result: ProjectResponse = await resolver.updateProject(updateInput, adminContext);


    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.project).toBeUndefined();

    expect(prismaMock.project.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.skill.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.projectSkill.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.project.update).toHaveBeenCalledTimes(1);
  });
});