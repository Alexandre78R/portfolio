import "reflect-metadata";
import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { PrismaClient, Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import { CreateProjectInput } from "../../../src/entities/inputs/project.input";
import { MyContext } from "../../../src";
import { UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";

// ================= TYPES =================
type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<ProjectSkill & { skill: Skill }>;
};

// ================= TEST SUITE =================
describe("ProjectAdminResolver - createProject", () => {
  let resolver: ProjectAdminResolver;
  let mockContext: MyContext;
  let mockPrisma: any;

  beforeEach(() => {
    // ✅ Mock Prisma
    mockPrisma = {
      skill: {
        count: jest.fn(),
      },
      project: {
        create: jest.fn(),
      },
    };

    resolver = new ProjectAdminResolver();
    
    // ✅ Injecter le mock dans la propriété privée 'db'
    Object.defineProperty(resolver, 'db', {
      value: mockPrisma,
      writable: true
    });

    // ✅ Mock transformProject - TypeScript SAFE
    (resolver as any).transformProject = jest.fn().mockImplementation(
      (projectPrisma: any) => {
        const skills = (projectPrisma.skills || []).map(
          (ps: any) => ({
            id: ps.skill?.id || ps.id || 0,
            name: ps.skill?.name || ps.name || '',
            image: ps.skill?.image || ps.image || '',
            categoryId: ps.skill?.categoryId || ps.categoryId || 0
          })
        );

        return {
          id: projectPrisma.id,
          title: projectPrisma.title,
          descriptionEN: projectPrisma.descriptionEN,
          descriptionFR: projectPrisma.descriptionFR,
          typeDisplay: projectPrisma.typeDisplay,
          github: projectPrisma.github || null, // ✅ Fix TypeScript
          contentDisplay: projectPrisma.contentDisplay,
          skills
        };
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
    it("should create a project successfully with valid skills", async () => {
      // Arrange
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
        github: input.github || null, // ✅ Fix TypeScript
        contentDisplay: input.contentDisplay,
        skills: [],
      };

      mockPrisma.skill.count.mockResolvedValue(2);
      mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

      // Act
      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(result.message).toBe("Project created successfully");
      expect(result.project).toBeDefined();
      expect(result.project!.title).toBe(input.title);
    });

    it("should create a project without github URL", async () => {
      // Arrange
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
        github: null, // ✅ null explicite
        contentDisplay: input.contentDisplay,
        skills: [],
      };

      mockPrisma.skill.count.mockResolvedValue(1);
      mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

      // Act
      const result: ProjectResponse = await resolver.createProject(input, mockContext);

      // Assert
      expect(result.code).toBe(200);
      expect(result.project!.title).toBe(input.title);
      expect(result.project!.github).toBeNull();
    });
  });

  describe("Authentication", () => {
    it("should return 401 when user is not authenticated", async () => {
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

      const result = await resolver.createProject(input, unauthenticatedContext);

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
    });
  });

  describe("Validation errors", () => {
    it("should return 400 when no valid skills found", async () => {
      const input: CreateProjectInput = {
        title: "Invalid Skills",
        descriptionEN: "Description EN",
        descriptionFR: "Description FR",
        typeDisplay: "PUBLIC",
        contentDisplay: "test content",
        skillIds: [999],
      };

      mockPrisma.skill.count.mockResolvedValue(0);

      const result = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(400);
      expect(result.message).toContain("Found 0 valid skills");
    });
  });

  describe("Error handling", () => {
    it("should return 500 when Prisma create fails", async () => {
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

      const result = await resolver.createProject(input, mockContext);

      expect(result.code).toBe(500);
      expect(result.message).toBe("DB Error");
    });
  });
});
