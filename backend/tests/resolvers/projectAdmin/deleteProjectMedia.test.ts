import "reflect-metadata";

import { ProjectAdminResolver } from "../../../src/resolvers/projectAdmin.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { ProjectResponse } from "../../../src/types/response.types";

import type {
  Project as PrismaProject,
  Skill as PrismaSkill,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";

import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import Cookies from "cookies";
import fs from "fs";
import path from "path";

// Mock the entire @prisma/client module
jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
  PrismaClient: jest.fn(() => prismaMock),
}));

// Mock fs module
jest.mock("fs");
const mockFs = fs as jest.Mocked<typeof fs>;

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

describe("ProjectAdminResolver - deleteProjectMedia", () => {
  let resolver: ProjectAdminResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const adminUser: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const editorUser: Readonly<User> = {
    id: 2,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    role: UserRole.editor,
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
  ];

  const projectWithImageMedia: PrismaProjectWithSkills = {
    id: 1,
    title: "Project with Image",
    descriptionEN: "Project description EN",
    descriptionFR: "Project description FR",
    typeDisplay: "image",
    github: "https://github.com/project",
    contentDisplay: "project-image.jpg",
    skills: [
      { projectId: 1, skillId: 1, skill: existingSkills[0] },
    ],
  };

  const projectWithVideoMedia: PrismaProjectWithSkills = {
    id: 2,
    title: "Project with Video",
    descriptionEN: "Project description EN",
    descriptionFR: "Project description FR",
    typeDisplay: "video",
    github: "https://github.com/project2",
    contentDisplay: "project-video.mp4",
    skills: [
      { projectId: 2, skillId: 2, skill: existingSkills[1] },
    ],
  };

  const projectWithoutMedia: PrismaProjectWithSkills = {
    id: 3,
    title: "Project without Media",
    descriptionEN: "Project description EN",
    descriptionFR: "Project description FR",
    typeDisplay: "",
    github: "https://github.com/project3",
    contentDisplay: "",
    skills: [],
  };

  const clearedProject: PrismaProjectWithSkills = {
    ...projectWithImageMedia,
    typeDisplay: "",
    contentDisplay: "",
  };

  const expectedClearedProject: ProjectResolverOutput = {
    id: clearedProject.id,
    title: clearedProject.title,
    descriptionEN: clearedProject.descriptionEN,
    descriptionFR: clearedProject.descriptionFR,
    typeDisplay: "",
    github: clearedProject.github,
    contentDisplay: "",
    skills: clearedProject.skills.map(({ skill }) => ({
      id: skill.id,
      name: skill.name,
      image: skill.image,
      categoryId: skill.categoryId,
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    cookiesMock = mockDeep<Cookies>();

    // Resolver will use prismaMock automatically
    resolver = new ProjectAdminResolver();

    prismaMock.project.findUnique.mockReset();
    prismaMock.project.update.mockReset();

    // Setup default fs mocks
    mockFs.existsSync.mockReturnValue(true);
    mockFs.unlinkSync.mockImplementation(() => {});
  });

  describe("Authentication and Authorization", () => {
    it("should return 401 when user is not authenticated", async () => {
      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        baseContext,
      );

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required");
      expect(result.project).toBeUndefined();
    });

    it("should allow admin user to delete project media", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project media deleted successfully");
    });

    it("should allow editor user to delete project media", async () => {
      const context: MyContext = {
        ...baseContext,
        user: editorUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project media deleted successfully");
    });
  });

  describe("Delete Media - Success Cases", () => {
    it("should delete image media and clear DB fields", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        projectWithImageMedia.id,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project media deleted successfully");
      expect(result.project).toEqual(expectedClearedProject);
      expect(result.project?.typeDisplay).toBe("");
      expect(result.project?.contentDisplay).toBe("");

      // Verify file deletion was attempted
      expect(mockFs.existsSync).toHaveBeenCalled();
      expect(mockFs.unlinkSync).toHaveBeenCalled();
    });

    it("should delete video media correctly", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const clearedVideoProject: PrismaProjectWithSkills = {
        ...projectWithVideoMedia,
        typeDisplay: "",
        contentDisplay: "",
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithVideoMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedVideoProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        projectWithVideoMedia.id,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.typeDisplay).toBe("");
      expect(result.project?.contentDisplay).toBe("");

      // Verify video file path was used - normalize for cross-platform
      const unlinkCalls = mockFs.unlinkSync.mock.calls;
      expect(unlinkCalls.length).toBeGreaterThan(0);
      const filePath = unlinkCalls[0][0] as string;
      const normalizedPath = filePath.replace(/\\/g, '/');
      expect(normalizedPath).toContain("videos/projects");
    });

    it("should handle project with no media gracefully", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithoutMedia);
      prismaMock.project.update.mockResolvedValueOnce(projectWithoutMedia);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        projectWithoutMedia.id,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project media deleted successfully");

      // Should not attempt file deletion
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });

    it("should preserve project skills after media deletion", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const projectWithMultipleSkills: PrismaProjectWithSkills = {
        ...projectWithImageMedia,
        skills: [
          { projectId: 1, skillId: 1, skill: existingSkills[0] },
          { projectId: 1, skillId: 2, skill: existingSkills[1] },
        ],
      };

      const clearedWithSkills: PrismaProjectWithSkills = {
        ...projectWithMultipleSkills,
        typeDisplay: "",
        contentDisplay: "",
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithMultipleSkills);
      prismaMock.project.update.mockResolvedValueOnce(clearedWithSkills);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.project?.skills).toBeDefined();
      expect(result.project?.skills.length).toBe(2);
      expect(result.project?.skills[0].name).toBe("React");
      expect(result.project?.skills[1].name).toBe("Node.js");
    });

    it("should succeed even if file doesn't exist on disk", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      mockFs.existsSync.mockReturnValue(false);

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        projectWithImageMedia.id,
        context,
      );

      expect(result.code).toBe(200);
      expect(result.message).toBe("Project media deleted successfully");

      // unlinkSync should not be called if file doesn't exist
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });

    it("should continue if file deletion fails", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      mockFs.unlinkSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        projectWithImageMedia.id,
        context,
      );

      // Should still succeed and clear DB fields
      expect(result.code).toBe(200);
      expect(result.project?.typeDisplay).toBe("");
      expect(result.project?.contentDisplay).toBe("");
    });
  });

  describe("Delete Media - Error Cases", () => {
    it("should return 404 when project does not exist", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        999999,
        context,
      );

      expect(result.code).toBe(404);
      expect(result.message).toBe("Project not found");
      expect(result.project).toBeUndefined();
    });

    it("should return 500 when findUnique throws an error", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockRejectedValueOnce(
        new Error("Database error"),
      );

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        context,
      );

      expect(result.code).toBe(500);
      expect(result.message).toBe("Internal server error");
    });

    it("should return 500 when update throws an error", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockRejectedValueOnce(
        new Error("Database error"),
      );

      const result: ProjectResponse = await resolver.deleteProjectMedia(
        1,
        context,
      );

      expect(result.code).toBe(500);
      expect(result.message).toBe("Internal server error");
    });
  });

  describe("File System Operations", () => {
    it("should construct correct file path for images", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      await resolver.deleteProjectMedia(projectWithImageMedia.id, context);

      const existsCalls = mockFs.existsSync.mock.calls;
      expect(existsCalls.length).toBeGreaterThan(0);
      const filePath = existsCalls[0][0] as string;
      // Normalize path for cross-platform testing (Windows uses backslashes)
      const normalizedPath = filePath.replace(/\\/g, '/');
      expect(normalizedPath).toContain("images/projects");
      expect(filePath).toContain(projectWithImageMedia.contentDisplay);
    });

    it("should construct correct file path for videos", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      const clearedVideoProject: PrismaProjectWithSkills = {
        ...projectWithVideoMedia,
        typeDisplay: "",
        contentDisplay: "",
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithVideoMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedVideoProject);

      await resolver.deleteProjectMedia(projectWithVideoMedia.id, context);

      const existsCalls = mockFs.existsSync.mock.calls;
      expect(existsCalls.length).toBeGreaterThan(0);
      const filePath = existsCalls[0][0] as string;
      // Normalize path for cross-platform testing (Windows uses backslashes)
      const normalizedPath = filePath.replace(/\\/g, '/');
      expect(normalizedPath).toContain("videos/projects");
      expect(filePath).toContain(projectWithVideoMedia.contentDisplay);
    });
  });

  describe("Prisma Mock Verification", () => {
    it("should call findUnique with correct parameters", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      await resolver.deleteProjectMedia(projectWithImageMedia.id, context);

      expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectWithImageMedia.id },
        include: { skills: { include: { skill: true } } },
      });
    });

    it("should call update with correct parameters", async () => {
      const context: MyContext = {
        ...baseContext,
        user: adminUser,
        cookies: cookiesMock,
      };

      prismaMock.project.findUnique.mockResolvedValueOnce(projectWithImageMedia);
      prismaMock.project.update.mockResolvedValueOnce(clearedProject);

      await resolver.deleteProjectMedia(projectWithImageMedia.id, context);

      expect(prismaMock.project.update).toHaveBeenCalledWith({
        where: { id: projectWithImageMedia.id },
        data: { contentDisplay: "", typeDisplay: "" },
        include: { skills: { include: { skill: true } } },
      });
    });
  });
});