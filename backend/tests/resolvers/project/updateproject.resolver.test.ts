import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import {
  PrismaClient,
  Project as PrismaProject,
  ProjectSkill,
  Skill,
  Prisma,
} from "@prisma/client";
import { UpdateProjectInput } from "../../../src/entities/inputs/project.input";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";

// ================= TYPES =================
type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<ProjectSkill & { skill: Skill }>;
};

type PrismaProjectWithBasicSkills = PrismaProject & {
  skills: ProjectSkill[];
};

// ================= TEST SUITE =================
describe("ProjectAdminResolver - updateProject", () => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  let mockPrisma: any;
  let mockTransactionClient: any;

  beforeEach(() => {
    mockPrisma = {
      project: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      skill: {
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    mockTransactionClient = {
      projectSkill: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      project: {
        update: jest.fn(),
      },
    };

    resolver = new ProjectAdminResolver();

    Object.defineProperty(resolver, 'db', {
      value: mockPrisma,
      writable: true
    });

    (resolver as any).transformProject = jest.fn().mockImplementation(
      (projectPrisma: any) => {
        const skills = (projectPrisma.skills || []).map(
          (ps: any) => ({
            id: ps.skill?.id || ps.skillId || 0,
            name: ps.skill?.name || '',
            image: ps.skill?.image || '',
            categoryId: ps.skill?.categoryId || 0
          })
        );

        return {
          id: projectPrisma.id,
          title: projectPrisma.title,
          descriptionEN: projectPrisma.descriptionEN,
          descriptionFR: projectPrisma.descriptionFR,
          typeDisplay: projectPrisma.typeDisplay,
          github: projectPrisma.github || null,
          contentDisplay: projectPrisma.contentDisplay,
          skills
        };
      }
    );

    mockPrisma.$transaction.mockImplementation(
      async (callback: any) => {
        await callback(mockTransactionClient);
      }
    );

    mockContext = {
      user: {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      },
      req: {} as any,
      res: {} as any,
      cookies: {} as any,
      token: "mock-token",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Success cases", () => {
    it("should update project title successfully", async () => {
      // Arrange
      const input: UpdateProjectInput = {
        id: 1,
        title: "Updated Project Title",
      };

      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1,
        title: "Original Title",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "image",
        github: null,
        contentDisplay: "image.jpg",
        skills: [{ projectId: 1, skillId: 1 }],
      };

      const updatedProject: PrismaProjectWithSkills = {
        ...existingProject,
        title: input.title!,
        skills: [{
          projectId: 1,
          skillId: 1,
          skill: { id: 1, name: "React", image: "react.png", categoryId: 1 }
        }],
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);

      // Act
      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(result.message).toBe("Project updated successfully");
      expect(result.project!.title).toBe("Updated Project Title");
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTransactionClient.project.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: "Updated Project Title" }
      });
    });

    it("should update multiple fields at once", async () => {
      // Arrange
      const input: UpdateProjectInput = {
        id: 1,
        title: "New Title",
        descriptionEN: "New Description EN",
        github: "https://github.com/new/repo",
      };

      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1,
        title: "Old Title",
        descriptionEN: "Old EN",
        descriptionFR: "Old FR",
        typeDisplay: "image",
        github: null,
        contentDisplay: "old.jpg",
        skills: [],
      };

      const updatedProject: PrismaProjectWithSkills = {
        id: 1,
        title: input.title!,
        descriptionEN: input.descriptionEN!,
        descriptionFR: "Old FR",
        typeDisplay: "image",
        github: input.github!,
        contentDisplay: "old.jpg",
        skills: [],
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);

      // Act
      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(result.project!.title).toBe(input.title);
      expect(result.project!.descriptionEN).toBe(input.descriptionEN);
      expect(result.project!.github).toBe(input.github);
    });

    it("should update project skills successfully", async () => {
      // Arrange
      const input: UpdateProjectInput = {
        id: 1,
        skillIds: [2, 3],
      };

      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1,
        title: "Project Title",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "image",
        github: null,
        contentDisplay: "image.jpg",
        skills: [{ projectId: 1, skillId: 1 }],
      };

      const updatedProject: PrismaProjectWithSkills = {
        ...existingProject,
        skills: [
          { projectId: 1, skillId: 2, skill: { id: 2, name: "TS", image: "ts.png", categoryId: 1 } },
          { projectId: 1, skillId: 3, skill: { id: 3, name: "Node", image: "node.png", categoryId: 2 } },
        ],
      };

      mockPrisma.skill.count.mockResolvedValue(2);
      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);
      
      mockTransactionClient.projectSkill.deleteMany.mockResolvedValue({ count: 1 });
      mockTransactionClient.projectSkill.createMany.mockResolvedValue({ count: 2 });

      // Act
      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(result.project!.skills).toHaveLength(2);
      expect(mockTransactionClient.projectSkill.deleteMany).toHaveBeenCalledWith({
        where: { projectId: 1, skillId: { in: [1] } }
      });
      expect(mockTransactionClient.projectSkill.createMany).toHaveBeenCalledWith({
        data: [
          { projectId: 1, skillId: 2 },
          { projectId: 1, skillId: 3 }
        ]
      });
    });

    it("should handle update with no data changes", async () => {
      // Arrange
      const input: UpdateProjectInput = { id: 1 };

      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1,
        title: "Project",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "image",
        github: null,
        contentDisplay: "image.jpg",
        skills: [],
      };

      const unchangedProject: PrismaProjectWithSkills = {
        ...existingProject,
        skills: [],
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(unchangedProject);

      // Act
      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(mockTransactionClient.project.update).not.toHaveBeenCalled();
    });
  });

  describe("Authentication & Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const unauthContext: MyContext = { ...mockContext, user: null };

      const result = await resolver.updateProject(input, unauthContext);

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
      expect(mockPrisma.project.findUnique).not.toHaveBeenCalled();
    });

    it("should return 403 when user has view role", async () => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const viewContext: MyContext = {
        ...mockContext,
        user: { ...mockContext.user!, role: UserRole.view }
      };

      const result = await resolver.updateProject(input, viewContext);

      expect(result.code).toBe(403);
      expect(result.message).toBe("Forbidden");
      expect(mockPrisma.project.findUnique).not.toHaveBeenCalled();
    });

    it("should allow editor role", async () => {
      const input: UpdateProjectInput = { id: 1, title: "Editor Update" };
      const editorContext: MyContext = {
        ...mockContext,
        user: { ...mockContext.user!, role: UserRole.editor }
      };

      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Old", descriptionEN: "", descriptionFR: "", 
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      const updatedProject: PrismaProjectWithSkills = {
        ...existingProject, title: input.title!, skills: []
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);

      const result = await resolver.updateProject(input, editorContext);

      expect(result.code).toBe(200);
    });
  });

  describe("Validation errors", () => {
    it("should return 404 when project not found", async () => {
      const input: UpdateProjectInput = { id: 999, title: "Test" };
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found");
    });

    it("should return 400 when invalid skill IDs", async () => {
      const input: UpdateProjectInput = { id: 1, skillIds: [1, 999] };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Test", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.skill.count.mockResolvedValue(1);

      const result = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(400);
      expect(result.message).toContain("Found 1 valid skills out of 2");
    });
  });

  describe("Error handling", () => {
    it("should return 500 on transaction error", async () => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Old", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.$transaction.mockRejectedValue(new Error("DB Error"));

      const result = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(500);
      expect(result.message).toBe("DB Error");
    });

    it("should return 404 if project missing after update", async () => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Old", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(null);

      const result = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found after update");
    });
  });
});
