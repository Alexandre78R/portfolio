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
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<ProjectSkill & { skill: Skill }>;
};

type PrismaProjectWithBasicSkills = PrismaProject & {
  skills: ProjectSkill[];
};

describe("ProjectAdminResolver - updateProject", (): void => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  let mockPrisma: DeepMockProxy<unknown>;
  let mockTransactionClient: DeepMockProxy<unknown>;

  beforeEach((): void => {
    mockPrisma = mockDeep<unknown>({
      project: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      skill: {
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    });

    mockTransactionClient = mockDeep<unknown>({
      projectSkill: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      project: {
        update: jest.fn(),
      },
    });

    resolver = new ProjectAdminResolver();

    Object.defineProperty(resolver, 'db', {
      value: mockPrisma,
      writable: true
    });

    (resolver as unknown).transformProject = jest.fn().mockImplementation(
      (projectPrisma: PrismaProjectWithSkills): { id: number; title: string; descriptionEN: string; descriptionFR: string; typeDisplay: string; github: string | null; contentDisplay: string; skills: Array<{ id: number; name: string; image: string }> } => {
        const skills: Array<{ id: number; name: string; image: string }> = (projectPrisma.skills || []).map(
          (ps: ProjectSkill & { skill: Skill }): { id: number; name: string; image: string } => ({
            id: ps.skill?.id || ps.skillId || 0,
            name: ps.skill?.name || '',
            image: ps.skill?.image || ''
          })
        );

        return {
          id: projectPrisma.id,
          title: projectPrisma.title,
          descriptionEN: projectPrisma.descriptionEN,
          descriptionFR: projectPrisma.descriptionFR,
          typeDisplay: projectPrisma.typeDisplay,
          github: projectPrisma.github ?? null,
          contentDisplay: projectPrisma.contentDisplay,
          skills
        };
      }
    );

    mockPrisma.$transaction.mockImplementation(
      async (callback: (client: DeepMockProxy<unknown>) => Promise<void>): Promise<void> => {
        await callback(mockTransactionClient);
      }
    );

    const mockReq: DeepMockProxy<Request> = mockDeep<Request>();
    const mockRes: DeepMockProxy<Response> = mockDeep<Response>();
    const mockCookies: DeepMockProxy<Cookies> = mockDeep<Cookies>();

    mockContext = {
      user: {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      },
      req: mockReq,
      res: mockRes,
      cookies: mockCookies,
      token: "mock-token",
    };
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("Success cases", (): void => {
    it("should update project title successfully", async (): Promise<void> => {
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
          skill: { id: 1, name: "React", image: "react.png" }
        }],
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project updated successfully");
      expect(result.project!.title).toBe("Updated Project Title");
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTransactionClient.project.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: "Updated Project Title" }
      });
    });

    it("should update multiple fields at once", async (): Promise<void> => {
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

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(200);
      expect(result.project!.title).toBe(input.title);
      expect(result.project!.descriptionEN).toBe(input.descriptionEN);
      expect(result.project!.github).toBe(input.github);
    });

    it("should update project skills successfully", async (): Promise<void> => {

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
          { projectId: 1, skillId: 2, skill: { id: 2, name: "TS", image: "ts.png" } },
          { projectId: 1, skillId: 3, skill: { id: 3, name: "Node", image: "node.png" } },
        ],
      };

      mockPrisma.skill.count.mockResolvedValue(2);
      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(updatedProject);
      
      mockTransactionClient.projectSkill.deleteMany.mockResolvedValue({ count: 1 });
      mockTransactionClient.projectSkill.createMany.mockResolvedValue({ count: 2 });

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

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

    it("should handle update with no data changes", async (): Promise<void> => {

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

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(200);
      expect(mockTransactionClient.project.update).not.toHaveBeenCalled();
    });
  });

  describe("Authentication & Authorization", (): void => {
    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const unauthContext: MyContext = { ...mockContext, user: null };

      const result: ProjectResponse = await resolver.updateProject(input, unauthContext);

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
      expect(mockPrisma.project.findUnique).not.toHaveBeenCalled();
    });

    it("should return 403 when user has view role", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const viewContext: MyContext = {
        ...mockContext,
        user: { ...mockContext.user!, role: UserRole.view }
      };

      const result: ProjectResponse = await resolver.updateProject(input, viewContext);

      expect(result.code).toBe(403);
      expect(result.message).toBe("Forbidden");
      expect(mockPrisma.project.findUnique).not.toHaveBeenCalled();
    });

    it("should allow editor role", async (): Promise<void> => {
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

      const result: ProjectResponse = await resolver.updateProject(input, editorContext);

      expect(result.code).toBe(200);
    });
  });

  describe("Validation errors", (): void => {
    it("should return 404 when project not found", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 999, title: "Test" };
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found");
    });

    it("should return 400 when invalid skill IDs", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 1, skillIds: [1, 999] };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Test", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.skill.count.mockResolvedValue(1);

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(400);
      expect(result.message).toContain("Found 1 valid skills out of 2");
    });
  });

  describe("Error handling", (): void => {
    it("should return 500 on transaction error", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Old", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique.mockResolvedValue(existingProject);
      mockPrisma.$transaction.mockRejectedValue(new Error("DB Error"));

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(500);
      expect(result.message).toBe("DB Error");
    });

    it("should return 404 if project missing after update", async (): Promise<void> => {
      const input: UpdateProjectInput = { id: 1, title: "Test" };
      const existingProject: PrismaProjectWithBasicSkills = {
        id: 1, title: "Old", descriptionEN: "", descriptionFR: "",
        typeDisplay: "image", github: null, contentDisplay: "", skills: []
      };

      mockPrisma.project.findUnique
        .mockResolvedValueOnce(existingProject)
        .mockResolvedValueOnce(null);

      const result: ProjectResponse = await resolver.updateProject(input, mockContext);

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found after update");
    });
  });
});
