import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { PrismaClient, Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import { CreateProjectInput } from "../../../src/entities/inputs/project.input";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";
import { mockDeep, type DeepMockProxy } from "jest-mock-extended";
import type { Request, Response } from "express";
import Cookies from "cookies";

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<ProjectSkill & { skill: Skill }>;
};

describe("ProjectAdminResolver - createProject", (): void => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach((): void => {
    mockPrisma = mockDeep<any>({
      skill: {
        count: jest.fn(),
      },
      project: {
        create: jest.fn(),
      },
    });

    resolver = new ProjectAdminResolver();
    
    Object.defineProperty(resolver, 'db', {
      value: mockPrisma,
      writable: true
    });

    (resolver as any).transformProject = jest.fn().mockImplementation(
      (projectPrisma: PrismaProjectWithSkills): ProjectResponse["project"] => {
        const skills: Array<{ id: number; name: string; image: string; categoryId: number }> = (projectPrisma.skills || []).map(
          (ps: ProjectSkill & { skill: Skill }): { id: number; name: string; image: string; categoryId: number } => ({
            id: ps.skill?.id || 0,
            name: ps.skill?.name || '',
            image: ps.skill?.image || '',
            categoryId: 0
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
          image: projectPrisma.image ?? null,
          video: projectPrisma.video ?? null,
          skills
        };
      }
    );

    const mockReq: DeepMockProxy<Request> = mockDeep<Request>();
    const mockRes: DeepMockProxy<Response> = mockDeep<Response>();
    const mockCookies: DeepMockProxy<Cookies> = mockDeep<Cookies>();

    mockContext= {
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

  describe("Success cases", (): void => {
    it("should create a project successfully with valid skills", async (): Promise<void> => {
      const input: CreateProjectInput = {
        title: "Test Project",
        descriptionEN: "Test description in English",
        descriptionFR: "Test description en français",
        typeDisplay: "PUBLIC",
        github: "https://github.com/test/project",
        contentDisplay: "test content",
        skillIds: [1, 2],
      };

      const mockCreatedProject: PrismaProjectWithSkills = {
        id: 1,
        title: input.title,
        descriptionEN: input.descriptionEN,
        descriptionFR: input.descriptionFR,
        typeDisplay: input.typeDisplay,
        github: input.github ?? null,
        contentDisplay: input.contentDisplay,
        image: null,
        video: null,
        skills: [],
      };

      mockPrisma.skill.count.mockResolvedValue(2);
      mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project created successfully");
      expect(result.project).toBeDefined();
      expect(result.project!.title).toBe(input.title);
    });

    it("should create a project without github URL", async (): Promise<void> => {
      const input: CreateProjectInput = {
        title: "Project Without GitHub",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "PUBLIC",
        contentDisplay: "test content",
        skillIds: [1],
      };

      const mockCreatedProject: PrismaProjectWithSkills = {
        id: 1,
        title: input.title,
        descriptionEN: input.descriptionEN,
        descriptionFR: input.descriptionFR,
        typeDisplay: input.typeDisplay,
        github: null,
        contentDisplay: input.contentDisplay,
        image: null,
        video: null,
        skills: [],
      };

      mockPrisma.skill.count.mockResolvedValue(1);
      mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(200);
      expect(result.project!.title).toBe(input.title);
      expect(result.project!.github).toBeNull();
    });
  });

  describe("Authentication", (): void => {
    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const input: CreateProjectInput = {
        title: "Test Project",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "PUBLIC",
        contentDisplay: "test content",
        skillIds: [1],
      };

      const unauthenticatedContext: MyContext = {
        ...mockContext,
        user: null,
      };

      const result: ProjectResponse = await resolver.createProject(input, unauthenticatedContext);

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
    });
  });

  describe("Validation errors", (): void => {
    it("should return 400 when no valid skills found", async (): Promise<void> => {
      const input: CreateProjectInput = {
        title: "Invalid Skills",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "PUBLIC",
        contentDisplay: "test content",
        skillIds: [999],
      };

      mockPrisma.skill.count.mockResolvedValue(0);

      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(400);
      expect(result.message).toContain("Found 0 valid skills");
    });
  });

  describe("Error handling", (): void => {
    it("should return 500 when Prisma create fails", async (): Promise<void> => {
      const input: CreateProjectInput = {
        title: "Failed Project",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "PUBLIC",
        contentDisplay: "test content",
        skillIds: [1],
      };

      mockPrisma.skill.count.mockResolvedValue(1);
      mockPrisma.project.create.mockRejectedValue(new Error("DB Error"));

      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(500);
      expect(result.message).toBe("DB Error");
    });
  });
});
